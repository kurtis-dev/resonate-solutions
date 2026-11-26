import { z } from "zod";
import { classifyGarment, detectMarketplace, scoreListing, type ListingInput } from "./listing-model";

export const scoutTimeZone = "America/Chicago";
export const scoutSources = [
  ["ebay", "eBay", "https://www.ebay.com/sch/i.html?_nkw="],
  ["etsy", "Etsy", "https://www.etsy.com/search?q="],
  ["grailed", "Grailed", "https://www.grailed.com/shop?query="],
  ["poshmark", "Poshmark", "https://poshmark.com/search?type=listings&query="],
  ["depop", "Depop", "https://www.depop.com/search/?q="],
  ["mercari", "Mercari", "https://www.mercari.com/search/?keyword="],
  ["vinted", "Vinted", "https://www.vinted.com/catalog?search_text="],
  ["shopgoodwill", "ShopGoodwill", "https://shopgoodwill.com/categories/listing?st="],
] as const;

const itemPaths = {
  ebay: /^\/itm\/(?:[^/]+\/)?(\d+)\/?$/i,
  etsy: /^\/(?:[a-z]{2}\/)?listing\/(\d+)(?:\/[^/]+)?\/?$/i,
  grailed: /^\/listings\/(\d+)(?:-[^/]+)?\/?$/i,
  poshmark: /^\/listing\/[^/]*?([a-f0-9]{24})\/?$/i,
  depop: /^\/products\/([a-z0-9-]+)\/?$/i,
  mercari: /^\/us\/item\/(m\d+)\/?$/i,
  vinted: /^\/items\/(\d+)(?:-[^/]+)?\/?$/i,
  shopgoodwill: /^\/item\/(\d+)\/?$/i,
};

const sourceIds = scoutSources.map(([id]) => id);
const sourceSchema = z.enum(["ebay", "etsy", "grailed", "poshmark", "depop", "mercari", "vinted", "shopgoodwill"]);
const httpsUrl = z.string().max(1500).url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
});
const coverageSchema = z.object({
  source: sourceSchema,
  status: z.enum(["searched", "limited", "unavailable", "not-checked"]),
}).strict();
const findSchema = z.object({
  url: httpsUrl,
  imageUrl: httpsUrl,
  title: z.string().trim().min(8).max(160),
  size: z.string().trim().min(2).max(100),
  priceCents: z.number().int().nonnegative().max(10_000_000).nullable(),
  evidence: z.string().trim().min(12).max(520),
}).strict();

export const dailySubmission = z.object({
  coverage: z.array(coverageSchema).min(1).max(sourceIds.length)
    .refine((items) => new Set(items.map((item) => item.source)).size === items.length, "Use one result per marketplace")
    .refine((items) => items.some((item) => item.status !== "not-checked"), "Report at least one attempted source"),
  finds: z.array(findSchema).max(12),
}).strict();

export type DailyCoverage = z.infer<typeof coverageSchema>;
export type DailyFind = ListingInput & { source: DailyCoverage["source"]; evidence: string };
export type DailyEdition = { day: string; checkedAt: string; coverage: DailyCoverage[]; finds: DailyFind[] };

export function scoutDay(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: scoutTimeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  return ["year", "month", "day"].map((part) => parts.find((entry) => entry.type === part)?.value).join("-");
}

export function scoutItemKey(url: string) {
  const parsed = new URL(url);
  const source = detectMarketplace(url);
  if (source === "other") return null;
  const externalId = parsed.pathname.match(itemPaths[source])?.[1]?.toLowerCase();
  return externalId ? { source, externalId } : null;
}

export function prepareDailyFind(input: z.infer<typeof findSchema>): DailyFind | null {
  const key = scoutItemKey(input.url);
  if (!key) return null;
  const url = new URL(input.url);
  url.search = "";
  url.hash = "";
  const listing = { ...input, ...key, url: url.href, description: input.evidence };
  const kind = classifyGarment({ title: listing.title, size: listing.size });
  const fit = kind === "pants"
    ? /\b(?:38|39|40)\s*[x×]\s*(?:32|33|34)\b/i.test(listing.size)
    : /\b(?:XLT|TXL|XL[ -]?(?:TALL|LONG|T|EXTRA LONG)|XXL|2\s?XLT?)\b/i.test(listing.size);
  if ((kind !== "shirt" && kind !== "pants") || !fit) return null;
  const score = scoreListing(listing);
  const reject = /\b(?:graphic tee|reproduction|replica|print.on.demand|dry rot|digital download|sewing pattern)\b/i;
  return reject.test(`${listing.title} ${listing.evidence}`) || score.fiberVerdict === "blend-or-synthetic" ? null : listing;
}
