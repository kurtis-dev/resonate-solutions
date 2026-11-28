import { isSturdyShopGarment, searchVintageShop, type LiveListing } from "@/lib/fieldwear/inventory-sources";
import { isGoodwillPickupOnly, isVintageShop, vintageShops, tourShops } from "@/lib/fieldwear/marketplace-directory";
import { classifyGarment, type GarmentKind } from "@/lib/fieldwear/listing-model";
import { departmentMatch, sizeMatch, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { searchGoodwillEbay, searchSeamsEbayBrands } from "@/lib/fieldwear/live-search";
import { vintageSignals } from "@/lib/fieldwear/vintage-signals";
import { isQualityCasualTop } from "@/lib/fieldwear/casual-tops";
import { initializeSeams, seamsSql, type MemberSettings } from "./members";

const departments = ["men", "women", "tour"] as const;
type Department = (typeof departments)[number];
type CatalogRow = { department: Department; listings: LiveListing[]; checked_at: string | null };
export const interestLabels = {
  denim: "Denim", workwear: "Workwear", knitwear: "Knitwear", dresses: "Dresses & skirts", jackets: "Jackets", vintage90s: "90s",
} as const;

const sourceKey = (listing: LiveListing) => `${listing.source}:${listing.externalId}`;
export { sourceKey as seamsListingKey };
const maxUnverifiedAge = 36 * 60 * 60 * 1000;
const observationKey = (item: LiveListing) => item.source === "ebay"
  ? item.seller === "Goodwill on eBay" ? "ebay-goodwill" : "ebay-brands"
  : item.source;

async function refreshDepartment(department: Department, force: boolean, now: number) {
  const sql = await seamsSql();
  const [lease] = await sql`INSERT INTO seams_catalog (department, lease_until) VALUES (${department}, now() + interval '2 minutes')
    ON CONFLICT (department) DO UPDATE SET lease_until = EXCLUDED.lease_until
    WHERE (seams_catalog.lease_until IS NULL OR seams_catalog.lease_until < now())
    AND (${force} OR seams_catalog.checked_at IS NULL OR seams_catalog.checked_at < now() - interval '15 minutes')
    RETURNING lease_until::text AS lease_until, checked_at::text AS checked_at, listings` as { lease_until: string; checked_at: string | null; listings: LiveListing[] | null }[];
  if (!lease) return null;

  const observedAt = new Date(now).toISOString();
  const previous = lease.listings ?? [];
  const previousById = new Map(previous.map((item) => [sourceKey(item), item]));
  const preferences: ScoutPreferences = { department: department === "tour" ? "any" : department, shirtSizes: [], pantsSizes: [], shirtBudget: null, pantsBudget: null, matchingOnly: false };
  try {
    const shops = department === "tour" ? tourShops : vintageShops;
    const lookups = [
      ...shops.map((shop) => ({ name: shop.source, run: searchVintageShop(shop, preferences, "", { start: 0, now }, { tour: department === "tour", includePickupOnly: true, casualTops: true }) })),
      ...(department === "tour" ? [] : [
        { name: "ebay-goodwill", run: searchGoodwillEbay(department) },
        { name: "ebay-brands", run: searchSeamsEbayBrands(department, previous.filter((item) => isVintageShop(item.source))) },
      ]),
    ];
    const results = await Promise.allSettled(lookups.map(({ run }) => run));
    const listings = new Map<string, LiveListing>();
    const completed = new Set<string>();
    const unavailable = new Set<string>();
    let observedAnySource = false;
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      if (result.status !== "fulfilled") continue;
      if (result.value.status === "searched") completed.add(lookups[index].name);
      result.value.unavailableIds?.forEach((id) => unavailable.add(`ebay:${id}`));
      if (result.value.status === "searched" || result.value.status === "partial") observedAnySource = true;
      for (const item of result.value.listings) {
        const signals = vintageSignals(item);
        if (item.priceCents == null || !item.imageUrl || signals.build < 0 || (signals.build === 0 && signals.period < 0)) continue;
        const fit = { ...item, garmentKind: classifyGarment(item) };
        if (lookups[index].name === "ebay-brands") {
          if (department !== "tour" && !departmentMatch(fit, department)) continue;
        } else if (department === "women" && departmentMatch(fit, "women") < 2 && departmentMatch(fit, "unisex") < 2) continue;
        const id = sourceKey(item);
        const earlier = previousById.get(id);
        const firstSeen = earlier ? earlier.catalogFirstSeenAt ?? lease.checked_at ?? observedAt : observedAt;
        const existing = listings.get(id);
        if (existing?.seller === "Goodwill on eBay") continue;
        listings.set(id, { ...item, catalogFirstSeenAt: firstSeen, catalogCheckedAt: observedAt });
      }
    }
    if (!observedAnySource) return 0;
    unavailable.forEach((id) => listings.delete(id));
    for (const item of previous) {
      const checked = Date.parse(item.catalogCheckedAt ?? lease.checked_at ?? "");
      if (completed.has(observationKey(item)) || now - checked > maxUnverifiedAge || !Number.isFinite(checked)
        || (item.endsAt && Date.parse(item.endsAt) <= now) || listings.has(sourceKey(item)) || unavailable.has(sourceKey(item))) continue;
      listings.set(sourceKey(item), { ...item, catalogCheckedAt: new Date(checked).toISOString(), catalogFirstSeenAt: item.catalogFirstSeenAt ?? new Date(checked).toISOString() });
    }
    await sql`UPDATE seams_catalog SET checked_at = ${observedAt}::timestamptz, listings = ${JSON.stringify(Array.from(listings.values()))}::jsonb
      WHERE department = ${department} AND lease_until = ${lease.lease_until}::timestamptz`;
    return listings.size;
  } finally {
    await sql`UPDATE seams_catalog SET lease_until = NULL WHERE department = ${department} AND lease_until = ${lease.lease_until}::timestamptz`;
  }
}

