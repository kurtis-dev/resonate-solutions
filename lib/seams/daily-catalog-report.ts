import { defaultMemberSettings, initializeSeams, seamsSql } from "./members";
import { matchSeamsCatalog, readSeamsCatalog, refreshSeamsCatalog, seamsListingKey } from "./catalog";

type FeedStatus = "searched" | "partial" | "unavailable" | "needs-access" | "no-feed";
export type DailyCatalogReport = {
  completedAt: string;
  ok: boolean;
  total: number;
  sources: { source: string; added: number; status: FeedStatus }[];
  listingKeys: string[];
};

const publicListings = async () => matchSeamsCatalog(await readSeamsCatalog(), defaultMemberSettings, "", false, "include");
const feedFor = (item: Awaited<ReturnType<typeof publicListings>>[number]) => item.source === "ebay"
  ? item.seller === "Goodwill on eBay" ? "ebay-goodwill" : "ebay-brands"
  : item.source;

export async function runDailyCatalog() {
  const prior = new Set((await publicListings()).map(seamsListingKey));
  const startedAt = new Date().toISOString();
  const refreshed = await refreshSeamsCatalog(true, Date.parse(startedAt));
  const sources = new Map<string, DailyCatalogReport["sources"][number]>();
  for (const { feeds } of refreshed) {
    for (const feed of feeds) {
      const previous = sources.get(feed.source);
      const status = previous && previous.status !== feed.status ? "partial" : feed.status;
      sources.set(feed.source, { source: feed.source, added: 0, status });
    }
  }
  const added = (await publicListings()).filter((item) =>
    item.catalogCheckedAt === startedAt && !prior.has(seamsListingKey(item)));
  for (const item of added) {
    const feed = sources.get(feedFor(item));
    if (feed) feed.added++;
  }
  const ok = refreshed.every(({ department, count, result }) => result === "skipped" ||
    (result === "checked" && (department === "tour" || count > 0))) && refreshed.some(({ result }) => result === "checked");
  const report: DailyCatalogReport = {
    completedAt: new Date().toISOString(),
    ok,
    total: added.length,
    sources: Array.from(sources.values()),
    listingKeys: added.map(seamsListingKey),
  };
  const sql = await seamsSql();
  await sql`INSERT INTO seams_daily_catalog_runs (started_at, result) VALUES (${startedAt}::timestamptz, ${JSON.stringify(report)}::jsonb)`;
  return { completedAt: report.completedAt, ok, total: report.total, sources: report.sources };
}

export async function readDailyCatalogReport(first = false) {
  await initializeSeams();
  const sql = await seamsSql();
  const [row] = first
    ? await sql`SELECT result FROM seams_daily_catalog_runs ORDER BY started_at ASC LIMIT 1` as { result: DailyCatalogReport }[]
    : await sql`SELECT result FROM seams_daily_catalog_runs ORDER BY started_at DESC LIMIT 1` as { result: DailyCatalogReport }[];
  if (!row) return null;
  const keys = new Set(row.result.listingKeys);
  const candidates = (await publicListings()).filter((item) => keys.has(seamsListingKey(item)));
  const byFeed = new Map<string, (typeof candidates)[number]>();
  for (const item of candidates) if (!byFeed.has(feedFor(item))) byFeed.set(feedFor(item), item);
  const examples = Array.from(new Set([...Array.from(byFeed.values()), ...candidates])).slice(0, 8);
  return { ...row.result, examples };
}
