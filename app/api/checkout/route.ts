import { NextResponse } from "next/server";
import { buildCustomerOnboardingRecord, notifyOnboardingWebhook } from "@/lib/customer-onboarding";
import { sendCustomerEmail } from "@/lib/customer-emails";
import { saveIntakeRecord, upsertCustomerOnboarding, upsertLeadTask } from "@/lib/customer-store";
import { createIntakeRecord, type IntakePayload } from "@/lib/intake";
import { buildFreePlanReceiptEmail, createFreePlanLeadTask } from "@/lib/lead-tasks";
import { getConfiguredPaymentLink, getPlanById } from "@/lib/plans";
import { notifyOpsAlert } from "@/lib/ops-alerts";
import { getStripe } from "@/lib/stripe";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function metadataValue(value: string | undefined) {
  return (value || "").slice(0, 480);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const planId = formValue(formData, "plan");
  const email = formValue(formData, "email").toLowerCase();
  const plan = getPlanById(planId);

  if (!plan) {
    return redirectTo(request, "/pricing?checkout=invalid-plan");
  }

  if (!email) {
    return redirectTo(request, `/checkout?plan=${plan.id}&status=missing-email`);
  }

  const intakePayload: IntakePayload = {
    businessName: formValue(formData, "businessName"),
    contactName: formValue(formData, "contactName"),
    email,
    phone: formValue(formData, "phone"),
    businessType: formValue(formData, "businessType"),
    city: formValue(formData, "city"),
    currentMenuLink: formValue(formData, "currentMenuLink"),
    mainNeed: formValue(formData, "mainNeed"),
    packageInterest: plan.name,
    notes: formValue(formData, "notes"),
    source: plan.paymentMode === "none" ? "website_free_page_plan" : "website_checkout"
  };
  const onboarding = buildCustomerOnboardingRecord({
    ...intakePayload,
    source: plan.paymentMode === "none" ? "website_intake" : "website_checkout",
    planId: plan.id,
    planName: plan.name,
    paymentStatus: plan.paymentMode === "none" ? "not_required" : "pending",
    onboardingStatus: plan.paymentMode === "none" ? "intake_received" : "payment_pending"
  });

  if (plan.paymentMode === "none") {
    const intake = createIntakeRecord(intakePayload);
    const freeOnboarding = {
      ...onboarding,
      createdAt: intake.createdAt
    };

    await saveIntakeRecord(intake);
    await upsertCustomerOnboarding(freeOnboarding);
    const leadTask = createFreePlanLeadTask(freeOnboarding, intake);
    await upsertLeadTask(leadTask);
    const receipt = buildFreePlanReceiptEmail(freeOnboarding, leadTask);
    await sendCustomerEmail({
      to: freeOnboarding.email,
      subject: receipt.subject,
      text: receipt.text
    });
    await notifyOpsAlert({
      eventType: "customer_signup",
      priority: "high",
      title: "New MenuPilot signup",
      message: `${freeOnboarding.businessName || "A new business"} requested the ${freeOnboarding.planName}.`,
      businessName: freeOnboarding.businessName,
      contactName: freeOnboarding.contactName,
      email: freeOnboarding.email,
      phone: freeOnboarding.phone,
      planName: freeOnboarding.planName,
      source: "website_checkout",
      actionUrl: `${origin}/admin`
    });
    await notifyOnboardingWebhook(freeOnboarding, "customer_intake_submitted");

    return redirectTo(request, `/checkout/success?plan=${plan.id}&status=free-requested`);
  }

  await upsertCustomerOnboarding(onboarding);
  await notifyOnboardingWebhook(onboarding, "paid_plan_started");
  await notifyOpsAlert({
    eventType: "paid_plan_started",
    priority: "high",
    title: "Paid plan started",
    message: `${onboarding.businessName || "A customer"} started ${onboarding.planName}. Stripe may still need to complete.`,
    businessName: onboarding.businessName,
    contactName: onboarding.contactName,
    email: onboarding.email,
    phone: onboarding.phone,
    planName: onboarding.planName,
    source: "website_checkout",
    actionUrl: `${origin}/admin`
  });

  const stripe = getStripe();
  const priceId = plan.stripePriceEnvKey ? process.env[plan.stripePriceEnvKey] : "";

  if (!stripe || !priceId) {
    const paymentLink = getConfiguredPaymentLink(plan);

    if (paymentLink) {
      return NextResponse.redirect(paymentLink, { status: 303 });
    }

    return redirectTo(request, `/checkout?plan=${plan.id}&status=missing-stripe`);
  }

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
      businessName: metadataValue(onboarding.businessName),
      contactName: metadataValue(onboarding.contactName),
      phone: metadataValue(onboarding.phone),
      businessType: metadataValue(onboarding.businessType),
      city: metadataValue(onboarding.city),
      currentMenuLink: metadataValue(onboarding.currentMenuLink),
      mainNeed: metadataValue(onboarding.mainNeed)
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
