export type LeadSpamInput = {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  city?: string;
  currentMenuLink?: string;
  mainNeed?: string;
  packageInterest?: string;
  notes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  startedAt?: string | number;
  website?: string;
  companyWebsite?: string;
  confirmEmail?: string;
  source?: string;
};

export type SpamAssessment = {
  isSpam: boolean;
  score: number;
  reasons: string[];
};

const minimumHumanSubmitMs = 2500;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function compact(value: string) {
  return value.replace(/[^a-z0-9]/gi, "");
}

function vowelRatio(value: string) {
  const letters = value.replace(/[^a-z]/gi, "");
  if (!letters) return 0;
  const vowels = letters.match(/[aeiou]/gi)?.length || 0;
  return vowels / letters.length;
}

function hasMixedCase(value: string) {
  return /[a-z]/.test(value) && /[A-Z]/.test(value);
}

function hasDenseMixedCase(value: string) {
  const uppercaseCount = (value.match(/[A-Z]/g) || []).length;
  const lowercaseCount = (value.match(/[a-z]/g) || []).length;

  return value.length >= 12 && uppercaseCount >= 3 && lowercaseCount >= 3;
}

function hasLongConsonantRun(value: string) {
  return /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(value);
}

function looksRandomToken(value: string) {
  const text = clean(value);
  const token = compact(text);

  if (text.includes(" ") || token.length < 9 || token.length > 36) return false;

  const letters = token.replace(/[^a-z]/gi, "");
  if (letters.length < 8) return false;

  const digitCount = (token.match(/\d/g) || []).length;
  const mixedCaseSignal = hasMixedCase(token);
  const denseMixedCaseSignal = hasDenseMixedCase(token);
  const lowVowelSignal = vowelRatio(token) < 0.34;
  const consonantSignal = hasLongConsonantRun(token);

  return [mixedCaseSignal, denseMixedCaseSignal, lowVowelSignal, consonantSignal, digitCount > 0].filter(Boolean).length >= 2;
}

function hasMeaningfulHumanText(value?: string) {
  const text = clean(value);
  if (text.length < 12) return false;
  return /\s/.test(text) || /https?:\/\//i.test(text);
}

function invalidPhoneSignal(value?: string) {
  const phone = clean(value);
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return true;
  return /^(\d)\1{6,}$/.test(digits);
}

function submissionAgeMs(value: string | number | undefined) {
  if (value === undefined || value === "") return undefined;
  const startedAt = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(startedAt)) return undefined;
  return Date.now() - startedAt;
}

export function assessLeadSpam(input: LeadSpamInput): SpamAssessment {
  const reasons: string[] = [];
  let score = 0;
  const businessName = clean(input.businessName);
  const contactName = clean(input.contactName || input.customerName);
  const email = clean(input.email || input.customerEmail).toLowerCase();
  const phone = clean(input.phone || input.customerPhone);
  const notes = clean(input.notes);
  const currentMenuLink = clean(input.currentMenuLink);
  const businessType = clean(input.businessType);
  const city = clean(input.city);
  const honeypot = [input.website, input.companyWebsite, input.confirmEmail].some((value) => clean(value));

  if (honeypot) {
    score += 10;
    reasons.push("honeypot_field_filled");
  }

  if (looksRandomToken(businessName)) {
    score += 3;
    reasons.push("business_name_random_token");
  }

  if (looksRandomToken(contactName)) {
    score += 3;
    reasons.push("contact_name_random_token");
  }

  if (looksRandomToken(businessType)) {
    score += 2;
    reasons.push("business_type_random_token");
  }

  if (looksRandomToken(city)) {
    score += 2;
    reasons.push("city_random_token");
  }

  const emailLocalPart = email.split("@")[0] || "";
  if (looksRandomToken(emailLocalPart.replace(/\./g, ""))) {
    score += 2;
    reasons.push("email_local_part_random_token");
  }

  if (invalidPhoneSignal(phone)) {
    score += 1;
    reasons.push("phone_invalid_shape");
  }

  if (!hasMeaningfulHumanText(notes) && !hasMeaningfulHumanText(currentMenuLink)) {
    score += 1;
    reasons.push("no_meaningful_free_text_or_link");
  }

  const ageMs = submissionAgeMs(input.startedAt);
  if (ageMs !== undefined && ageMs >= 0 && ageMs < minimumHumanSubmitMs) {
    score += 4;
    reasons.push("submitted_too_quickly");
  }

  if (businessName && contactName && businessName === contactName) {
    score += 1;
    reasons.push("business_and_contact_match");
  }

  return {
    isSpam: score >= 5,
    score,
    reasons
  };
}

export function quietSpamResponseMessage() {
  return "Thanks. Your request was received.";
}
