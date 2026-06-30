import { createHash } from "node:crypto";
import { buildCustomerOnboardingRecord, type CustomerOnboardingRecord } from "@/lib/customer-onboarding";
import { getSql } from "@/lib/db";
import { createFreePlanLeadTask, type LeadTask } from "@/lib/lead-tasks";

export type EmailLeadIntent = "free_plan_request" | "customer_question" | "general_inquiry";

export type EmailLeadPayload = {
  messageId?: string;
  threadId?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  subject?: string;
  body?: string;
  receivedAt?: string;
  inReplyTo?: string;
  references?: string;
  intent?: EmailLeadIntent;
  createLead?: boolean;
  businessName?: string;
  contactName?: string;
  phone?: string;
  businessType?: string;
  city?: string;
  currentMenuLink?: string;
  packageInterest?: string;
  source?: string;
};

type EmailLeadDecision = {
  messageId: string;
  threadId?: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  body: string;
  receivedAt: string;
  isReply: boolean;
  isInternal: boolean;
  intent: EmailLeadIntent;
  shouldCreateLead: boolean;
  shouldAutoReply: boolean;
  reason: string;
  onboarding?: CustomerOnboardingRecord;
  leadTask?: LeadTask;
};

type EmailLeadMessageRecord = {
  messageId: string;
  threadId?: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  bodyPreview: string;
  receivedAt: string;
  isReply: boolean;
  intent: EmailLeadIntent;
  actionTaken: string;
  customerId?: string;
  leadTaskId?: string;
  autoReplySent: boolean;
};

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeEmail(value: unknown) {
  const email = clean(value, 320).toLowerCase();
  return isEmail(email) ? email : "";
}

function messageIdFor(input: EmailLeadPayload) {
  const seed = [
    clean(input.messageId, 500),
    clean(input.threadId, 500),
    clean(input.fromEmail, 320).toLowerCase(),
    clean(input.subject, 500),
    clean(input.receivedAt, 80),
    clean(input.body, 2000)
  ]
    .filter(Boolean)
    .join("|");

  return clean(input.messageId, 500) || `email-${createHash("sha256").update(seed).digest("hex").slice(0, 32)}`;
}

function detectReply(input: EmailLeadPayload) {
  const subject = clean(input.subject, 500).toLowerCase();
  return Boolean(
    clean(input.inReplyTo, 500) ||
      clean(input.references, 1000) ||
      subject.startsWith("re:") ||
      subject.startsWith("fw:") ||
      subject.startsWith("fwd:")
  );
}

function detectIntent(input: EmailLeadPayload): EmailLeadIntent {
  if (input.intent) return input.intent;

  const text = [input.subject, input.body].map((value) => clean(value, 2000).toLowerCase()).join(" ");

  if (text.includes("free page") || text.includes("free plan") || text.includes("menu pilot") || text.includes("menupilot")) {
    return "free_plan_request";
  }

  if (text.includes("?") || text.includes("question") || text.includes("can you") || text.includes("could you")) {
    return "customer_question";
  }

  return "general_inquiry";
}

function deriveBusinessName(input: EmailLeadPayload, fromEmail: string, fromName: string) {
  return (
    clean(input.businessName, 180) ||
    clean(input.subject, 180).replace(/^re:\s*/i, "").replace(/^fwd?:\s*/i, "") ||
    fromName ||
    fromEmail.split("@")[0] ||
    "Email inquiry"
  );
}

