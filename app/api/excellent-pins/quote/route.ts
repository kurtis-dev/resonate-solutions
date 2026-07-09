import { NextResponse } from "next/server";
import {
  buildCustomerQuoteReceipt,
  buildJackQuoteEmail,
  createExcellentPinsQuoteRecord,
  parseExcellentPinsQuotePayload,
  saveExcellentPinsQuoteRequest
} from "@/lib/excellent-pins-quotes";
import { sendCustomerEmail } from "@/lib/customer-emails";
import { notifyOpsAlert } from "@/lib/ops-alerts";
import { assessLeadSpam, quietSpamResponseMessage } from "@/lib/spam-guard";

const jackEmail = process.env.EXCELLENT_PINS_QUOTE_EMAIL || "excellentpins@gmail.com";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseExcellentPinsQuotePayload(body);

  if (!parsed.payload) {
    return NextResponse.json({ error: parsed.error || "Invalid quote request." }, { status: 400 });
  }

  const spam = assessLeadSpam(parsed.payload);

  if (spam.isSpam) {
    console.info("Blocked Excellent Pins quote spam", { score: spam.score, reasons: spam.reasons });
    return NextResponse.json({
      ok: true,
      message: quietSpamResponseMessage()
    });
  }

  const record = createExcellentPinsQuoteRecord(parsed.payload);
  const storage = await saveExcellentPinsQuoteRequest(record);
  const jackMessage = buildJackQuoteEmail(record);
  const customerReceipt = buildCustomerQuoteReceipt(record);

  const jackEmailResult = await sendCustomerEmail({
    to: jackEmail,
    replyTo: record.customerEmail,
    subject: jackMessage.subject,
    text: jackMessage.text
  });

  const customerEmailResult = await sendCustomerEmail({
    to: record.customerEmail,
    subject: customerReceipt.subject,
    text: customerReceipt.text
  });

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const alert = await notifyOpsAlert({
    eventType: "customer_question",
    priority: "high",
    title: "New Excellent Pins quote request",
    message: `${record.customerName} requested a quote for ${record.emblemType}.`,
    businessName: "Excellent Pins & Badges Factory Inc.",
    contactName: record.customerName,
    email: record.customerEmail,
    phone: record.customerPhone,
    planName: "Client quote page",
    source: "excellent_pins_quote_page",
    actionUrl: `${origin}/excellent-pins`,
    metadata: {
      quoteId: record.id,
      emblemType: record.emblemType,
      quantity: record.quantity,
      designCount: record.designCount,
      approximateSize: record.approximateSize,
      useCase: record.useCase,
      finishPreference: record.finishPreference,
      backingPreference: record.backingPreference,
      complianceReview: record.complianceReview
    }
  });

  return NextResponse.json({
    ok: true,
    id: record.id,
    storage,
    jackEmail: jackEmailResult,
    customerEmail: customerEmailResult,
    alert,
    message: "Thanks. Excellent Pins received your quote request."
  });
}
