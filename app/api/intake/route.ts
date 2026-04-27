import { NextResponse } from "next/server";
import { createIntakeRecord, parseIntakePayload } from "@/lib/intake";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseIntakePayload(body);

  if (!parsed.payload) {
    return NextResponse.json({ error: parsed.error || "Invalid intake request." }, { status: 400 });
  }

  const record = createIntakeRecord(parsed.payload);

  // DATABASE: Save `record` to your database here.
  // Good next choices: Vercel Postgres/Neon, Supabase, Airtable, or a Google Sheet automation.
  // EMAIL: Send `record` to your inbox here with Resend, Postmark, or another email provider.
  // CRM: Later, this can also create a lead in a lightweight CRM or client workspace.
  console.info("New Resonate intake", record);

  return NextResponse.json({
    ok: true,
    id: record.id,
    message: "Thanks. Resonate received your Soundcheck request."
  });
}
