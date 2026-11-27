"use server";

import { redirect } from "next/navigation";
import { sendCustomerEmail, customerEmailConfigured } from "@/lib/customer-emails";
import { parseScoutPreferences } from "@/lib/fieldwear/preferences";
import { interestLabels, refreshSeamsCatalog } from "@/lib/seams/catalog";
import { issueSeamsLink, normalizeEmail, readMember, redeemSeamsLink, revokeSeamsSession, seamsPath, seamsSql, seamsUrl, unsubscribeSeams, type MemberSettings } from "@/lib/seams/members";
import { firstDibsReady } from "@/lib/seams/digest";

export async function requestMemberLink(form: FormData) {
  const email = normalizeEmail(form.get("email"));
  if (!email) redirect(seamsPath + "?status=invalid#join");
  if (!customerEmailConfigured()) redirect(seamsPath + "?status=unavailable#join");
  try {
    const token = await issueSeamsLink(email);
    if (token) {
      const mail = await sendCustomerEmail({
        to: email,
        subject: "Your Seams Familiar sign-in link",
        text: `Open this link and select Continue to Seams Familiar. The link works once and expires in 15 minutes.\n\n${seamsUrl}?access=${token}`,
      });
      if (!mail.sent) throw new Error("Sign-in email failed");
    }
  } catch {
    redirect(seamsPath + "?status=unavailable#join");
  }
  redirect(seamsPath + "?status=sent#join");
}

export async function continueSeams(form: FormData) {
  const signedIn = await redeemSeamsLink(String(form.get("access") ?? ""));
  redirect(signedIn ? seamsPath : seamsPath + "?status=expired#join");
}

export async function signOutSeams() {
  await revokeSeamsSession();
  redirect(seamsPath);
}

export async function saveMemberFit(form: FormData) {
  const member = await readMember();
  if (!member) redirect(seamsPath);
  const fit = new FormData();
  fit.set("department", String(form.get("department") ?? ""));
  fit.set("shirtSizes", String(form.get("topSizes") ?? ""));
  fit.set("pantsSizes", String(form.get("bottomSizes") ?? ""));
  fit.set("shirtBudget", String(form.get("budget") ?? ""));
  fit.set("pantsBudget", String(form.get("budget") ?? ""));
  const parsed = parseScoutPreferences(fit);
  if (!parsed || parsed.department === "unisex") redirect(seamsPath + "?status=bad-fit#fit");
  const allowed = new Set(Object.keys(interestLabels));
  const interests = Array.from(new Set(form.getAll("interests").map(String).filter((interest) => allowed.has(interest))));
  const settings: MemberSettings = { department: parsed.department, topSizes: parsed.shirtSizes, bottomSizes: parsed.pantsSizes, budget: parsed.shirtBudget, interests };
  const sql = await seamsSql();
  await sql`UPDATE seams_members SET settings = ${JSON.stringify(settings)}::jsonb WHERE id = ${member.id}::uuid`;
  redirect(seamsPath + "?status=saved#fit");
}

export async function saveMemberDibs(form: FormData) {
  const member = await readMember();
  if (!member) redirect(seamsPath);
  const enabled = form.get("enabled") === "on";
  if (enabled && !firstDibsReady()) redirect(seamsPath + "?status=email-unavailable#first-dibs");
  const sql = await seamsSql();
  await sql`UPDATE seams_members SET first_dibs = ${enabled} WHERE id = ${member.id}::uuid`;
  redirect(seamsPath + "?status=email-saved#first-dibs");
}

export async function searchMemberCatalog(form: FormData) {
  if (!(await readMember())) redirect(seamsPath);
  const keywords = String(form.get("keywords") ?? "").trim().slice(0, 80);
  await refreshSeamsCatalog();
  redirect(seamsPath + (keywords ? "?q=" + encodeURIComponent(keywords) : "") + "#fresh");
}

export async function stopFirstDibs(form: FormData) {
  await unsubscribeSeams(String(form.get("token") ?? ""));
  redirect(seamsPath + "?status=unsubscribed#join");
}
