import { searchVintageShop, type LiveListing } from "@/lib/fieldwear/inventory-sources";
import { vintageShops } from "@/lib/fieldwear/marketplace-directory";
import { classifyGarment, type GarmentKind } from "@/lib/fieldwear/listing-model";
import { departmentMatch, sizeMatch, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { vintageSignals } from "@/lib/fieldwear/vintage-signals";
import { initializeSeams, seamsSql, type MemberSettings } from "./members";

const departments = ["men", "women"] as const;
type Department = (typeof departments)[number];
type CatalogRow = { department: Department; listings: LiveListing[]; checked_at: string | null };
export const interestLabels = {
  denim: "Denim", workwear: "Workwear", knitwear: "Knitwear", dresses: "Dresses & skirts", jackets: "Jackets", vintage90s: "90s", y2k: "Y2K",
} as const;

const sourceKey = (listing: LiveListing) => `${listing.source}:${listing.externalId}`;
export { sourceKey as seamsListingKey };

async function refreshDepartment(department: Department, force: boolean) {
  const sql = await seamsSql();
  const [lease] = await sql`INSERT INTO seams_catalog (department, lease_until) VALUES (${department}, now() + interval '2 minutes')
    ON CONFLICT (department) DO UPDATE SET lease_until = EXCLUDED.lease_until
    WHERE (seams_catalog.lease_until IS NULL OR seams_catalog.lease_until < now())
    AND (${force} OR seams_catalog.checked_at IS NULL OR seams_catalog.checked_at < now() - interval '15 minutes')
    RETURNING lease_until` as { lease_until: string }[];
  if (!lease) return null;

  const now = Date.now();
  const preferences: ScoutPreferences = { department, shirtSizes: [], pantsSizes: [], shirtBudget: null, pantsBudget: null, matchingOnly: false };
  try {
    const results = await Promise.allSettled(vintageShops.map((shop) => searchVintageShop(shop, preferences, "", { start: 0, now })));
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
    if (!listings.size) return 0;
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
  return await sql`SELECT department, listings, checked_at FROM seams_catalog
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

export function matchSeamsCatalog(catalog: CatalogRow[], settings: MemberSettings, keywords = "", email = false) {
  const terms = keywords.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const fitPreferences = { shirtSizes: settings.topSizes, pantsSizes: settings.bottomSizes } as ScoutPreferences;
  const unique = new Map<string, LiveListing>();
  for (const row of catalog) {
    if (settings.department !== "any" && settings.department !== row.department) continue;
    for (const item of row.listings) {
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
