import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

export type ExcellentPinsQuotePayload = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  emblemType: string;
  quantity: string;
  designCount?: string;
  approximateSize?: string;
  deadline: string;
  artworkStatus: string;
  artworkLink?: string;
  useCase: string;
  finishPreference: string;
  backingPreference: string;
  packaging: string;
  budgetGuidance: string;
  notes?: string;
  website?: string;
  companyWebsite?: string;
  confirmEmail?: string;
  startedAt?: string;
};

export type ExcellentPinsQuoteRecord = ExcellentPinsQuotePayload & {
  id: string;
  createdAt: string;
  source: string;
  complianceReview: boolean;
  complianceReason: string;
};

type ParseResult =
  | { payload: ExcellentPinsQuotePayload; error?: never }
  | { payload?: never; error: string };

const complianceSignals = ["school", "youth", "resale", "documentation", "not sure"];

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function email(value: unknown) {
  return clean(value, 320).toLowerCase();
}

export function parseExcellentPinsQuotePayload(body: unknown): ParseResult {
  const input = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const payload: ExcellentPinsQuotePayload = {
    customerName: clean(input.customerName, 180),
    customerEmail: email(input.customerEmail),
    customerPhone: clean(input.customerPhone, 80),
    emblemType: clean(input.emblemType, 140),
    quantity: clean(input.quantity, 140),
    designCount: clean(input.designCount, 140),
    approximateSize: clean(input.approximateSize, 180),
    deadline: clean(input.deadline, 140),
    artworkStatus: clean(input.artworkStatus, 180),
    artworkLink: clean(input.artworkLink, 600),
    useCase: clean(input.useCase, 180),
    finishPreference: clean(input.finishPreference, 180) || "Recommend the best finish",
    backingPreference: clean(input.backingPreference, 180) || "Recommend the best backing",
    packaging: clean(input.packaging, 180),
    budgetGuidance: clean(input.budgetGuidance, 180),
    notes: clean(input.notes, 1600),
    website: clean(input.website, 240),
    companyWebsite: clean(input.companyWebsite, 240),
    confirmEmail: clean(input.confirmEmail, 240),
    startedAt: clean(input.startedAt, 80)
  };

  if (!payload.customerName) return { error: "Name is required." };
  if (!payload.customerEmail || !payload.customerEmail.includes("@")) return { error: "A valid email is required." };
  if (!payload.emblemType) return { error: "Metal emblem type is required." };
  if (!payload.quantity) return { error: "Quantity is required." };
  if (!payload.artworkStatus) return { error: "Artwork status is required." };

  return { payload };
}

export function createExcellentPinsQuoteRecord(payload: ExcellentPinsQuotePayload): ExcellentPinsQuoteRecord {
  const combined = [
    payload.useCase,
    payload.finishPreference,
    payload.backingPreference,
    payload.packaging,
    payload.budgetGuidance,
    payload.notes
  ].join(" ").toLowerCase();
  const complianceReview = complianceSignals.some((signal) => combined.includes(signal));

  return {
    ...payload,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    source: "excellent_pins_quote_page",
    complianceReview,
    complianceReason: complianceReview
      ? "Use case, packaging, notes, or documentation language should be reviewed before production is promised."
      : "No obvious customer-facing compliance signal selected."
  };
}

export async function ensureExcellentPinsQuoteRequestsTable() {
  const sql = await getSql();
  if (!sql) return { ready: false, reason: "not_configured" };

  await sql`
    create table if not exists excellent_pins_quote_requests (
      id text primary key,
      created_at timestamptz not null,
      source text not null,
      customer_name text not null,
      customer_email text not null,
      customer_phone text,
      emblem_type text not null,
      quantity text not null,
      design_count text,
      approximate_size text,
      deadline text,
      artwork_status text,
      artwork_link text,
      use_case text,
      finish_preference text,
      backing_preference text,
      packaging text,
      budget_guidance text,
      notes text,
      compliance_review boolean not null default false,
      compliance_reason text
    )
  `;

  await sql`alter table excellent_pins_quote_requests add column if not exists design_count text`;
  await sql`alter table excellent_pins_quote_requests add column if not exists approximate_size text`;
  await sql`alter table excellent_pins_quote_requests add column if not exists finish_preference text`;
  await sql`alter table excellent_pins_quote_requests add column if not exists backing_preference text`;

  await sql`
    create index if not exists excellent_pins_quote_requests_created_idx
    on excellent_pins_quote_requests (created_at desc)
  `;

  await sql`
    create index if not exists excellent_pins_quote_requests_email_idx
    on excellent_pins_quote_requests (customer_email)
  `;

  return { ready: true };
}

