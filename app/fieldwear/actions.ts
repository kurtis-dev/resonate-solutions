"use server";

import { ownerCatalogPath } from "@/lib/fieldwear/owner-routes";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendCustomerEmail } from "@/lib/customer-emails";
import { exchangeOwnerLink, isScoutOwner, issueOwnerLink, readScoutPreferences, revokeOwnerSession, scoutDatabase } from "@/lib/fieldwear/owner-access";
import { firstDibsConfigured, updateFirstDibs } from "@/lib/fieldwear/first-dibs";
import { readScoutEdition } from "@/lib/fieldwear/editions";
import { catalogHref, catalogProfile, parseScoutPreferences } from "@/lib/fieldwear/preferences";
import { readLiveSearch, runAndStoreLiveSearch } from "@/lib/fieldwear/live-search";
import { browningHunt, similarHunt } from "@/lib/fieldwear/look-search";
import { curatedListings } from "@/lib/fieldwear/curated-listings";
import type { ListingInput } from "@/lib/fieldwear/listing-model";

export async function requestOwnerLink(form: FormData) {
  const owner = process.env.FIELDWEAR_OWNER_EMAIL?.trim().toLowerCase();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!owner) redirect(`${ownerCatalogPath}?signIn=unavailable`);
  if (email === owner) {
    try {
      const token = await issueOwnerLink();
      if (token) {
        const url = new URL(ownerCatalogPath, "https://www.resonate.solutions");
        url.searchParams.set("access", token);
        await sendCustomerEmail({
          to: owner,
          subject: "Your Seams Familiar sign-in link",
          text: `Open this link and choose Continue to Seams Familiar. It works once and expires in 10 minutes.\n\n${url}`,
        });
      }
    } catch {
      console.error("Fieldwear owner link could not be issued.");
    }
  }
  redirect(`${ownerCatalogPath}?signIn=requested`);
}

export async function redeemOwnerLink(form: FormData) {
  const token = String(form.get("access") ?? "");
  const hasSession = await exchangeOwnerLink(token);
  redirect(hasSession ? `${ownerCatalogPath}#fresh` : `${ownerCatalogPath}?signIn=expired`);
}

export async function setFirstDibs(form: FormData) {
  if (!(await isScoutOwner())) redirect(ownerCatalogPath);
  const profile = catalogProfile(form.get("profile"));
  const enabled = form.get("enabled") === "on";
  if (enabled && !firstDibsConfigured()) redirect(catalogHref(profile, { alerts: "unavailable" }, "first-dibs"));
  try {
    await updateFirstDibs(enabled);
  } catch {
    redirect(catalogHref(profile, { alerts: "unavailable" }, "first-dibs"));
  }
  redirect(catalogHref(profile, { alerts: enabled ? "enabled" : "disabled" }, "first-dibs"));
}

export async function signOutScout() {
  await revokeOwnerSession();
  redirect(ownerCatalogPath);
}

export async function saveScoutPreferences(form: FormData) {
  if (!(await isScoutOwner())) redirect(ownerCatalogPath);
  const profile = catalogProfile(form.get("profile"));
  const parsed = parseScoutPreferences(form);
  if (!parsed) redirect(catalogHref(profile, { preferences: "invalid" }, "preferences"));
  const preferences = profile === "women" ? { ...parsed, department: "women" as const } : parsed;
  const sql = await scoutDatabase();
  await sql`INSERT INTO fieldwear_preferences (profile, settings)
    VALUES (${profile}, ${JSON.stringify(preferences)}::jsonb)
    ON CONFLICT (profile) DO UPDATE SET settings = EXCLUDED.settings`;
  const previous = await readLiveSearch(undefined, "owner", profile);
  await runAndStoreLiveSearch(preferences, previous?.keywords ?? "", undefined, profile);
  revalidatePath(ownerCatalogPath);
  redirect(catalogHref(profile, { catalog: "1" }));
}