export async function refreshSeamsCatalog(force = false) {
  await initializeSeams();
  const now = Date.now();
  const outcomes = await Promise.allSettled(departments.map((department) => refreshDepartment(department, force, now)));
  return outcomes.map((outcome, index) => ({ department: departments[index], count: outcome.status === "fulfilled" ? outcome.value : 0 }));
}

export async function readSeamsCatalog() {
  await initializeSeams();
  const sql = await seamsSql();
  return await sql`SELECT department, listings, checked_at::text AS checked_at FROM seams_catalog
    WHERE checked_at > now() - interval '36 hours'` as CatalogRow[];
}

export function needsSeamsRefresh(catalog: CatalogRow[], now = Date.now()) {
  return catalog.length < departments.length
    || catalog.some((row) => now - Date.parse(row.checked_at ?? "") >= 6 * 60 * 60 * 1000)
    || !catalog.some((row) => row.listings.some((item) => item.catalogCheckedAt));
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

export function matchSeamsCatalog(catalog: CatalogRow[], settings: MemberSettings, keywords = "", email = false, tour: boolean | "include" = false, includePickupOnly = false) {
  const terms = keywords.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const searchTerms = terms.map((term) => new RegExp(`\\b${term}`, "i"));
  const fitPreferences = { shirtSizes: settings.topSizes, pantsSizes: settings.bottomSizes } as ScoutPreferences;
  const unique = new Map<string, LiveListing>();
  const now = Date.now();
  for (const row of catalog) {
    const tourRow = row.department === "tour";
    if (tourRow ? !tour : tour === true || (settings.department !== "any" && settings.department !== row.department)) continue;
    for (const item of row.listings) {
      if (!includePickupOnly && (item.pickupOnly || isGoodwillPickupOnly(item.source, [item.title, item.description].join(" ")))) continue;
      const signals = vintageSignals(item);
      if (signals.decade === "y2k" && !signals.sturdy2000s) continue;
      const kind = classifyGarment(item);
      if (kind === "unknown" || (item.endsAt && Date.parse(item.endsAt) <= now)
        || (item.catalogCheckedAt && now - Date.parse(item.catalogCheckedAt) > maxUnverifiedAge)) continue;
      if (tourRow && tour === "include" && !departmentMatch({ title: item.title, garmentKind: kind }, settings.department)) continue;
      if (!sizeMatch({ ...item, garmentKind: kind }, fitPreferences)) continue;
      if (item.priceCents == null || (settings.budget != null && item.priceCents + (item.shippingCents ?? 0) > Math.round(settings.budget * 100))) continue;
      if (!searchTerms.every((term) => term.test(`${item.title} ${item.description ?? ""}`))) continue;
      if (email && settings.interests.length && !settings.interests.some((interest) => matchesInterest(item, kind, interest))) continue;
      unique.set(sourceKey(item), item);
    }
  }
  return Array.from(unique.values()).map((item) => {
    const kind = classifyGarment(item);
    const signals = vintageSignals(item);
    const taste = settings.interests.filter((interest) => matchesInterest(item, kind, interest)).length;
    const arrived = item.catalogFirstSeenAt ? Date.parse(item.catalogFirstSeenAt) : Date.parse(item.listedAt);
    const newest = tour === "include" && now - arrived < 7 * 86_400_000 ? arrived : 0;
    return { item, rank: taste * 100 + signals.period * 10 + signals.build * 5, newest };
  }).sort((a, b) => b.newest - a.newest || b.rank - a.rank || b.item.listedAt.localeCompare(a.item.listedAt)).map(({ item }) => item);
}

export function goodwillShelf(items: LiveListing[], workPantsOnly: boolean) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (item.source !== "fredgoodwill" && (item.source !== "ebay" || item.seller !== "Goodwill on eBay")) return false;
    const { title, description = "" } = item;
    if (workPantsOnly && (classifyGarment({ title }) !== "pants"
      || /\b(?:shortalls|shorts|leggings|joggers|sweatpants|ponte|lot of \d)\b/i.test(title)
      || !isSturdyShopGarment(title, description, "pants")
      || !/\b(?:carpenter|workwear|work (?:pants|trousers|jeans)|double[- ]knee|canvas|dungarees?|fatigue|sateen|painter|ripstop|utility|riveted)\b/i.test(`${title} ${description}`))) return false;
    const key = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const unique = !seen.has(key);
    seen.add(key);
    return unique;
  });
}

export function previewSeamsCatalog(items: LiveListing[], includeHighlights: boolean, tourKeys?: ReadonlySet<string>) {
  const previewSize = 288;
  const preview = items.slice(0, previewSize);
  if (items.length <= previewSize || (!includeHighlights && !tourKeys?.size)) return preview;

  const remainder = items.slice(previewSize);
  const isGoodwillEbay = (item: LiveListing) => item.source === "ebay" && item.seller === "Goodwill on eBay";
  const isSturdy2000s = (item: LiveListing) => vintageSignals(item).sturdy2000s;
  const reserve = includeHighlights ? [
    { matches: isGoodwillEbay, minimum: 24 },
    { matches: (item: LiveListing) => isVintageShop(item.source) && item.source !== "fredgoodwill", minimum: 48 },
    { matches: isSturdy2000s, minimum: 4 },
    { matches: isQualityCasualTop, minimum: 24 },
  ] : [];
  if (tourKeys?.size) reserve.push({ matches: (item) => tourKeys.has(sourceKey(item)), minimum: 12 });
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
