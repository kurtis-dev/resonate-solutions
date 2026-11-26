import { classifyGarment, scoreListing, type ListingInput } from "./listing-model";
import { departmentMatch, fitPriority, matchesScoutFit, type ScoutPreferences } from "./preferences";
import { scoutDatabase } from "./owner-access";

export const freshListingDays = 7;
const day = 86_400_000;
const ebay = "https://api.ebay.com";
const excluded = /\b(?:reproduction|replica|print.on.demand|dry rot|sewing pattern|digital download|graphic tee|t-?shirt)\b/i;

type LiveListing = ListingInput & { listedAt: string };
type SearchResult = {
  searchedAt: string;
  keywords: string;
  status: "ok" | "partial" | "unavailable" | "unconfigured";
  listings: LiveListing[];
};

type EbayMoney = { value?: string; currency?: string };
type EbayItem = {
  legacyItemId?: string;
  itemWebUrl?: string;
  itemCreationDate?: string;
  itemOriginDate?: string;
  itemEndDate?: string;
  title?: string;
  image?: { imageUrl?: string };
  price?: EbayMoney;
  currentBidPrice?: EbayMoney;
  shippingOptions?: { shippingCost?: EbayMoney }[];
  condition?: string;
  shortDescription?: string;
};

let tokenCache: { value: string; expires: number } | undefined;

async function ebayToken(client: string, secret: string) {
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.value;
  const response = await fetch(`${ebay}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${client}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: `${ebay}/oauth/api_scope` }),
    cache: "no-store",
    signal: AbortSignal.timeout(6500),
  });
  if (!response.ok) throw new Error(`eBay OAuth status ${response.status}`);
  const { access_token, expires_in } = await response.json() as { access_token?: string; expires_in?: number };
  if (!access_token) throw new Error("eBay did not return an access token");
  tokenCache = { value: access_token, expires: Date.now() + Math.max(0, (expires_in ?? 0) - 60) * 1000 };
  return access_token;
}

function buildQueries(preferences: ScoutPreferences, keywords: string) {
  const department = { any: "", men: "mens", women: "womens", unisex: "unisex" }[preferences.department];
  const sizeTerms = (sizes: string[]) => {
    const aliases = sizes.flatMap((size) => size === "XLT" ? ["XLT", "TXL", '"XL Tall"'] : size === "2XL" ? ["2XL", "XXL"] : [size]);
    return aliases.length > 1 ? `(${aliases.join(",")})` : aliases[0] ?? "";
  };
  const shirt = sizeTerms(preferences.shirtSizes);
  const pants = sizeTerms(preferences.pantsSizes);
  const customKind = classifyGarment({ title: keywords });
  const lanes = keywords
    ? (customKind === "pants" ? [[pants, keywords]] : customKind === "shirt" ? [[shirt, keywords]] : [[shirt, `${keywords} shirt`], [pants, `${keywords} pants`]])
    : [[shirt, "cotton work shirt"], [shirt, "chamois shirt"], [shirt, "flannel lined shirt jacket"], [shirt, "wool work shirt"], [pants, "canvas carpenter pants"], [pants, "straight denim jeans"], [pants, "wool trousers"]];
  return Array.from(new Set(lanes.map(([sizes, garment]) => [department, sizes, garment].filter(Boolean).join(" "))));
}

function moneyCents(price?: EbayMoney) {
  if (!price?.value || price.currency !== "USD") return null;
  const value = Number(price.value);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : null;
}

function mapItem(item: EbayItem, start: number, now: number): LiveListing | null {
  const listedAt = item.itemOriginDate ?? item.itemCreationDate;
  const listedTime = Date.parse(listedAt ?? "");
  if (!listedAt || !(listedTime >= start && listedTime <= now)) return null;
  if (item.itemEndDate && Date.parse(item.itemEndDate) <= now) return null;
  const url = item.itemWebUrl?.match(/^https:\/\/(?:www\.)?ebay\.com\/itm\/(?:[^/?#]+\/)?(\d+)(?:[/?#]|$)/i);
  const id = item.legacyItemId ?? url?.[1];
  const imageUrl = item.image?.imageUrl;
  if (!url || id !== url[1] || !imageUrl || !/^https:\/\/(?:[\w-]+\.)*ebayimg\.com\//i.test(imageUrl) || !item.title) return null;
  const description = item.shortDescription?.replace(/<[^>]*>/g, " ").slice(0, 1000);
  if (excluded.test(item.title) || scoreListing({ source: "ebay", externalId: id, url: url[0], title: item.title, description }).fiberVerdict === "blend-or-synthetic") return null;
  return {
    source: "ebay", externalId: id, title: item.title, imageUrl, listedAt,
    url: `https://www.ebay.com/itm/${id}`, description, condition: item.condition,
    priceCents: moneyCents(item.price ?? item.currentBidPrice),
    shippingCents: moneyCents(item.shippingOptions?.[0]?.shippingCost),
  };
}

