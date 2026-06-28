import { NextResponse } from "next/server";
import { buildCustomerOnboardingRecord, notifyOnboardingWebhook } from "@/lib/customer-onboarding";
import { savePaymentEvent, upsertCustomerOnboarding, upsertSubscriptionStatus } from "@/lib/customer-store";
import { notifyOpsAlert } from "@/lib/ops-alerts";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function toIso(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const stripeCustomerId = session.customer ? String(session.customer) : "";
    const customerEmail = session.customer_details?.email || session.customer_email || "";
    const planId = session.metadata?.planId || "setup";
    const onboarding = customerEmail
      ? buildCustomerOnboardingRecord({
          id: session.metadata?.onboardingId || undefined,
          source: "stripe_webhook",
          businessName: session.metadata?.businessName || "",
          contactName: session.metadata?.contactName || "",
          email: customerEmail,
          phone: session.metadata?.phone || "",
          businessType: session.metadata?.businessType || "",
          city: session.metadata?.city || "",
          currentMenuLink: session.metadata?.currentMenuLink || "",
          mainNeed: session.metadata?.mainNeed || "",
          planId,
          packageInterest: session.metadata?.planName || "",
          paymentStatus: session.payment_status || "paid",
          onboardingStatus: session.subscription ? "subscription_active" : "paid_needs_review",
          stripeCustomerId,
          stripeSubscriptionId: session.subscription ? String(session.subscription) : undefined,
          stripeCheckoutSessionId: session.id
        })
      : null;

    if (stripeCustomerId) {
      await upsertSubscriptionStatus({
        stripeCustomerId,
        stripeSubscriptionId: session.subscription ? String(session.subscription) : undefined,
        stripeCheckoutSessionId: session.id,
        customerEmail: customerEmail || undefined,
        planId,
        status: session.payment_status || "completed"
      });
    }

    if (onboarding) {
      await upsertCustomerOnboarding(onboarding);
      await notifyOnboardingWebhook(onboarding, "payment_completed");
      await notifyOpsAlert({
        eventType: "payment_completed",
        priority: "high",
        title: "Payment completed",
        message: `${onboarding.businessName || onboarding.email} completed payment for ${onboarding.planName}.`,
        businessName: onboarding.businessName,
        contactName: onboarding.contactName,
        email: onboarding.email,
        phone: onboarding.phone,
        planName: onboarding.planName,
        source: "stripe_webhook",
        actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.resonate.solutions"}/admin`,
        metadata: {
          stripeCheckoutSessionId: session.id,
          stripeCustomerId,
          stripeSubscriptionId: session.subscription ? String(session.subscription) : "",
          amountTotal: session.amount_total,
          currency: session.currency
        }
      });
    }

    await savePaymentEvent({
      stripeEventId: event.id,
      stripeCustomerId: stripeCustomerId || undefined,
      stripeSubscriptionId: session.subscription ? String(session.subscription) : undefined,
      customerEmail: customerEmail || undefined,
      type: event.type,
      status: session.payment_status || "completed",
      amountPaid: session.amount_total || undefined,
      currency: session.currency || undefined
    });
  }

  if (event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as {
      customer?: string | null;
      subscription?: string | null;
      customer_email?: string | null;
      status?: string | null;
      amount_paid?: number;
      currency?: string;
    };
    await savePaymentEvent({
      stripeEventId: event.id,
      stripeCustomerId: invoice.customer ? String(invoice.customer) : undefined,
      stripeSubscriptionId: invoice.subscription ? String(invoice.subscription) : undefined,
      customerEmail: invoice.customer_email || undefined,
      type: event.type,
      status: invoice.status || "unknown",
      amountPaid: invoice.amount_paid,
      currency: invoice.currency
    });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as {
      customer: string;
      id: string;
      metadata?: { planId?: string };
      status: string;
      current_period_end?: number | null;
    };
    await upsertSubscriptionStatus({
      stripeCustomerId: String(subscription.customer),
      stripeSubscriptionId: subscription.id,
      planId: subscription.metadata?.planId,
      status: subscription.status,
      currentPeriodEnd: toIso(subscription.current_period_end)
    });
  }

  return NextResponse.json({ received: true });
}
