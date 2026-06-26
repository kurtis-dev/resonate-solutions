import { NextResponse } from "next/server";
import { buildCustomerOnboardingRecord, notifyOnboardingWebhook } from "@/lib/customer-onboarding";
import { upsertCustomerOnboarding } from "@/lib/customer-store";
import { getConfiguredPaymentLink, getPlanById } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const planId = String(formData.get("plan") || "");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const plan = getPlanById(planId);

  if (!plan || plan.paymentMode === "none") {
    return redirectTo(request, "/pricing?checkout=invalid-plan");
  }

  if (!email) {
    return redirectTo(request, `/checkout?plan=${plan.id}&status=missing-email`);
  }

  const onboarding = buildCustomerOnboardingRecord({
    source: "website_checkout",
    businessName: String(formData.get("businessName") || ""),
    contactName: String(formData.get("contactName") || ""),
    email,
    phone: String(formData.get("phone") || ""),
    businessType: String(formData.get("businessType") || ""),
    city: String(formData.get("city") || ""),
    currentMenuLink: String(formData.get("currentMenuLink") || ""),
    mainNeed: String(formData.get("mainNeed") || ""),
    packageInterest: plan.name,
    planId: plan.id,
    planName: plan.name,
    paymentStatus: "pending",
    onboardingStatus: "payment_pending",
    notes: String(formData.get("notes") || "")
  });
  await upsertCustomerOnboarding(onboarding);
  await notifyOnboardingWebhook(onboarding, "paid_plan_started");

  const stripe = getStripe();
  const priceId = plan.stripePriceEnvKey ? process.env[plan.stripePriceEnvKey] : "";

  if (!stripe || !priceId) {
    const paymentLink = getConfiguredPaymentLink(plan);

    if (paymentLink) {
      return NextResponse.redirect(paymentLink, { status: 303 });
    }

    return redirectTo(request, `/checkout?plan=${plan.id}&status=missing-stripe`);
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: plan.paymentMode,
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email || undefined,
    customer_creation: plan.paymentMode === "payment" ? "always" : undefined,
    allow_promotion_codes: true,
    metadata: {
      onboardingId: onboarding.id,
      planId: plan.id,
      planName: plan.name,
      businessName: onboarding.businessName,
      contactName: onboarding.contactName
    },
    subscription_data: plan.paymentMode === "subscription" ? { metadata: { planId: plan.id } } : undefined,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?plan=${plan.id}&status=cancelled`
  });

  if (!session.url) {
    return redirectTo(request, `/checkout?plan=${plan.id}&status=checkout-error`);
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
