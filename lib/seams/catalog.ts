import { searchVintageShop, type LiveListing } from "@/lib/fieldwear/inventory-sources";
import { isGoodwillPickupOnly, vintageShops, tourShops } from "@/lib/fieldwear/marketplace-directory";
import { classifyGarment, type GarmentKind } from "@/lib/fieldwear/listing-model";
import { departmentMatch, sizeMatch, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { searchGoodwillEbay } from "@/lib/fieldwear/live-search";
import { vintageSignals } from "@/lib/fieldwear/vintage-signals";
import { initializeSeams, seamsSql, type MemberSettings } from "./members";

const departments = ["men", "women", "tour"] as const;
type Department = (typeof departments)[number];
type CatalogRow = { department: Department; listings: LiveListing[]; checked_at: string | null };
export const interestLabels = {
  denim: "Denim", workwear: "Workwear", knitwear: "Knitwear", dresses: "Dresses & skirts", jackets: "Jackets", vintage90s: "90s",
} as const;

const sourceKey = (listing: LiveListing) => `${listing.source}:${listing.externalId}`;
export { sourceKey as seamsListingKey };

async function refreshDepartment(department: Department, force: boolean) {
  const sql = await seamsSql();
  const [lease] = await sql`INSERT INTO seams_catalog (department, lease_until) VALUES (${department}, now() + interval '2 minutes')
    ON CONFLICT (department) DO UPDATE SET lease_until = EXCLUDED.lease_until
    WHERE (seams_catalog.lease_until IS NULL OR seams_catalog.lease_until < now())
    AND (${force} OR seams_catalog.checked_at IS NULL OR seams_catalog.checked_at < now() - interval '15 minutes')
    RETURNING lease_until::text AS lease_until` as { lease_until: string }[];
  if (!lease) return null;

  const now = Date.now();
  const preferences: ScoutPreferences = { department: department === "tour" ? "any" : department, shirtSizes: [], pantsSizes: [], shirtBudget: null, pantsBudget: null, matchingOnly: false };
  try {
    const shops = department === "tour" ? tourShops : vintageShops;
    const results = await Promise.allSettled([
      ...shops.map((shop) => searchVintageShop(shop, preferences, "", { start: 0, now }, { tour: department === "tour", includePickupOnly: true })),
      ...(department === "tour" ? [] : [searchGoodwillEbay(department)]),
    ]);
    const listings = new Map<string, LiveListing>();
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const item of result.value.listings) {
        const signals = vintageSignals(item);
        if (item.priceCents == null || !item.imageUrl || signals.build < 0 || (signals.build === 0 && signals.period < 0)) continue;
        const fit = { ...item, garmentKind: classifyGarment(item) };
        if (department === "women" && departmentMatch(fit, "women") < 2 && departmentMatch(fit, "unisex") < 2) continue;
        listings.set(sourceKey(item), item);
      }
    }
    if (!listings.size && (department !== "tour" || !results.some((result) => result.status === "fulfilled" && result.value.status !== "unavailable"))) return 0;
    await sql`UPDATE seams_catalog SET checked_at = ${new Date(now).toISOString()}::timestamptz, listings = ${JSON.stringify(Array.from(listings.values()))}::jsonb
      WHERE department = ${department} AND lease_until = ${lease.lease_until}::timestamptz`;
    return listings.size;
  } finally {
    await sql`UPDATE seams_catalog SET lease_until = NULL WHERE department = ${department} AND lease_until = ${lease.lease_until}::timestamptz`;
  }
}

export async function refreshSeamsCatalog(force = false) {
  await initializeSeams();
  const outcomes = await Promise.allSettled(departments.map((department) => refreshDepartment(department, force)));
  return outcomes.map((outcome, index) => ({ department: departments[index], count: outcome.status === "fulfilled" ? outcome.value : 0 }));
}

export async function readSeamsCatalog() {
  await initializeSeams();
  const sql = await seamsSql();
  return await sql`SELECT department, listings, checked_at::text AS checked_at FROM seams_catalog
    WHERE checked_at > now() - interval '36 hours'` as CatalogRow[];
}

