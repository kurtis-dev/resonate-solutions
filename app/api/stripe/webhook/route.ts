import { NextResponse } from "next/server";
import { savePaymentEvent, upsertSubscriptionStatus } from "@/lib/customer-store";
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

    if (stripeCustomerId) {
      await upsertSubscriptionStatus({
        stripeCustomerId,
        stripeSubscriptionId: session.subscription ? String(session.subscription) : undefined,
        stripeCheckoutSessionId: session.id,
        customerEmail: session.customer_details?.email || session.customer_email || undefined,
        planId: session.metadata?.planId,
        status: session.payment_status || "completed"
      });
    }

    await savePaymentEvent({
      stripeEventId: event.id,
      stripeCustomerId: stripeCustomerId || undefined,
      stripeSubscriptionId: session.subscription ? String(session.subscription) : undefined,
      customerEmail: session.customer_details?.email || session.customer_email || undefined,
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
