import { getSql } from "@/lib/db";
import type { CustomerOnboardingRecord } from "@/lib/customer-onboarding";
import type { IntakeRecord } from "@/lib/intake";
import type { LeadTask } from "@/lib/lead-tasks";

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

export async function upsertLeadTask(task: LeadTask) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Lead task was not persisted.", task);
    return { persisted: false };
  }

  try {
    await sql`
      create table if not exists lead_tasks (
        id text primary key,
        created_at timestamptz not null,
        updated_at timestamptz not null default now(),
        intake_id text,
        customer_id text not null,
        business_name text,
        contact_name text,
        email text not null,
        phone text,
        task_type text not null,
        stage text not null default 'new_request',
        priority text not null default 'normal',
        title text not null,
        summary text,
        checklist jsonb not null default '[]'::jsonb,
        next_action text,
        assigned_to text,
        due_at timestamptz,
        source text not null default 'website'
      )
    `;
    await sql`create index if not exists lead_tasks_stage_idx on lead_tasks (stage, due_at)`;
    await sql`create index if not exists lead_tasks_email_idx on lead_tasks (email)`;
    await sql`create index if not exists lead_tasks_customer_idx on lead_tasks (customer_id)`;
    await sql`create index if not exists lead_tasks_type_idx on lead_tasks (task_type)`;

    await sql`
      insert into lead_tasks (
        id,
        created_at,
        updated_at,
        intake_id,
        customer_id,
        business_name,
        contact_name,
        email,
        phone,
        task_type,
        stage,
        priority,
        title,
        summary,
        checklist,
        next_action,
        assigned_to,
        due_at,
        source
      )
      values (
        ${task.id},
        ${task.createdAt},
        ${task.updatedAt},
        ${task.intakeId || null},
        ${task.customerId},
        ${task.businessName || null},
        ${task.contactName || null},
        ${task.email},
        ${task.phone || null},
        ${task.taskType},
        ${task.stage},
        ${task.priority},
        ${task.title},
        ${task.summary || null},
        ${JSON.stringify(task.checklist)}::jsonb,
        ${task.nextAction},
        ${task.assignedTo},
        ${task.dueAt},
        ${task.source}
      )
      on conflict (id)
      do update set
        updated_at = now(),
        business_name = coalesce(nullif(excluded.business_name, ''), lead_tasks.business_name),
        contact_name = coalesce(nullif(excluded.contact_name, ''), lead_tasks.contact_name),
        email = excluded.email,
        phone = coalesce(nullif(excluded.phone, ''), lead_tasks.phone),
        task_type = excluded.task_type,
        priority = excluded.priority,
        title = excluded.title,
        summary = coalesce(nullif(excluded.summary, ''), lead_tasks.summary),
        checklist = excluded.checklist,
        next_action = excluded.next_action,
        assigned_to = excluded.assigned_to,
        due_at = excluded.due_at,
        source = excluded.source
    `;
  } catch (error) {
    console.error("Lead task was not persisted.", error);
    return { persisted: false, error: "lead_task_write_failed" };
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