function buildDecision(input: EmailLeadPayload): EmailLeadDecision {
  const fromEmail = normalizeEmail(input.fromEmail || input.replyTo);
  const fromName = clean(input.fromName || input.contactName, 180);
  const subject = clean(input.subject, 500) || "Email inquiry";
  const body = clean(input.body, 5000);
  const intent = detectIntent(input);
  const isReply = detectReply(input);
  const isInternal = fromEmail.endsWith("@resonate.solutions") || subject.toLowerCase().startsWith("menupilot alert:");
  const shouldCreateLead = Boolean(fromEmail && !isInternal && !isReply && (input.createLead || intent === "free_plan_request"));
  const shouldAutoReply = shouldCreateLead && process.env.EMAIL_LEAD_AUTO_REPLY !== "false";
  const receivedAt = clean(input.receivedAt, 80) || new Date().toISOString();
  const messageId = messageIdFor(input);
  const threadId = clean(input.threadId, 500);
  const reason = isInternal
    ? "internal_message_ignored"
    : isReply
      ? "reply_logged_no_auto_response"
      : shouldCreateLead
        ? "lead_created"
        : "logged_no_lead";

  const onboarding = shouldCreateLead
    ? buildCustomerOnboardingRecord({
        source: "email_inquiry",
        businessName: deriveBusinessName(input, fromEmail, fromName),
        contactName: clean(input.contactName || fromName, 180) || "Email contact",
        email: fromEmail,
        phone: clean(input.phone, 80),
        businessType: clean(input.businessType, 180) || "Not provided yet",
        city: clean(input.city, 180) || "Not provided yet",
        currentMenuLink: clean(input.currentMenuLink, 500),
        mainNeed: body || subject,
        packageInterest: clean(input.packageInterest, 180) || "Free Page Plan",
        planId: "review",
        planName: "Free Page Plan",
        paymentStatus: "not_required",
        onboardingStatus: "needs_business_details",
        notes: `Email subject: ${subject}`,
        createdAt: receivedAt
      })
    : undefined;
  const leadTask = onboarding ? createFreePlanLeadTask(onboarding) : undefined;

  return {
    messageId,
    threadId,
    fromEmail,
    fromName,
    subject,
    body,
    receivedAt,
    isReply,
    isInternal,
    intent,
    shouldCreateLead,
    shouldAutoReply,
    reason,
    onboarding,
    leadTask
  };
}

export async function ensureEmailLeadMessagesTable() {
  const sql = await getSql();

  if (!sql) return { ok: false, reason: "database_not_configured" };

  await sql`
    create table if not exists email_lead_messages (
      message_id text primary key,
      thread_id text,
      received_at timestamptz not null,
      from_email text not null,
      from_name text,
      subject text,
      body_preview text,
      is_reply boolean not null default false,
      intent text not null default 'general_inquiry',
      action_taken text not null default 'logged_no_lead',
      customer_id text,
      lead_task_id text,
      auto_reply_sent boolean not null default false,
      created_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists email_lead_messages_thread_idx on email_lead_messages (thread_id)`;
  await sql`create index if not exists email_lead_messages_from_idx on email_lead_messages (from_email, received_at desc)`;

  return { ok: true };
}

export async function saveEmailLeadMessage(record: EmailLeadMessageRecord) {
  const sql = await getSql();

  if (!sql) return { persisted: false, duplicate: false, reason: "database_not_configured" };

  await ensureEmailLeadMessagesTable();

  const rows = (await sql`
    insert into email_lead_messages (
      message_id,
      thread_id,
      received_at,
      from_email,
      from_name,
      subject,
      body_preview,
      is_reply,
      intent,
      action_taken,
      customer_id,
      lead_task_id,
      auto_reply_sent
    )
    values (
      ${record.messageId},
      ${record.threadId || null},
      ${record.receivedAt},
      ${record.fromEmail},
      ${record.fromName || null},
      ${record.subject || null},
      ${record.bodyPreview || null},
      ${record.isReply},
      ${record.intent},
      ${record.actionTaken},
      ${record.customerId || null},
      ${record.leadTaskId || null},
      ${record.autoReplySent}
    )
    on conflict (message_id) do nothing
    returning message_id
  `) as Array<{ message_id: string }>;

  return { persisted: rows.length > 0, duplicate: rows.length === 0 };
}

export async function updateEmailLeadMessageResult(
  messageId: string,
  result: { actionTaken: string; customerId?: string; leadTaskId?: string; autoReplySent?: boolean }
) {
  const sql = await getSql();

  if (!sql) return { updated: false, reason: "database_not_configured" };

  await ensureEmailLeadMessagesTable();

  await sql`
    update email_lead_messages
    set
      action_taken = ${result.actionTaken},
      customer_id = ${result.customerId || null},
      lead_task_id = ${result.leadTaskId || null},
      auto_reply_sent = ${Boolean(result.autoReplySent)}
    where message_id = ${messageId}
  `;

  return { updated: true };
}

export function parseEmailLeadPayload(input: unknown) {
  if (!input || typeof input !== "object") {
    return { error: "Invalid email lead payload." };
  }

  const payload = input as EmailLeadPayload;
  const decision = buildDecision(payload);

  if (!decision.fromEmail) {
    return { error: "Email lead payload needs a valid fromEmail." };
  }

  return { decision };
}
