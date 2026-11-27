import { isVintageShop } from "@/lib/fieldwear/marketplace-directory";
import { scoutDay } from "@/lib/fieldwear/daily-scout";
import { initializeSeams, seamsSql } from "@/lib/seams/members";

const areas = new Set(["masthead", "fresh", "fit", "join", "first-dibs"]);
const events = new Set(["view", "visible-time", "listing-open", "seller-click"]);
const kinds = new Set(["shirt", "pants", "outerwear", "dress", "skirt", "unknown"]);

export async function POST(request: Request) {
  if (request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1") return new Response(null, { status: 204 });
  const origin = request.headers.get("origin");
  const sameOrigin = origin ? origin === new URL(request.url).origin : request.headers.get("sec-fetch-site") === "same-origin";
  if (!sameOrigin) return new Response(null, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return new Response(null, { status: 415 });

  try {
    if (Number(request.headers.get("content-length")) > 500) return new Response(null, { status: 413 });
    const text = await request.text();
    if (text.length > 500) return new Response(null, { status: 413 });
    const { event, kind, source, seconds } = JSON.parse(text);
    if (!events.has(event)) return new Response(null, { status: 400 });
    const itemEvent = event === "listing-open" || event === "seller-click";
    if (itemEvent && (!kinds.has(kind) || typeof source !== "string" || !isVintageShop(source))) return new Response(null, { status: 400 });
    const timing = event === "visible-time";
    if (timing && !areas.has(kind)) return new Response(null, { status: 400 });
    const total = timing ? seconds : 1;
    if (!Number.isInteger(total) || total < 1 || total > 1800) return new Response(null, { status: 400 });
    await initializeSeams();
    const sql = await seamsSql();
    await sql`INSERT INTO seams_activity (day, event, kind, source, total)
      VALUES (${scoutDay()}, ${event}, ${itemEvent || timing ? kind : ""}, ${itemEvent ? source : ""}, ${total})
      ON CONFLICT (day, event, kind, source) DO UPDATE SET total = seams_activity.total + EXCLUDED.total`;
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
