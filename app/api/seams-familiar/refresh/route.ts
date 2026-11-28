import { timingSafeEqual } from "node:crypto";
import { runDailyCatalog } from "@/lib/seams/daily-catalog-report";

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

  const report = await runDailyCatalog();
  return Response.json({ report }, { status: report.ok ? 200 : 503 });
}
