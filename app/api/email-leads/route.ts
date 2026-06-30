import { NextResponse } from "next/server";
import { buildFreePlanReceiptEmail } from "@/lib/lead-tasks";
import { notifyOnboardingWebhook } from "@/lib/customer-onboarding";
import { sendCustomerEmail } from "@/lib/customer-emails";
import {
  parseEmailLeadPayload,
  saveEmailLeadMessage,
  updateEmailLeadMessageResult
} from "@/lib/email-leads";
import { notifyOpsAlert } from "@/lib/ops-alerts";
import { upsertCustomerOnboarding, upsertLeadTask } from "@/lib/customer-store";

type CustomerEmailResult = Awaited<ReturnType<typeof sendCustomerEmail>>;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

function hasValidSecret(request: Request) {
  const secret = process.env.EMAIL_LEAD_WEBHOOK_SECRET || "";

  if (!secret) return false;

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const header = request.headers.get("x-resonate-email-secret");

  return bearer === secret || header === secret;
}

export async function POST(request: Request) {
  if (!hasValidSecret(request)) {
    return unauthorized();
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseEmailLeadPayload(body);

  if (!parsed.decision) {
    return NextResponse.json({ error: parsed.error || "Invalid email lead payload." }, { status: 400 });
  }

  const decision = parsed.decision;
  const initialSave = await saveEmailLeadMessage({
    messageId: decision.messageId,
    threadId: decision.threadId,
    fromEmail: decision.fromEmail,
    fromName: decision.fromName,
    subject: decision.subject,
    bodyPreview: decision.body.slice(0, 1200),
    receivedAt: decision.receivedAt,
    isReply: decision.isReply,
    intent: decision.intent,
    actionTaken: "processing",
    autoReplySent: false
  });

  if (initialSave.duplicate) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      messageId: decision.messageId,
      message: "Email message was already processed."
    });
  }

  if (!decision.shouldCreateLead || !decision.onboarding || !decision.leadTask) {
    await updateEmailLeadMessageResult(decision.messageId, {
      actionTaken: decision.reason,
      autoReplySent: false
    });

    return NextResponse.json({
      ok: true,
      createdLead: false,
      reason: decision.reason,
      messageId: decision.messageId
    });
  }

  const onboardingStorage = await upsertCustomerOnboarding(decision.onboarding);
  const taskStorage = await upsertLeadTask(decision.leadTask);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const alert = await notifyOpsAlert({
    eventType: "customer_signup",
    priority: "high",
    title: "New email lead",
    message: `${decision.onboarding.businessName || decision.fromEmail} sent an email inquiry that was converted to a lead task.`,
    businessName: decision.onboarding.businessName,
    contactName: decision.onboarding.contactName,
    email: decision.onboarding.email,
    phone: decision.onboarding.phone,
    planName: decision.onboarding.planName,
    source: "email_inquiry",
    actionUrl: `${origin}/admin/leads/${decision.leadTask.id}`,
    metadata: {
      messageId: decision.messageId,
      threadId: decision.threadId || "",
      subject: decision.subject,
      intent: decision.intent
    }
  });

  let customerEmail: CustomerEmailResult = { sent: false, provider: "email", reason: "not_sent" };

  if (decision.shouldAutoReply) {
    const receipt = buildFreePlanReceiptEmail(decision.onboarding, decision.leadTask);
    customerEmail = await sendCustomerEmail({
      to: decision.onboarding.email,
      subject: receipt.subject,
      text: receipt.text
    });
  }

  const handoff = await notifyOnboardingWebhook(decision.onboarding, "email_lead_submitted");

  await updateEmailLeadMessageResult(decision.messageId, {
    actionTaken: decision.reason,
    customerId: decision.onboarding.id,
    leadTaskId: decision.leadTask.id,
    autoReplySent: customerEmail.sent
  });

  return NextResponse.json({
    ok: true,
    createdLead: true,
    messageId: decision.messageId,
    onboardingStorage,
    taskStorage,
    customerEmail,
    alert,
    handoff,
    leadTaskId: decision.leadTask.id
  });
}