export async function searchScoutNow(form: FormData) {
  if (!(await isScoutOwner())) redirect(ownerCatalogPath);
  const profile = catalogProfile(form.get("profile"));
  const keywords = String(form.get("keywords") ?? "").replace(/\bvintage\b/gi, "").trim().replace(/\s+/g, " ").slice(0, 80);
  await runAndStoreLiveSearch(await readScoutPreferences(profile), keywords, undefined, profile);
  revalidatePath(ownerCatalogPath);
  redirect(catalogHref(profile, { catalog: "1" }));
}

export async function searchScoutLook(form: FormData) {
  if (!(await isScoutOwner())) redirect(ownerCatalogPath);
  const preferences = await readScoutPreferences();
  if (form.get("hunt") === "browning") {
    await runAndStoreLiveSearch(preferences, "", browningHunt);
    revalidatePath(ownerCatalogPath);
    redirect(`${ownerCatalogPath}#browning-results`);
  }
  const source = String(form.get("source") ?? "");
  const externalId = String(form.get("externalId") ?? "");
  if (!/^[a-z]{1,30}$/.test(source) || !/^[a-z\d-]{1,120}$/i.test(externalId)) return;
  const matches = (listing: Pick<ListingInput, "source" | "externalId">) => listing.source === source && listing.externalId === externalId;
  const sql = await scoutDatabase();
  const [liveRuns, saved, edition] = await Promise.all([
    Promise.all([readLiveSearch(preferences), readLiveSearch(preferences, "similar"), readLiveSearch(preferences, "browning")]),
    sql`SELECT listing FROM fieldwear_decisions WHERE source = ${source} AND external_id = ${externalId}` as Promise<{ listing: ListingInput | null }[]>,
    readScoutEdition(),
  ]);
  const reference = curatedListings.find(matches) ?? liveRuns.flatMap((run) => run?.listings ?? []).find(matches)
    ?? saved[0]?.listing ?? edition?.finds.find(matches);
  const hunt = reference && similarHunt(reference);
  if (!hunt) redirect(`${ownerCatalogPath}#find-similar`);
  await runAndStoreLiveSearch(preferences, "", hunt);
  revalidatePath(ownerCatalogPath);
  redirect(`${ownerCatalogPath}#similar-results`);
}

export async function decideListing(form: FormData) {
  if (!(await isScoutOwner())) redirect(ownerCatalogPath);
  const source = String(form.get("source") ?? "");
  const externalId = String(form.get("externalId") ?? "");
  const verdict = String(form.get("verdict") ?? "");
  if (!/^[a-z]{1,30}$/.test(source) || !/^[a-z\d-]{1,120}$/i.test(externalId) || !["save", "proof", "pass"].includes(verdict)) return;
  const runs = await Promise.all([readLiveSearch(), readLiveSearch(undefined, "owner", "women"), readLiveSearch(undefined, "daily"), readLiveSearch(undefined, "daily", "women"), readLiveSearch(undefined, "similar"), readLiveSearch(undefined, "browning")]);
  const matches = (listing: { source: string; externalId: string }) => listing.source === source && listing.externalId === externalId;
  const liveItem = runs.flatMap((run) => run?.listings ?? []).find(matches);
  const item = liveItem?.source === "etsy"
    ? { source, externalId, title: "Saved Etsy listing", url: liveItem.url, linkOnly: true }
    : liveItem ?? (await readScoutEdition())?.finds.find(matches);
  const sql = await scoutDatabase();
  await sql`INSERT INTO fieldwear_decisions (source, external_id, verdict, listing)
    VALUES (${source}, ${externalId}, ${verdict}, ${item ? JSON.stringify(item) : null}::jsonb)
    ON CONFLICT (source, external_id) DO UPDATE SET
      verdict = EXCLUDED.verdict, listing = COALESCE(EXCLUDED.listing, fieldwear_decisions.listing)`;
  revalidatePath(ownerCatalogPath);
}