export async function saveExcellentPinsQuoteRequest(record: ExcellentPinsQuoteRecord) {
  const sql = await getSql();

  if (!sql) {
    console.info("DATABASE_URL not configured. Excellent Pins quote was not persisted.", record);
    return { persisted: false, reason: "not_configured" };
  }

  try {
    await ensureExcellentPinsQuoteRequestsTable();

    await sql`
      insert into excellent_pins_quote_requests (
        id,
        created_at,
        source,
        customer_name,
        customer_email,
        customer_phone,
        emblem_type,
        quantity,
        design_count,
        approximate_size,
        deadline,
        artwork_status,
        artwork_link,
        use_case,
        finish_preference,
        backing_preference,
        packaging,
        budget_guidance,
        notes,
        compliance_review,
        compliance_reason
      )
      values (
        ${record.id},
        ${record.createdAt},
        ${record.source},
        ${record.customerName},
        ${record.customerEmail},
        ${record.customerPhone || null},
        ${record.emblemType},
        ${record.quantity},
        ${record.designCount || null},
        ${record.approximateSize || null},
        ${record.deadline || null},
        ${record.artworkStatus || null},
        ${record.artworkLink || null},
        ${record.useCase || null},
        ${record.finishPreference || null},
        ${record.backingPreference || null},
        ${record.packaging || null},
        ${record.budgetGuidance || null},
        ${record.notes || null},
        ${record.complianceReview},
        ${record.complianceReason}
      )
    `;

    return { persisted: true };
  } catch (error) {
    console.error("Excellent Pins quote was not persisted.", error);
    return { persisted: false, reason: "write_failed" };
  }
}

function line(label: string, value?: string | boolean) {
  if (value === undefined || value === "") return "";
  return `${label}: ${value}`;
}

export function buildJackQuoteEmail(record: ExcellentPinsQuoteRecord) {
  const subject = `New quote request - ${record.customerName} - ${record.emblemType}`;
  const text = [
    "New quote request from the Excellent Pins & Badges page",
    "",
    "Customer",
    line("Name", record.customerName),
    line("Email", record.customerEmail),
    line("Phone", record.customerPhone),
    "",
    "Project",
    line("Metal emblem type", record.emblemType),
    line("Quantity", record.quantity),
    line("Number of designs", record.designCount),
    line("Approx size / shape", record.approximateSize),
    line("Deadline", record.deadline),
    line("Artwork", record.artworkStatus),
    line("Artwork link", record.artworkLink),
    line("Use case", record.useCase),
    line("Finish preference", record.finishPreference),
    line("Backing / attachment", record.backingPreference),
    line("Packaging", record.packaging),
    line("Budget guidance", record.budgetGuidance),
    "",
    "Notes",
    record.notes || "No extra notes provided.",
    "",
    "Internal flags",
    line("Compliance review", record.complianceReview ? "Review recommended" : "No obvious flag"),
    line("Reason", record.complianceReason),
    "",
    "Suggested next step",
    "Reply to the customer, confirm artwork/quantity/deadline, and ask for any missing production details."
  ]
    .filter((item) => item !== "")
    .join("\n");

  return { subject, text };
}

export function buildCustomerQuoteReceipt(record: ExcellentPinsQuoteRecord) {
  const subject = "We received your Excellent Pins quote request";
  const text = [
    `Hi ${record.customerName},`,
    "",
    "Thanks for sending your custom quote request to Excellent Pins & Badges.",
    "",
    "We received:",
    line("Metal emblem type", record.emblemType),
    line("Quantity", record.quantity),
    line("Number of designs", record.designCount),
    line("Approx size / shape", record.approximateSize),
    line("Deadline", record.deadline),
    line("Artwork", record.artworkStatus),
    "",
    "Excellent Pins will review the details and follow up with the next step.",
    "",
    "Thanks,",
    "Excellent Pins & Badges"
  ]
    .filter((item) => item !== "")
    .join("\n");

  return { subject, text };
}
