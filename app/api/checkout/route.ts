import { NextResponse } from "next/server";
import { getPlanById } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const planId = String(formData.get("plan") || "");
  const email = String(formData.get("email") || "");
  const plan = getPlanById(planId);

  if (!plan || plan.paymentMode === "none") {
    return redirectTo(request, "/pricing?checkout=invalid-plan");
  }

  const stripe = getStripe();
  const priceId = plan.stripePriceEnvKey ? process.env[plan.stripePriceEnvKey] : "";

  if (!stripe || !priceId) {
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
      planId: plan.id,
      planName: plan.name
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
