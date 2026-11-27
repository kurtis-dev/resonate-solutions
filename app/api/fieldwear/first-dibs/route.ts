import { timingSafeEqual } from "node:crypto";
import { deliverSeamsDibs } from "@/lib/seams/digest";
import { deliverFirstDibs } from "@/lib/fieldwear/first-dibs";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response(null, { status: 503 });
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return new Response(null, { status: 401 });
  }
  try {
    const status = await deliverFirstDibs().catch(() => "digest-failed");
    const members = await deliverSeamsDibs();
    const ok = !["unavailable", "sources-unavailable", "email-failed", "digest-failed"].includes(status) && !members.failed;
    return Response.json({ status, members }, { status: ok ? 200 : 503 });
  } catch {
    return Response.json({ status: "digest-failed" }, { status: 500 });
  }
}
