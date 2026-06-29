import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

type OpsAlertEvent =
  | "customer_signup"
  | "paid_plan_started"
  | "payment_completed"
  | "customer_question";

type OpsAlertPriority = "normal" | "high";

type OpsAlertPayload = {
  eventType: OpsAlertEvent;
  priority?: OpsAlertPriority;
  title: string;
  message: string;
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  planName?: string;
  source?: string;
  actionUrl?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

type NormalizedOpsAlertPayload = Omit<OpsAlertPayload, "priority" | "metadata"> & {
  priority: OpsAlertPriority;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: string;
};

type AlertResult = {
  sent: boolean;
  provider: "database" | "email" | "sms" | "webhook";
  status?: number;
  id?: string;
  reason?: string;
};

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizeMetadata(metadata: OpsAlertPayload["metadata"]) {
  return Object.fromEntries(
    Object.entries(metadata || {})
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, typeof value === "string" ? clean(value, 900) : value])
  ) as Record<string, string | number | boolean | null>;
}

function normalizePayload(payload: OpsAlertPayload): NormalizedOpsAlertPayload {
  return {
    ...payload,
    priority: payload.priority || "normal",
    title: clean(payload.title, 180),
    message: clean(payload.message, 900),
    businessName: clean(payload.businessName, 180),
    contactName: clean(payload.contactName, 180),
    email: clean(payload.email, 320).toLowerCase(),
    phone: clean(payload.phone, 80),
    planName: clean(payload.planName, 140),
    source: clean(payload.source, 80),
    actionUrl: clean(payload.actionUrl, 500),
    metadata: normalizeMetadata(payload.metadata),
    createdAt: new Date().toISOString()
  };
}

function textLine(label: string, value?: string) {
  return value ? `${label}: ${value}` : "";
}

function buildEmailBody(alert: NormalizedOpsAlertPayload) {
  return [
    textLine("Event", alert.eventType),
    textLine("Priority", alert.priority),
    textLine("Business", alert.businessName),
    textLine("Contact", alert.contactName),
    textLine("Email", alert.email),
    textLine("Phone", alert.phone),
    textLine("Plan", alert.planName),
    "",
    alert.message,
    "",
    textLine("Admin URL", alert.actionUrl),
    textLine("Created", alert.createdAt)
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildSmsBody(alert: NormalizedOpsAlertPayload) {
  return [
    `MenuPilot: ${alert.title}`,
    alert.businessName ? `${alert.businessName}${alert.contactName ? ` - ${alert.contactName}` : ""}` : alert.contactName,
    [alert.email, alert.phone].filter(Boolean).join(" "),
    alert.message,
    alert.actionUrl ? `Admin: ${alert.actionUrl}` : ""
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 1200);
}

async function saveOpsAlert(alertId: string, alert: NormalizedOpsAlertPayload, results: AlertResult[] = []): Promise<AlertResult> {
  const sql = await getSql();

  if (!sql) {
    return { sent: false, provider: "database", reason: "not_configured" };
  }

  try {
    await sql`
      insert into ops_alerts (
        id,
        created_at,
        event_type,
        priority,
        title,
        message,
        business_name,
        contact_name,
        email,
        phone,
        plan_name,
        source,
        action_url,
        metadata,
        notification_results
      )
      values (
        ${alertId},
        ${alert.createdAt},
        ${alert.eventType},
        ${alert.priority},
        ${alert.title},
        ${alert.message},
        ${alert.businessName || null},
        ${alert.contactName || null},
        ${alert.email || null},
        ${alert.phone || null},
        ${alert.planName || null},
        ${alert.source || null},
        ${alert.actionUrl || null},
        ${JSON.stringify(alert.metadata)}::jsonb,
        ${JSON.stringify(results)}::jsonb
      )
      on conflict (id) do update set
        notification_results = excluded.notification_results
    `;

    return { sent: true, provider: "database", id: alertId };
  } catch (error) {
    console.error("Operations alert database save failed", error);
    return { sent: false, provider: "database", reason: "request_failed" };
  }
}

async function sendEmailAlert(alert: NormalizedOpsAlertPayload): Promise<AlertResult> {
  const apiKey = process.env.RESEND_API_KEY || "";
  const to = process.env.OPS_ALERT_EMAIL_TO || process.env.ADMIN_ALERT_EMAIL || "";
  const from = process.env.OPS_ALERT_EMAIL_FROM || "Resonate Solutions <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { sent: false, provider: "email", reason: "not_configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: `MenuPilot alert: ${alert.title}${alert.businessName ? ` - ${alert.businessName}` : ""}`,
        text: buildEmailBody(alert)
      })
    });

    const data = (await response.json().catch(() => null)) as { id?: string } | null;
    return { sent: response.ok, provider: "email", status: response.status, id: data?.id };
  } catch (error) {
    console.error("Operations alert email failed", error);
    return { sent: false, provider: "email", reason: "request_failed" };
  }
}

async function sendSmsAlert(alert: NormalizedOpsAlertPayload): Promise<AlertResult> {
  if (alert.priority !== "high") {
    return { sent: false, provider: "sms", reason: "priority_not_high" };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";
  const from = process.env.TWILIO_FROM_PHONE || "";
  const to = process.env.OPS_ALERT_SMS_TO || "";

  if (!accountSid || !authToken || !from || !to) {
    return { sent: false, provider: "sms", reason: "not_configured" };
  }

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        From: from,
        To: to,
        Body: buildSmsBody(alert)
      })
    });

    const data = (await response.json().catch(() => null)) as { sid?: string } | null;
    return { sent: response.ok, provider: "sms", status: response.status, id: data?.sid };
  } catch (error) {
    console.error("Operations alert SMS failed", error);
    return { sent: false, provider: "sms", reason: "request_failed" };
  }
}

async function sendWebhookAlert(alert: NormalizedOpsAlertPayload): Promise<AlertResult> {
  const webhookUrl = process.env.ZAPIER_ALERT_WEBHOOK_URL || process.env.OPS_ALERT_WEBHOOK_URL || "";

  if (!webhookUrl) {
    return { sent: false, provider: "webhook", reason: "not_configured" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ZAPIER_WEBHOOK_SECRET ? { "x-zapier-secret": process.env.ZAPIER_WEBHOOK_SECRET } : {})
      },
      body: JSON.stringify(alert)
    });

    return { sent: response.ok, provider: "webhook", status: response.status };
  } catch (error) {
    console.error("Operations alert webhook failed", error);
    return { sent: false, provider: "webhook", reason: "request_failed" };
  }
}

export async function notifyOpsAlert(payload: OpsAlertPayload) {
  const alertId = randomUUID();
  const body = normalizePayload(payload);
  const database = await saveOpsAlert(alertId, body);
  const notifications = await Promise.all([sendEmailAlert(body), sendSmsAlert(body), sendWebhookAlert(body)]);
  const databaseUpdate = await saveOpsAlert(alertId, body, notifications);

  return {
    id: alertId,
    sent: notifications.some((result) => result.sent),
    database: databaseUpdate.sent ? databaseUpdate : database,
    notifications
  };
}