export async function searchNewListings(preferences: ScoutPreferences, keywords: string): Promise<SearchResult> {
  const now = Date.now();
  const result: SearchResult = { searchedAt: new Date(now).toISOString(), keywords, status: "unconfigured", listings: [] };
  const client = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;
  if (!client || !secret) return result;

  try {
    const token = await ebayToken(client, secret);
    const start = now - freshListingDays * day;
    const queries = buildQueries(preferences, keywords);
    const settled = await Promise.allSettled(queries.map(async (q) => {
      const params = new URLSearchParams({
        q, limit: "40", sort: "newlyListed",
        filter: `conditions:{USED},buyingOptions:{FIXED_PRICE|AUCTION},itemStartDate:[${new Date(start).toISOString()}..${result.searchedAt}]`,
      });
      const response = await fetch(`${ebay}/buy/browse/v1/item_summary/search?${params}`, {
        headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" },
        cache: "no-store",
        signal: AbortSignal.timeout(8500),
      });
      if (!response.ok) throw new Error(`eBay search status ${response.status}`);
      const { itemSummaries } = await response.json() as { itemSummaries?: EbayItem[] };
      return (itemSummaries ?? []).flatMap((item) => {
        const listing = mapItem(item, start, now);
        return listing ? [listing] : [];
      });
    }));
    const hits = new Map<string, LiveListing>();
    let succeeded = 0;
    for (const outcome of settled) {
      if (outcome.status !== "fulfilled") continue;
      succeeded++;
      for (const listing of outcome.value) hits.set(listing.externalId, listing);
    }
    const ranked = Array.from(hits.values()).flatMap((listing) => {
      const garmentKind = classifyGarment(listing);
      const fit = { ...listing, garmentKind };
      if ((garmentKind !== "shirt" && garmentKind !== "pants") || !departmentMatch(fit, preferences.department)) return [];
      if (preferences.matchingOnly && !matchesScoutFit(fit, preferences)) return [];
      const budget = garmentKind === "pants" ? preferences.pantsBudget : preferences.shirtBudget;
      if (budget != null && listing.priceCents != null && listing.priceCents + (listing.shippingCents ?? 0) > Math.round(budget * 100)) return [];
      return [{ listing, garmentKind, fit: fitPriority(fit, preferences), quality: scoreListing(listing, preferences).tasteMatch }];
    }).sort((a, b) => b.fit - a.fit || b.quality - a.quality || b.listing.listedAt.localeCompare(a.listing.listedAt));
    result.status = succeeded === queries.length ? "ok" : succeeded ? "partial" : "unavailable";
    result.listings = ["shirt", "pants"].flatMap((kind) => ranked.filter((item) => item.garmentKind === kind).slice(0, 18).map(({ listing }) => listing));
  } catch {
    result.status = "unavailable";
  }
  return result;
}

export async function runAndStoreLiveSearch(preferences: ScoutPreferences, keywords: string) {
  const result = await searchNewListings(preferences, keywords);
  const sql = await scoutDatabase();
  await sql`INSERT INTO fieldwear_live_search (profile, settings, searched_at, result)
    VALUES ('owner', ${JSON.stringify(preferences)}::jsonb, ${result.searchedAt}::timestamptz, ${JSON.stringify(result)}::jsonb)
    ON CONFLICT (profile) DO UPDATE SET settings = EXCLUDED.settings, searched_at = EXCLUDED.searched_at, result = EXCLUDED.result
    WHERE fieldwear_live_search.searched_at <= EXCLUDED.searched_at`;
}

export async function readLiveSearch(preferences?: ScoutPreferences) {
  const sql = await scoutDatabase();
  const [row] = preferences
    ? await sql`SELECT result FROM fieldwear_live_search WHERE profile = 'owner' AND settings = ${JSON.stringify(preferences)}::jsonb` as { result: SearchResult }[]
    : await sql`SELECT result FROM fieldwear_live_search WHERE profile = 'owner'` as { result: SearchResult }[];
  if (!row) return null;
  const now = Date.now();
  const expired = Date.parse(row.result.searchedAt) < now - day / 4;
  return {
    ...row.result, expired,
    listings: expired ? [] : row.result.listings.filter((item) => Date.parse(item.listedAt) >= now - freshListingDays * day),
  };
}
