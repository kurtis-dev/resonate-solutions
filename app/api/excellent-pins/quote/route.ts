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
const maxArtworkFileSize = 4 * 1024 * 1024;
const allowedArtworkTypes = new Set(["image/jpeg", "application/pdf"]);

type ArtworkAttachment = {
  filename: string;
  content: string;
  contentType: string;
};

function safeFilename(value: string) {
  return value
    .replace(/[\\/\u0000-\u001f\u007f]/g, "-")
    .trim()
    .slice(0, 180);
}

function matchesFileSignature(bytes: Uint8Array, contentType: string) {
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

async function readRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return { body: await request.json(), artwork: undefined };
  }

  const formData = await request.formData();
  const body = Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === "string")
  );
  const fileEntry = formData.get("artworkFile");

  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    return { body, artwork: undefined };
  }

  const filename = safeFilename(fileEntry.name);
  const extensionIsAllowed = /\.(jpe?g|pdf)$/i.test(filename);

  if (!filename || !extensionIsAllowed || !allowedArtworkTypes.has(fileEntry.type)) {
    throw new Error("Artwork must be a JPG or PDF file.");
  }

  if (fileEntry.size > maxArtworkFileSize) {
    throw new Error("Artwork must be 4 MB or smaller. Use the artwork link field for larger files.");
  }

  const bytes = new Uint8Array(await fileEntry.arrayBuffer());
  if (!matchesFileSignature(bytes, fileEntry.type)) {
    throw new Error("The artwork file does not match a valid JPG or PDF.");
  }

  const artwork: ArtworkAttachment = {
    filename,
    content: Buffer.from(bytes).toString("base64"),
    contentType: fileEntry.type
  };

  return { body, artwork };
}

export async function POST(request: Request) {
  let body: unknown;
  let artwork: ArtworkAttachment | undefined;

  try {
    const requestBody = await readRequestBody(request);
    body = requestBody.body;
    artwork = requestBody.artwork;
  } catch (error) {
    const message =
      error instanceof Error && /^(Artwork|The artwork)/.test(error.message)
        ? error.message
        : "Invalid request body.";
    return NextResponse.json({ error: message }, { status: 400 });
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

  parsed.payload.artworkFileName = artwork?.filename;
  const record = createExcellentPinsQuoteRecord(parsed.payload);
  const storage = await saveExcellentPinsQuoteRequest(record);
  const jackMessage = buildJackQuoteEmail(record);
  const customerReceipt = buildCustomerQuoteReceipt(record);

  const jackEmailResult = await sendCustomerEmail({
    to: jackEmail,
    replyTo: record.customerEmail,
    subject: jackMessage.subject,
    text: jackMessage.text,
    attachments: artwork ? [artwork] : undefined
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
    message: [
      `${record.customerName} requested a quote for ${record.emblemType}.`,
      `Quantity: ${record.quantity}`,
      record.approximateSize ? `Approx size: ${record.approximateSize}` : "",
      record.preferredShape ? `Preferred shape: ${record.preferredShape}` : "",
      `Shipping destination: ${record.shippingDestination}`,
      `Artwork: ${record.artworkStatus}`,
      record.useCase ? `Use: ${record.useCase}` : "",
      record.finishPreference ? `Finish: ${record.finishPreference}` : "",
      record.packaging ? `Packaging: ${record.packaging}` : "",
      record.packagingRequests ? `Packaging notes: ${record.packagingRequests}` : "",
      record.budgetGuidance ? `Budget: ${record.budgetGuidance}` : "",
      record.notes ? `Notes: ${record.notes}` : ""
    ]
      .filter(Boolean)
      .join("\n"),
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
      approximateSize: record.approximateSize,
      preferredShape: record.preferredShape,
      shippingDestination: record.shippingDestination,
      artworkStatus: record.artworkStatus,
      artworkFileName: record.artworkFileName,
      useCase: record.useCase,
      finishPreference: record.finishPreference,
      packaging: record.packaging,
      packagingRequests: record.packagingRequests,
      budgetGuidance: record.budgetGuidance,
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
