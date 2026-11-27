import { createHash } from "node:crypto";
import { searchGoodwillEbay } from "@/lib/fieldwear/live-search";
import { toListingView } from "@/lib/fieldwear/listing-view";
import { matchSeamsCatalog } from "@/lib/seams/catalog";
import { defaultMemberSettings, initializeSeams, readMember, seamsSql } from "@/lib/seams/members";

const reply = (body: object, status = 200) => Response.json(body, {
  status, headers: { "Cache-Control": "no-store" },
});

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({}, 403);

  const body = await request.json().catch(() => null);
  const zip = typeof body?.zip === "string" ? body.zip.trim() : "";
  if (!/^\d{5}$/.test(zip)) return reply({ error: "Enter a five-digit US ZIP code." }, 400);

  try {
    await initializeSeams();
    const sql = await seamsSql();
    const forwarded = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const key = "pickup:" + createHash("sha256").update(forwarded).digest("hex");
    const [rate] = await sql`INSERT INTO seams_rate_limits (key, attempts, expires_at)
      VALUES (${key}, 1, now() + interval '10 minutes')
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN seams_rate_limits.expires_at <= now() THEN 1 ELSE seams_rate_limits.attempts + 1 END,
        expires_at = CASE WHEN seams_rate_limits.expires_at <= now() THEN EXCLUDED.expires_at ELSE seams_rate_limits.expires_at END
      WHERE seams_rate_limits.expires_at <= now() OR seams_rate_limits.attempts < 12
      RETURNING attempts`;
    if (!rate) return reply({ error: "Too many pickup searches. Try again in a few minutes." }, 429);

    const member = await readMember();
    const department = body?.department === "men" || body?.department === "women" ? body.department : "any";
    const settings = member?.settings ?? { ...defaultMemberSettings, department };
    const result = await searchGoodwillEbay(settings.department, zip);
    if (result.status === "unavailable" || result.status === "needs-access") {
      return reply({ error: "Pickup search is temporarily unavailable. Try again later." }, 503);
    }

    const rows = settings.department === "any" ? "men" : settings.department;
    const now = new Date().toISOString();
    const items = matchSeamsCatalog([{ department: rows, listings: result.listings, checked_at: now }], settings).map((item) =>
      toListingView(item, item.listedAt, now, null, {
        department: settings.department, shirtSizes: settings.topSizes, pantsSizes: settings.bottomSizes,
        shirtBudget: settings.budget, pantsBudget: settings.budget, matchingOnly: true,
      }),
    );
    return reply({ items, partial: result.status === "partial" });
  } catch {
    return reply({ error: "Pickup search is temporarily unavailable. Try again later." }, 503);
  }
}
