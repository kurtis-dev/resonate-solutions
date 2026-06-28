import { NextResponse } from "next/server";
import { buildCustomerOnboardingRecord, notifyOnboardingWebhook, planIdFromInterest } from "@/lib/customer-onboarding";
import { saveIntakeRecord, upsertCustomerOnboarding } from "@/lib/customer-store";
import { createIntakeRecord, parseIntakePayload } from "@/lib/intake";
import { notifyOpsAlert } from "@/lib/ops-alerts";

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
  const storage = await saveIntakeRecord(record);
  const onboarding = buildCustomerOnboardingRecord({
    ...parsed.payload,
    createdAt: record.createdAt,
    source: "website_intake",
    planId: planIdFromInterest(parsed.payload.packageInterest),
    paymentStatus: "not_required",
    onboardingStatus: "intake_received"
  });
  const onboardingStorage = await upsertCustomerOnboarding(onboarding);
  const handoff = await notifyOnboardingWebhook(onboarding, "customer_intake_submitted");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const alert = await notifyOpsAlert({
    eventType: "customer_signup",
    priority: "high",
    title: "New MenuPilot signup",
    message: `${onboarding.businessName || "A new business"} requested the ${onboarding.planName}.`,
    businessName: onboarding.businessName,
    contactName: onboarding.contactName,
    email: onboarding.email,
    phone: onboarding.phone,
    planName: onboarding.planName,
    source: "website_intake",
    actionUrl: `${origin}/admin`
  });

  console.info("New Resonate intake", record);

  return NextResponse.json({
    ok: true,
    id: record.id,
    storage,
    onboardingStorage,
    handoff,
    alert,
    message: "Thanks. Resonate received your free page plan request."
  });
}
