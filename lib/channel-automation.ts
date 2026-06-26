export type MenuPilotPlan = "free" | "launch" | "maintain" | "managed" | "owner_override";

export type PaymentStatus = "ok" | "trial" | "past_due" | "unpaid" | "owner_override";

export type ApprovalStatus = "new" | "needs_review" | "approved" | "blocked";

export type UpdateRequestType =
  | "hours"
  | "closed_date"
  | "menu_item"
  | "price_change"
  | "sold_out"
  | "special"
  | "event"
  | "announcement"
  | "photo"
  | "ordering_link"
  | "booking_link"
  | "website_copy"
  | "other";

export type ChannelTaskMode = "auto_ready" | "validate_first" | "manual_support" | "blocked";

export type ChannelTaskStatus = "ready_for_review" | "ready_for_validation" | "ready_to_send" | "blocked" | "manual_support";

export type UpdateRouteRequest = {
  requestId?: string;
  businessId?: string;
  businessName: string;
  requestedBy?: string;
  plan?: MenuPilotPlan;
  paymentStatus?: PaymentStatus;
  permissionVerified?: boolean;
  approvalStatus?: ApprovalStatus;
  publicCopyApproved?: boolean;
  requestType: UpdateRequestType;
  whatShouldChange: string;
  approvedPublicCopy?: string;
  requestedChannels?: string[];
  connectedChannels?: string[];
  goLiveAt?: string;
  effectiveDate?: string;
  endDate?: string;
  sourceMaterialUrl?: string;
};

export type ChannelTask = {
  taskId: string;
  channel: string;
  mode: ChannelTaskMode;
  status: ChannelTaskStatus;
  title: string;
  action: string;
  blocks: string[];
  notes: string[];
};

export type UpdateRoutePlan = {
  ok: true;
  routeId: string;
  requestId: string;
  businessName: string;
  requestType: UpdateRequestType;
  gates: {
    payment: "ok" | "blocked";
    approval: "ok" | "blocked";
    publicCopy: "ok" | "blocked";
    permission: "ok" | "blocked";
  };
  tasks: ChannelTask[];
  confirmationDraft: string;
};

const autoReadyChannels = new Set([
  "menupilot",
  "menupilot page",
  "website",
  "resonate website",
  "facebook",
  "facebook page",
  "instagram",
  "instagram business",
  "google",
  "google profile",
  "google business profile",
  "gbp"
]);

const manualSupportChannels = new Set([
  "ordering",
  "ordering link",
  "delivery",
  "doordash",
  "uber eats",
  "grubhub",
  "apple maps",
  "apple business",
  "bing places",
  "yelp",
  "tripadvisor",
  "opentable",
  "resy",
  "tock",
  "square",
  "toast",
  "shopify",
  "chownow"
]);

const highRiskTypes = new Set<UpdateRequestType>(["hours", "closed_date", "price_change"]);

function clean(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, 1400) || fallback : fallback;
}

function cleanBoolean(value: unknown) {
  return value === true || value === "true" || value === "yes" || value === "Yes";
}

function normalizeChannel(channel: string) {
  return channel.trim().toLowerCase();
}

function uniqueChannels(channels: string[]) {
  const cleaned = channels.map((channel) => channel.trim()).filter(Boolean);
  return Array.from(new Set(cleaned));
}

export function parseUpdateRouteRequest(input: unknown): { payload?: UpdateRouteRequest; error?: string } {
  if (!input || typeof input !== "object") {
    return { error: "Invalid request body." };
  }

  const data = input as Record<string, unknown>;
  const requestType = clean(data.requestType) as UpdateRequestType;
  const channels = Array.isArray(data.requestedChannels) ? data.requestedChannels.map(String) : [];
  const connectedChannels = Array.isArray(data.connectedChannels) ? data.connectedChannels.map(String) : [];

  const payload: UpdateRouteRequest = {
    requestId: clean(data.requestId),
    businessId: clean(data.businessId),
    businessName: clean(data.businessName),
    requestedBy: clean(data.requestedBy),
    plan: (clean(data.plan, "free") as MenuPilotPlan) || "free",
    paymentStatus: (clean(data.paymentStatus, "unpaid") as PaymentStatus) || "unpaid",
    permissionVerified: cleanBoolean(data.permissionVerified),
    approvalStatus: (clean(data.approvalStatus, "new") as ApprovalStatus) || "new",
    publicCopyApproved: cleanBoolean(data.publicCopyApproved),
    requestType,
    whatShouldChange: clean(data.whatShouldChange),
    approvedPublicCopy: clean(data.approvedPublicCopy),
    requestedChannels: uniqueChannels(channels.length ? channels : ["MenuPilot page"]),
    connectedChannels: uniqueChannels(connectedChannels),
    goLiveAt: clean(data.goLiveAt),
    effectiveDate: clean(data.effectiveDate),
    endDate: clean(data.endDate),
    sourceMaterialUrl: clean(data.sourceMaterialUrl)
  };

  if (!payload.businessName) {
    return { error: "Business name is required." };
  }

  if (!payload.requestType) {
    return { error: "Request type is required." };
  }

  if (!payload.whatShouldChange) {
    return { error: "What should change is required." };
  }

  return { payload };
}

