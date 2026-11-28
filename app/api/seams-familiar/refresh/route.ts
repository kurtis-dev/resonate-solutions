import { timingSafeEqual } from "node:crypto";
import { refreshSeamsCatalog } from "@/lib/seams/catalog";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response(null, { status: 503 });
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return new Response(null, { status: 401 });
  }

  const report = await refreshSeamsCatalog(true);
  const ok = report.every(({ department, count, result }) =>
    result === "skipped" || (result === "checked" && (department === "tour" || count > 0)));
  return Response.json({ report }, { status: ok ? 200 : 503 });
}
