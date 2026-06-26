import { getSql } from "@/lib/db";
import type { CustomerOnboardingRecord } from "@/lib/customer-onboarding";
import type { IntakeRecord } from "@/lib/intake";

export type SubscriptionStatus = {
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripeCheckoutSessionId?: string;
  customerEmail?: string;
  planId?: string;
  status: string;
  currentPeriodEnd?: string | null;
};

export type PaymentEvent = {
  stripeEventId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  customerEmail?: string;
  type: string;
  status: string;
  amountPaid?: number;
  currency?: string;
};

export async function saveIntakeRecord(record: IntakeRecord) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Intake was not persisted.", record);
    return { persisted: false };
  }

  await sql`
    insert into intake_requests (
      id,
      created_at,
      business_name,
      contact_name,
      email,
      phone,
      business_type,
      city,
      current_menu_link,
      main_need,
      package_interest,
      notes,
      source
    )
    values (
      ${record.id},
      ${record.createdAt},
      ${record.businessName},
      ${record.contactName},
      ${record.email},
      ${record.phone || null},
      ${record.businessType},
      ${record.city},
      ${record.currentMenuLink || null},
      ${record.mainNeed},
      ${record.packageInterest},
      ${record.notes || null},
      ${record.source || "website"}
    )
  `;

  return { persisted: true };
}

export async function upsertCustomerOnboarding(record: CustomerOnboardingRecord) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Customer onboarding was not persisted.", record);
    return { persisted: false };
  }

  try {
    await sql`
      insert into customer_onboarding (
        id,
        created_at,
        updated_at,
        source,
        business_name,
        contact_name,
        email,
        phone,
        business_type,
        city,
        current_menu_link,
        main_need,
        package_interest,
        plan_id,
        plan_name,
        payment_status,
        onboarding_status,
        notes,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_checkout_session_id,
        portal_access
      )
      values (
        ${record.id},
        ${record.createdAt},
        ${record.updatedAt},
        ${record.source},
        ${record.businessName || null},
        ${record.contactName || null},
        ${record.email},
        ${record.phone || null},
        ${record.businessType || null},
        ${record.city || null},
        ${record.currentMenuLink || null},
        ${record.mainNeed || null},
        ${record.packageInterest || null},
        ${record.planId},
        ${record.planName},
        ${record.paymentStatus},
        ${record.onboardingStatus},
        ${record.notes || null},
        ${record.stripeCustomerId || null},
        ${record.stripeSubscriptionId || null},
        ${record.stripeCheckoutSessionId || null},
        ${record.portalAccess}
      )
      on conflict (id)
      do update set
        updated_at = now(),
        source = excluded.source,
        business_name = coalesce(nullif(excluded.business_name, ''), customer_onboarding.business_name),
        contact_name = coalesce(nullif(excluded.contact_name, ''), customer_onboarding.contact_name),
        email = excluded.email,
        phone = coalesce(nullif(excluded.phone, ''), customer_onboarding.phone),
        business_type = coalesce(nullif(excluded.business_type, ''), customer_onboarding.business_type),
        city = coalesce(nullif(excluded.city, ''), customer_onboarding.city),
        current_menu_link = coalesce(nullif(excluded.current_menu_link, ''), customer_onboarding.current_menu_link),
        main_need = coalesce(nullif(excluded.main_need, ''), customer_onboarding.main_need),
        package_interest = coalesce(nullif(excluded.package_interest, ''), customer_onboarding.package_interest),
        plan_id = excluded.plan_id,
        plan_name = excluded.plan_name,
        payment_status = excluded.payment_status,
        onboarding_status = excluded.onboarding_status,
        notes = coalesce(nullif(excluded.notes, ''), customer_onboarding.notes),
        stripe_customer_id = coalesce(nullif(excluded.stripe_customer_id, ''), customer_onboarding.stripe_customer_id),
        stripe_subscription_id = coalesce(nullif(excluded.stripe_subscription_id, ''), customer_onboarding.stripe_subscription_id),
        stripe_checkout_session_id = coalesce(nullif(excluded.stripe_checkout_session_id, ''), customer_onboarding.stripe_checkout_session_id),
        portal_access = customer_onboarding.portal_access or excluded.portal_access
    `;
  } catch (error) {
    console.error("Customer onboarding was not persisted.", error);
    return { persisted: false, error: "customer_onboarding_write_failed" };
  }

  return { persisted: true };
}

export async function upsertSubscriptionStatus(status: SubscriptionStatus) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Subscription status was not persisted.", status);
    return { persisted: false };
  }

  await sql`
    insert into customer_subscriptions (
      stripe_customer_id,
      stripe_subscription_id,
      stripe_checkout_session_id,
      customer_email,
      plan_id,
      status,
      current_period_end,
      updated_at
    )
    values (
      ${status.stripeCustomerId},
      ${status.stripeSubscriptionId || null},
      ${status.stripeCheckoutSessionId || null},
      ${status.customerEmail || null},
      ${status.planId || null},
      ${status.status},
      ${status.currentPeriodEnd || null},
      now()
    )
    on conflict (stripe_customer_id)
    do update set
      stripe_subscription_id = excluded.stripe_subscription_id,
      stripe_checkout_session_id = excluded.stripe_checkout_session_id,
      customer_email = excluded.customer_email,
      plan_id = excluded.plan_id,
      status = excluded.status,
      current_period_end = excluded.current_period_end,
      updated_at = now()
  `;

  return { persisted: true };
}

export async function savePaymentEvent(event: PaymentEvent) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Payment event was not persisted.", event);
    return { persisted: false };
  }

  await sql`
    insert into payment_events (
      stripe_event_id,
      stripe_customer_id,
      stripe_subscription_id,
      customer_email,
      type,
      status,
      amount_paid,
      currency,
      created_at
    )
    values (
      ${event.stripeEventId},
      ${event.stripeCustomerId || null},
      ${event.stripeSubscriptionId || null},
      ${event.customerEmail || null},
      ${event.type},
      ${event.status},
      ${event.amountPaid || null},
      ${event.currency || null},
      now()
    )
    on conflict (stripe_event_id) do nothing
  `;

  return { persisted: true };
}
