import type { CustomerOnboardingRecord } from "@/lib/customer-onboarding";
import type { IntakeRecord } from "@/lib/intake";

export type LeadTaskStage =
  | "new_request"
  | "needs_info"
  | "qualified"
  | "preview_planning"
  | "proposal_sent"
  | "waiting_on_payment"
  | "active_build"
  | "launched"
  | "closed";

export type LeadWorkflowType =
  | "food_menu_page"
  | "custom_quote_catalog"
  | "local_service_page"
  | "free_page_review";

export type LeadTask = {
  id: string;
  createdAt: string;
  updatedAt: string;
  intakeId?: string;
  customerId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  taskType: LeadWorkflowType;
  stage: LeadTaskStage;
  priority: "normal" | "high";
  title: string;
  summary: string;
  checklist: string[];
  nextAction: string;
  assignedTo: string;
  dueAt: string;
  source: string;
};

function includesAny(value: string, terms: string[]) {
  const text = value.toLowerCase();
  return terms.some((term) => text.includes(term));
}

function classifyLead(record: CustomerOnboardingRecord): LeadWorkflowType {
  const combined = [
    record.businessName,
    record.businessType,
    record.mainNeed,
    record.notes,
    record.packageInterest
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (includesAny(combined, ["pin", "badge", "artwork", "upload", "quote", "catalog", "custom product"])) {
    return "custom_quote_catalog";
  }

  if (includesAny(combined, ["restaurant", "food", "menu", "truck", "cafe", "bar", "burger", "popup"])) {
    return "food_menu_page";
  }

  if (includesAny(combined, ["service", "lawn", "clean", "detailing", "beauty", "wellness", "repair", "booking"])) {
    return "local_service_page";
  }

  return "free_page_review";
}

function checklistFor(taskType: LeadWorkflowType) {
  const shared = [
    "Review request and confirm the business is a good fit.",
    "Identify missing information before promising a build.",
    "Decide whether the next step is a free review, paid launch proposal, or not a fit.",
    "Send a focused follow-up with only the questions needed for this business type.",
    "Record the next stage and expected follow-up date."
  ];

  if (taskType === "custom_quote_catalog") {
    return [
      "Map the product categories customers need to compare.",
      "Confirm whether customers should upload artwork, request a quote, or both.",
      "List the buyer choices that affect pricing: type, size, quantity, finish, backing, packaging, and deadline.",
      "Add a simple intended-use question that flags resale, school/youth use, or children's-audience review.",
      "Collect real product photos or examples to make the page trustworthy.",
      ...shared
    ];
  }

  if (taskType === "food_menu_page") {
    return [
      "Confirm current menu/source of truth.",
      "Check hours, location, order links, phone, photos, and specials.",
      "Decide whether the first page is menu-first, popup-first, or general business info.",
      "Flag any update channels the customer may want later: Google, Facebook, Instagram, ordering, delivery.",
      ...shared
    ];
  }

  if (taskType === "local_service_page") {
    return [
      "Confirm service categories, service area, booking/quote path, and proof photos.",
      "Identify the main customer action: call, book, request quote, view packages, or message.",
      "Clarify any seasonal or recurring updates the business needs.",
      ...shared
    ];
  }

  return shared;
}

function nextActionFor(taskType: LeadWorkflowType) {
  if (taskType === "custom_quote_catalog") {
    return "Send a discovery note about product categories, artwork upload, quote factors, example photos, and intended-use flags.";
  }

  if (taskType === "food_menu_page") {
    return "Send a short menu/source-of-truth request and ask for photos, hours, location, and order links.";
  }

  if (taskType === "local_service_page") {
    return "Send a service-page discovery note covering services, service area, photos, and preferred customer action.";
  }

  return "Review the request and send a focused follow-up or close as not a fit.";
}

function dueTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString();
}

export function createFreePlanLeadTask(record: CustomerOnboardingRecord, intake?: IntakeRecord): LeadTask {
  const taskType = classifyLead(record);
  const now = new Date().toISOString();

  return {
    id: `lead-${intake?.id || record.id}`,
    createdAt: intake?.createdAt || record.createdAt || now,
    updatedAt: now,
    intakeId: intake?.id,
    customerId: record.id,
    businessName: record.businessName,
    contactName: record.contactName,
    email: record.email,
    phone: record.phone,
    taskType,
    stage: "new_request",
    priority: "high",
    title: `Review Free Page Plan - ${record.businessName || record.email}`,
    summary: record.mainNeed,
    checklist: checklistFor(taskType),
    nextAction: nextActionFor(taskType),
    assignedTo: "Kurtis",
    dueAt: dueTomorrow(),
    source: record.source
  };
}

export function buildFreePlanReceiptEmail(record: CustomerOnboardingRecord, task: LeadTask) {
  return {
    subject: `We received your Resonate request - ${record.businessName || "your business"}`,
    text: [
      `Hi ${record.contactName || "there"},`,
      "",
      `Thanks for reaching out to Resonate Solutions. We received your Free Page Plan request for ${record.businessName || "your business"}.`,
      "",
      "The first step is a review, not a generic template build. I’ll look at what you sent, figure out what kind of customer-facing page makes sense, and follow up with a few focused questions if anything important is missing.",
      "",
      `Current review path: ${task.taskType.replaceAll("_", " ")}`,
      `Next step: ${task.nextAction}`,
      "",
      "If you already have photos, menus, product examples, service lists, or artwork, you can reply here with those links or files.",
      "",
      "Thanks,",
      "Kurtis",
      "Resonate Solutions"
    ].join("\n")
  };
}

