import { timingSafeEqual } from "node:crypto";
import { initializeScoutDatabase, readScoutPreferences } from "@/lib/fieldwear/owner-access";
import { runAndStoreLiveSearch } from "@/lib/fieldwear/live-search";

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

  await initializeScoutDatabase();
  const runs = await Promise.allSettled((["owner", "women"] as const).map(async (profile) => {
    const preferences = await readScoutPreferences(profile);
    return { profile, ...await runAndStoreLiveSearch(preferences, "", undefined, profile, true) };
  }));
  const results = runs.map((run, index) => run.status === "fulfilled" ? run.value
    : { profile: index === 0 ? "owner" : "women", status: "unavailable", count: 0 });
  return Response.json({ results }, { status: results.every(({ count }) => count > 0) ? 200 : 503 });
}
