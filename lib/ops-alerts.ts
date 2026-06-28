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

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function notifyOpsAlert(payload: OpsAlertPayload) {
  const webhookUrl = process.env.ZAPIER_ALERT_WEBHOOK_URL || process.env.OPS_ALERT_WEBHOOK_URL || "";

  if (!webhookUrl) {
    return { sent: false, reason: "not_configured" };
  }

  const body = {
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
    createdAt: new Date().toISOString()
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ZAPIER_WEBHOOK_SECRET ? { "x-zapier-secret": process.env.ZAPIER_WEBHOOK_SECRET } : {})
      },
      body: JSON.stringify(body)
    });

    return { sent: response.ok, status: response.status };
  } catch (error) {
    console.error("Operations alert webhook failed", error);
    return { sent: false, reason: "request_failed" };
  }
}