function paymentGate(payload: UpdateRouteRequest) {
  if (payload.paymentStatus === "ok" || payload.paymentStatus === "owner_override" || payload.plan === "owner_override") {
    return "ok" as const;
  }

  if (payload.plan === "maintain" || payload.plan === "managed") {
    return payload.paymentStatus === "past_due" || payload.paymentStatus === "unpaid" ? "blocked" : "ok";
  }

  return "blocked" as const;
}

function channelMode(channel: string, payload: UpdateRouteRequest): ChannelTaskMode {
  const normalized = normalizeChannel(channel);

  if (manualSupportChannels.has(normalized)) {
    return "manual_support";
  }

  if (!autoReadyChannels.has(normalized)) {
    return "manual_support";
  }

  if ((normalized.includes("google") || normalized === "gbp") && highRiskTypes.has(payload.requestType)) {
    return "validate_first";
  }

  return "auto_ready";
}

function channelAccessOk(channel: string, payload: UpdateRouteRequest) {
  const normalized = normalizeChannel(channel);
  if (normalized === "menupilot" || normalized === "menupilot page" || normalized === "website" || normalized === "resonate website") {
    return true;
  }

  return payload.connectedChannels?.some((connected) => normalizeChannel(connected) === normalized) || false;
}

function makeTask(channel: string, payload: UpdateRouteRequest, gates: UpdateRoutePlan["gates"], index: number): ChannelTask {
  const mode = channelMode(channel, payload);
  const blocks: string[] = [];
  const notes: string[] = [];
  const accessOk = channelAccessOk(channel, payload);

  if (gates.payment === "blocked") {
    blocks.push("Payment or plan does not allow this managed update yet.");
  }

  if (gates.approval === "blocked") {
    blocks.push("Resonate approval is required before sending.");
  }

  if (gates.publicCopy === "blocked" && mode !== "manual_support") {
    blocks.push("Approved public copy is required before auto-ready channels run.");
  }

  if (!accessOk && mode !== "manual_support") {
    blocks.push("Channel access is not connected or verified.");
  }

  if (!payload.permissionVerified && mode !== "manual_support") {
    blocks.push("Customer permission/access has not been verified.");
  }

  if (mode === "validate_first") {
    notes.push("High-risk change. Run validate-only or owner review before live update.");
  }

  if (mode === "manual_support") {
    notes.push("Create an internal managed-support task. Do not promise instant automation for this channel.");
  }

  const status: ChannelTaskStatus = blocks.length
    ? "blocked"
    : mode === "manual_support"
      ? "manual_support"
      : mode === "validate_first"
        ? "ready_for_validation"
        : payload.approvalStatus === "approved"
          ? "ready_to_send"
          : "ready_for_review";

  return {
    taskId: `${payload.requestId || "request"}-${index + 1}-${normalizeChannel(channel).replace(/[^a-z0-9]+/g, "-")}`,
    channel,
    mode,
    status,
    title: `${payload.businessName}: ${payload.requestType.replace(/_/g, " ")} -> ${channel}`,
    action: mode === "manual_support" ? "Create managed support task" : mode === "validate_first" ? "Prepare validate-first channel update" : "Prepare approved channel update",
    blocks,
    notes
  };
}

export function buildUpdateRoutePlan(payload: UpdateRouteRequest): UpdateRoutePlan {
  const requestId = payload.requestId || `upd-${Date.now().toString(36)}`;
  const approvalOk = payload.approvalStatus === "approved";
  const publicCopyOk = payload.publicCopyApproved || Boolean(payload.approvedPublicCopy);
  const permissionOk = payload.permissionVerified;

  const gates: UpdateRoutePlan["gates"] = {
    payment: paymentGate(payload),
    approval: approvalOk ? "ok" : "blocked",
    publicCopy: publicCopyOk ? "ok" : "blocked",
    permission: permissionOk ? "ok" : "blocked"
  };

  const channels = uniqueChannels(payload.requestedChannels?.length ? payload.requestedChannels : ["MenuPilot page"]);
  const tasks = channels.map((channel, index) => makeTask(channel, { ...payload, requestId }, gates, index));
  const readyCount = tasks.filter((task) => task.status === "ready_to_send").length;
  const validationCount = tasks.filter((task) => task.status === "ready_for_validation").length;
  const manualCount = tasks.filter((task) => task.status === "manual_support").length;
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;

  return {
    ok: true,
    routeId: `route-${Date.now().toString(36)}`,
    requestId,
    businessName: payload.businessName,
    requestType: payload.requestType,
    gates,
    tasks,
    confirmationDraft: `Received ${payload.businessName} update request. ${readyCount} channel task(s) ready, ${validationCount} validate-first task(s), ${manualCount} managed-support task(s), ${blockedCount} blocked task(s) needing review.`
  };
}
