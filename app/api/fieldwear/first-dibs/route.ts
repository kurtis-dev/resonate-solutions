import { timingSafeEqual } from "node:crypto";
import { deliverFirstDibs } from "@/lib/fieldwear/first-dibs";

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
  try {
    const status = await deliverFirstDibs();
    return Response.json({ status }, { status: ["unavailable", "sources-unavailable", "email-failed"].includes(status) ? 503 : 200 });
  } catch {
    return Response.json({ status: "digest-failed" }, { status: 500 });
  }
}
