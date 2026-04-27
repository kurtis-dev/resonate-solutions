export type IntakePayload = {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  businessType: string;
  city: string;
  currentMenuLink?: string;
  mainNeed: string;
  packageInterest: string;
  notes?: string;
  source?: string;
  website?: string;
};

export type IntakeRecord = IntakePayload & {
  id: string;
  createdAt: string;
};

const requiredFields: Array<keyof IntakePayload> = [
  "businessName",
  "contactName",
  "email",
  "businessType",
  "city",
  "mainNeed",
  "packageInterest"
];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 1200) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseIntakePayload(input: unknown): { payload?: IntakePayload; error?: string } {
  if (!input || typeof input !== "object") {
    return { error: "Invalid request body." };
  }

  const data = input as Record<string, unknown>;
  const payload: IntakePayload = {
    businessName: clean(data.businessName),
    contactName: clean(data.contactName),
    email: clean(data.email).toLowerCase(),
    phone: clean(data.phone),
    businessType: clean(data.businessType),
    city: clean(data.city),
    currentMenuLink: clean(data.currentMenuLink),
    mainNeed: clean(data.mainNeed),
    packageInterest: clean(data.packageInterest),
    notes: clean(data.notes),
    source: clean(data.source) || "website",
    website: clean(data.website)
  };

  if (payload.website) {
    return { error: "Spam check failed." };
  }

  const missing = requiredFields.find((field) => !payload[field]);
  if (missing) {
    return { error: "Please complete all required fields." };
  }

  if (!isEmail(payload.email)) {
    return { error: "Please enter a valid email address." };
  }

  return { payload };
}

export function createIntakeRecord(payload: IntakePayload): IntakeRecord {
  return {
    ...payload,
    id: `res-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString()
  };
}
