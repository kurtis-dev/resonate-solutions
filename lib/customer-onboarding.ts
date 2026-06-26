import { getPlanById } from "@/lib/plans";

export type OnboardingSource = "website_intake" | "website_checkout" | "stripe_webhook";

export type OnboardingStatus =
  | "intake_received"
  | "payment_pending"
  | "paid_needs_review"
  | "subscription_active"
  | "payment_failed"
  | "needs_business_details";

export type CustomerOnboardingRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: OnboardingSource;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  businessType: string;
  city: string;
  currentMenuLink?: string;
  mainNeed: string;
  packageInterest: string;
  planId: string;
  planName: string;
  paymentStatus: string;
  onboardingStatus: OnboardingStatus;
  notes?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCheckoutSessionId?: string;
  portalAccess: boolean;
};

export type CustomerOnboardingInput = Partial<CustomerOnboardingRecord> & {
  email: string;
  source: OnboardingSource;
};

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export function normalizeEmail(email: string) {
  return clean(email, 320).toLowerCase();
}

export function onboardingIdFor(email: string, businessName?: string) {
  const normalizedEmail = normalizeEmail(email);
  const business = clean(businessName || "business", 120);
  const businessPart = slugPart(business) || "business";
  const emailPart = slugPart(normalizedEmail.split("@")[0] || "customer") || "customer";

  return `cust-${emailPart}-${businessPart}`;
}

export function planIdFromInterest(packageInterest?: string) {
  const value = clean(packageInterest).toLowerCase();

  if (value.includes("managed") || value.includes("care plus")) return "care-plus";
  if (value.includes("maintain") || value.includes("care")) return "care";
  if (value.includes("launch") || value.includes("setup")) return "setup";

  return "review";
}

export function buildCustomerOnboardingRecord(input: CustomerOnboardingInput): CustomerOnboardingRecord {
  const email = normalizeEmail(input.email);
  const planId = input.planId || planIdFromInterest(input.packageInterest);
  const plan = getPlanById(planId);
  const packageInterest = clean(input.packageInterest) || plan?.name || "Free Page Plan";
  const paymentStatus =
    input.paymentStatus ||
    (plan?.paymentMode === "none" ? "not_required" : input.source === "stripe_webhook" ? "paid" : "pending");
  const onboardingStatus =
    input.onboardingStatus ||
    (paymentStatus === "paid" || paymentStatus === "active"
      ? planId === "care" || planId === "care-plus"
        ? "subscription_active"
        : "paid_needs_review"
      : plan?.paymentMode === "none"
        ? "intake_received"
        : "payment_pending");

  return {
    id: input.id || onboardingIdFor(email, input.businessName),
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: input.source,
    businessName: clean(input.businessName),
    contactName: clean(input.contactName),
    email,
    phone: clean(input.phone),
    businessType: clean(input.businessType),
    city: clean(input.city),
    currentMenuLink: clean(input.currentMenuLink),
    mainNeed: clean(input.mainNeed) || "Not provided yet",
    packageInterest,
    planId,
    planName: plan?.name || packageInterest,
    paymentStatus,
    onboardingStatus,
    notes: clean(input.notes),
    stripeCustomerId: clean(input.stripeCustomerId),
    stripeSubscriptionId: clean(input.stripeSubscriptionId),
    stripeCheckoutSessionId: clean(input.stripeCheckoutSessionId),
    portalAccess: input.portalAccess || false
  };
}

export async function notifyOnboardingWebhook(record: CustomerOnboardingRecord, eventType: string) {
  const webhookUrl = process.env.SOFTR_INTAKE_WEBHOOK_URL || process.env.ZAPIER_INTAKE_WEBHOOK_URL || "";

  if (!webhookUrl) {
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ZAPIER_WEBHOOK_SECRET ? { "x-zapier-secret": process.env.ZAPIER_WEBHOOK_SECRET } : {})
      },
      body: JSON.stringify({
        eventType,
        customer: record,
        softr: {
          action: "upsert_customer_onboarding",
          permissionEmail: record.email,
          portalAccess: record.portalAccess
        }
      })
    });

    return { sent: response.ok, status: response.status };
  } catch (error) {
    console.error("Customer onboarding webhook failed", error);
    return { sent: false, reason: "request_failed" };
  }
}
