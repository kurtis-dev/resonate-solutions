import { customerEmailConfigured, sendCustomerEmail } from "@/lib/customer-emails";
import { scoutDay } from "./daily-scout";
import { searchNewListings } from "./live-search";
import { classifyGarment } from "./listing-model";
import { initializeScoutDatabase, readScoutPreferences, scoutDatabase } from "./owner-access";

type Digest = { body: string; sent_at: string | null };
const catalogUrl = "https://www.resonate.solutions/fieldwear";

export function firstDibsConfigured() {
  return Boolean(process.env.CRON_SECRET && process.env.FIELDWEAR_OWNER_EMAIL?.trim() && customerEmailConfigured());
}

export async function firstDibsEnabled() {
  const sql = await scoutDatabase();
  const [settings] = await sql`SELECT enabled FROM fieldwear_email_settings WHERE profile = 'owner'` as { enabled: boolean }[];
  return settings?.enabled ?? false;
}

export async function updateFirstDibs(enabled: boolean) {
  const sql = await scoutDatabase();
  await sql`INSERT INTO fieldwear_email_settings (profile, enabled) VALUES ('owner', ${enabled})
    ON CONFLICT (profile) DO UPDATE SET enabled = EXCLUDED.enabled`;
}

export async function deliverFirstDibs() {
  const recipient = process.env.FIELDWEAR_OWNER_EMAIL?.trim();
  if (!recipient || !firstDibsConfigured()) return "unavailable";
  await initializeScoutDatabase();
  if (!(await firstDibsEnabled())) return "disabled";

  const sql = await scoutDatabase();
  const day = scoutDay();
  const [scheduled] = await sql`SELECT body, sent_at FROM fieldwear_email_digests WHERE day = ${day}` as Digest[];
  if (scheduled?.sent_at) return "already-sent";

  let digest = scheduled;
  if (!digest) {
    const preferences = await readScoutPreferences();
    const [run, excluded] = await Promise.all([
      searchNewListings({ ...preferences, matchingOnly: true }, ""),
      sql`SELECT unnest(listing_keys) AS key FROM fieldwear_email_digests WHERE sent_at IS NOT NULL
        UNION SELECT source || ':' || external_id AS key FROM fieldwear_decisions WHERE verdict IN ('save', 'pass')` as Promise<{ key: string }[]>,
    ]);
    if (run.status === "unavailable" || run.status === "unconfigured") return "sources-unavailable";
    const seen = new Set(excluded.map(({ key }) => key));
    const picks = run.listings.filter((item) => {
      const key = `${item.source}:${item.externalId}`;
      const kind = classifyGarment(item);
      if (seen.has(key) || (kind !== "shirt" && kind !== "pants") || item.priceCents == null || item.priceKind === "bid") return false;
      seen.add(key);
      return true;
    });
    const shirts = picks.filter((item) => classifyGarment(item) === "shirt");
    const pants = picks.filter((item) => classifyGarment(item) === "pants");
    const items = [...shirts.slice(0, 3), ...pants.slice(0, 3)];
    if (!items.length) return "no-new-matches";
    const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    const body = [
      "Workwear in your saved sizes and budget",
      ...items.map((item) => [
        item.title,
        [item.size, dollars.format(item.priceCents! / 100)].filter(Boolean).join(" · "),
        item.url,
      ].join("\n")),
      `Browse your catalog: ${catalogUrl}#fresh`,
      `Manage these emails: ${catalogUrl}#first-dibs`,
    ].join("\n\n");
    const keys = items.map((item) => `${item.source}:${item.externalId}`);
    await sql`INSERT INTO fieldwear_email_digests (day, body, listing_keys) VALUES (${day}, ${body}, ${keys})
      ON CONFLICT (day) DO NOTHING`;
    [digest] = await sql`SELECT body, sent_at FROM fieldwear_email_digests WHERE day = ${day}` as Digest[];
  }
  if (!digest || digest.sent_at || !(await firstDibsEnabled())) return "skipped";

  const mail = await sendCustomerEmail({
    to: recipient,
    subject: "Fieldwear Scout · First dibs",
    text: digest.body,
    idempotencyKey: `fieldwear-first-dibs/${day}`,
  });
  if (!mail.sent) return "email-failed";
  await sql`UPDATE fieldwear_email_digests SET sent_at = now() WHERE day = ${day} AND sent_at IS NULL`;
  return "sent";
}