function matchesInterest(item: LiveListing, kind: GarmentKind, interest: string) {
  const text = `${item.title} ${item.description ?? ""}`;
  switch (interest) {
    case "denim": return /\b(?:denim|jeans)\b/i.test(text);
    case "workwear": return /\b(?:workwear|duck|canvas|chore|double[- ]knee|carpenter)\b/i.test(text);
    case "knitwear": return /\b(?:knit|sweater|cardigan)\b/i.test(text);
    case "dresses": return kind === "dress" || kind === "skirt";
    case "jackets": return kind === "outerwear" || /shirt[- ]?jacket|shacket/i.test(item.title);
    case "vintage90s": return vintageSignals(item).decade === "90s";
    case "y2k": return vintageSignals(item).decade === "y2k";
    default: return false;
  }
}

export function matchSeamsCatalog(catalog: CatalogRow[], settings: MemberSettings, keywords = "", email = false, tour = false, includePickupOnly = false) {
  const terms = keywords.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const fitPreferences = { shirtSizes: settings.topSizes, pantsSizes: settings.bottomSizes } as ScoutPreferences;
  const unique = new Map<string, LiveListing>();
  for (const row of catalog) {
    if (tour ? row.department !== "tour" : row.department === "tour" || (settings.department !== "any" && settings.department !== row.department)) continue;
    for (const item of row.listings) {
      if (!includePickupOnly && (item.pickupOnly || isGoodwillPickupOnly(item.source, [item.title, item.description].join(" ")))) continue;
      const signals = vintageSignals(item);
      if (signals.decade === "y2k" && !signals.sturdy2000s) continue;
      const kind = classifyGarment(item);
      if (kind === "unknown" || (item.endsAt && Date.parse(item.endsAt) <= Date.now())) continue;
      if (!sizeMatch({ ...item, garmentKind: kind }, fitPreferences)) continue;
      if (item.priceCents == null || (settings.budget != null && item.priceCents + (item.shippingCents ?? 0) > Math.round(settings.budget * 100))) continue;
      if (!terms.every((term) => `${item.title} ${item.description ?? ""}`.toLowerCase().includes(term))) continue;
      if (email && settings.interests.length && !settings.interests.some((interest) => matchesInterest(item, kind, interest))) continue;
      unique.set(sourceKey(item), item);
    }
  }
  return Array.from(unique.values()).map((item) => {
    const kind = classifyGarment(item);
    const signals = vintageSignals(item);
    const taste = settings.interests.filter((interest) => matchesInterest(item, kind, interest)).length;
    return { item, rank: taste * 100 + signals.period * 10 + signals.build * 5 };
  }).sort((a, b) => b.rank - a.rank || b.item.listedAt.localeCompare(a.item.listedAt)).map(({ item }) => item);
}

export function previewSeamsCatalog(items: LiveListing[], includeHighlights: boolean) {
  const previewSize = 288;
  const preview = items.slice(0, previewSize);
  if (!includeHighlights || items.length <= previewSize) return preview;

  const remainder = items.slice(previewSize);
  const isGoodwillEbay = (item: LiveListing) => item.source === "ebay" && item.seller === "Goodwill on eBay";
  const isSturdy2000s = (item: LiveListing) => vintageSignals(item).sturdy2000s;
  const reserve = [
    { matches: isGoodwillEbay, minimum: 24 },
    { matches: isSturdy2000s, minimum: 4 },
  ];
  const additional = new Set<LiveListing>();
  for (const { matches, minimum } of reserve) {
    const featured = preview.filter(matches).length + Array.from(additional).filter(matches).length;
    remainder.filter((item) => !additional.has(item) && matches(item)).slice(0, Math.max(0, minimum - featured))
      .forEach((item) => additional.add(item));
  }
  if (!additional.size) return preview;
  let slots = additional.size;
  return preview.reduceRight<LiveListing[]>((kept, item) => {
    if (slots > 0 && !reserve.some(({ matches }) => matches(item))) slots--;
    else kept.push(item);
    return kept;
  }, []).reverse().concat(Array.from(additional).slice(0, additional.size - slots));
}
