import { customerEmailConfigured, sendCustomerEmail } from "@/lib/customer-emails";
import { scoutDay } from "@/lib/fieldwear/daily-scout";
import { matchSeamsCatalog, readSeamsCatalog, seamsListingKey } from "./catalog";
import { initializeSeams, seamsSql, seamsUrl, type MemberSettings } from "./members";

type Recipient = { id: string; email: string; settings: MemberSettings; unsubscribe_token: string; seen: string[] };
type PendingDigest = { body: string; sent_at: string | null };

export const firstDibsPickLimit = 6;

export function firstDibsReady() {
  return Boolean(process.env.SEAMS_MAILING_ADDRESS?.trim() && customerEmailConfigured());
}

export async function deliverSeamsDibs() {
  const address = process.env.SEAMS_MAILING_ADDRESS?.trim();
  if (!address || !firstDibsReady()) return { status: "mailing-address-or-sender-needed", sent: 0, failed: 0 };
  await initializeSeams();
  const catalog = await readSeamsCatalog();
  if (!catalog.length) return { status: "catalog-unavailable", sent: 0, failed: 0 };
  const sql = await seamsSql();
  const day = scoutDay();
  const recipients = await sql`SELECT m.id, m.email, m.settings, m.unsubscribe_token,
      ARRAY(SELECT DISTINCT unnest(d.listing_keys) FROM seams_digests d
        WHERE d.member_id = m.id AND d.sent_at IS NOT NULL AND d.day >= current_date - 60) AS seen
    FROM seams_members m WHERE m.first_dibs AND m.settings IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM seams_digests today WHERE today.member_id = m.id AND today.day = ${day} AND today.sent_at IS NOT NULL)
    ORDER BY m.id` as Recipient[];

  let sent = 0;
  let failed = 0;
  const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const replyTo = process.env.SEAMS_REPLY_TO?.trim() || "questions@resonate.solutions";
  for (const member of recipients) {
    const seen = new Set(member.seen);
    const items = matchSeamsCatalog(catalog, member.settings, "", true).filter((item) => !seen.has(seamsListingKey(item))).slice(0, firstDibsPickLimit);
    const [existing] = await sql`SELECT body, sent_at FROM seams_digests WHERE member_id = ${member.id}::uuid AND day = ${day}` as PendingDigest[];
    if (existing?.sent_at || (!existing && !items.length)) continue;
    const unsubscribeUrl = `${seamsUrl}?unsubscribe=${member.unsubscribe_token}`;
    const listUnsubscribe = `${seamsUrl}/unsubscribe?token=${member.unsubscribe_token}`;
    const body = [
      "Vintage finds matched to your Seams Familiar settings.",
      ...items.map((item) => {
        const price = dollars.format(item.priceCents! / 100);
        const amount = item.priceKind === "bid" ? `Current bid ${price}` : price;
        const shipping = item.shippingCents == null ? null : `${dollars.format(item.shippingCents / 100)} shipping`;
        return [item.title, [item.size, amount, shipping].filter(Boolean).join(" · "), item.url].join("\n");
      }),
      `Edit your sizes, budget, or styles: ${seamsUrl}#fit`,
      `Unsubscribe from First Dibs: ${unsubscribeUrl}`,
      `Resonate Solutions · ${address}`,
    ].join("\n\n");
    if (!existing) await sql`INSERT INTO seams_digests (member_id, day, body, listing_keys)
      VALUES (${member.id}::uuid, ${day}, ${body}, ${items.map(seamsListingKey)}) ON CONFLICT DO NOTHING`;
    const [outgoing] = await sql`SELECT d.body FROM seams_digests d JOIN seams_members m ON m.id = d.member_id
      WHERE d.member_id = ${member.id}::uuid AND d.day = ${day} AND d.sent_at IS NULL AND m.first_dibs` as { body: string }[];
    if (!outgoing) continue;
    const mail = await sendCustomerEmail({
      to: member.email, subject: "Seams Familiar · First Dibs", text: outgoing.body, replyTo,
      idempotencyKey: `seams-first-dibs/${day}/${member.id}`,
      headers: { "List-Unsubscribe": `<${listUnsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    });
    if (mail.sent) {
      await sql`UPDATE seams_digests SET sent_at = now() WHERE member_id = ${member.id}::uuid AND day = ${day} AND sent_at IS NULL`;
      sent++;
    } else failed++;
    await new Promise((resolve) => setTimeout(resolve, 560));
  }
  return { status: "checked", sent, failed };
}
