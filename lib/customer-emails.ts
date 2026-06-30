type EmailResult = {
  sent: boolean;
  provider: "email";
  status?: number;
  id?: string;
  reason?: string;
};

type CustomerEmailInput = {
  to: string;
  subject: string;
  text: string;
};

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function customerEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && (process.env.CUSTOMER_EMAIL_FROM || process.env.OPS_ALERT_EMAIL_FROM));
}

export async function sendCustomerEmail(input: CustomerEmailInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY || "";
  const from = process.env.CUSTOMER_EMAIL_FROM || process.env.OPS_ALERT_EMAIL_FROM || "";
  const replyTo = process.env.CUSTOMER_EMAIL_REPLY_TO || process.env.NEXT_PUBLIC_QUESTIONS_EMAIL || "";
  const to = clean(input.to, 320).toLowerCase();

  if (!apiKey || !from || !to) {
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
        reply_to: replyTo || undefined,
        subject: clean(input.subject, 180),
        text: clean(input.text, 5000)
      })
    });

    const data = (await response.json().catch(() => null)) as { id?: string } | null;
    return { sent: response.ok, provider: "email", status: response.status, id: data?.id };
  } catch (error) {
    console.error("Customer email failed", error);
    return { sent: false, provider: "email", reason: "request_failed" };
  }
}

