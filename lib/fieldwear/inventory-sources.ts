import { classifyGarment, type ListingInput } from "./listing-model";
import { vintageShops } from "./marketplace-directory";
import { departmentMatch, fitPriority, matchesScoutFit, type ScoutPreferences } from "./preferences";

export type LiveListing = ListingInput & { listedAt: string };
export type SourceResult = {
  status: "searched" | "partial" | "unavailable" | "needs-access" | "no-feed";
  listings: LiveListing[];
};

type Window = { start: number; now: number };
type Shop = (typeof vintageShops)[number];
const etsy = "https://openapi.etsy.com/v3/application";
const parallelLimit = 6;

export function isFresh(value: string, { start, now }: Window) {
  const date = Date.parse(value);
  return date >= start && date <= now;
}

function decodeText(value: string) {
  const entities: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, code: string) => {
    if (code[0] !== "#") return entities[code.toLowerCase()] ?? match;
    const number = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return number >= 0 && number <= 0x10ffff ? String.fromCodePoint(number) : match;
  });
}

function plainText(value = "") {
  return decodeText(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 1000);
}

function httpsImage(value: string | undefined, host: string, allowedHost = "") {
  if (!value) return null;
  try {
    const url = new URL(value, "https://" + host);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.hostname === allowedHost || url.hostname === host || url.hostname.endsWith("." + host) ? url.href : null;
  } catch {
    return null;
  }
}

type Candidate = Pick<ListingInput, "title" | "size"> & { garmentKind: string; listedAt: string };

function fitsSearch(item: Candidate, preferences: ScoutPreferences) {
  return (item.garmentKind === "shirt" || item.garmentKind === "pants")
    && departmentMatch(item, preferences.department) > 0
    && (!preferences.matchingOnly || matchesScoutFit(item, preferences));
}

function shortlist<T extends Candidate>(candidates: T[], preferences: ScoutPreferences) {
  const compare = (a: T, b: T) => fitPriority(b, preferences) - fitPriority(a, preferences) || b.listedAt.localeCompare(a.listedAt);
  return ["shirt", "pants"].flatMap((kind) => candidates.filter((item) => item.garmentKind === kind)
    .sort(compare).slice(0, parallelLimit));
}

async function resolveCandidates<T>(candidates: T[], load: (candidate: T) => Promise<LiveListing | null>, status: SourceResult["status"] = "searched"): Promise<SourceResult> {
  const listings: LiveListing[] = [];
  let failed = 0;
  for (let index = 0; index < candidates.length; index += parallelLimit) {
    const outcomes = await Promise.allSettled(candidates.slice(index, index + parallelLimit).map(load));
    for (const outcome of outcomes) {
      if (outcome.status === "rejected") failed++;
      else if (outcome.value) listings.push(outcome.value);
    }
  }
  return { status: failed && failed === candidates.length ? "unavailable" : failed ? "partial" : status, listings };
}

export async function searchVintageShop(shop: Shop, preferences: ScoutPreferences, keywords: string, window: Window): Promise<SourceResult> {
  const signal = AbortSignal.timeout(10_000);
  const options: RequestInit = { cache: "no-store", signal, redirect: "error" };
  const [feed, cart] = await Promise.all([
    fetch(`${shop.origin}/collections/${shop.collection}.atom`, options),
    fetch(`${shop.origin}/cart.js`, options),
  ]);
  if (!feed.ok || !cart.ok) return { status: "unavailable", listings: [] };
  const { currency } = await cart.json() as { currency?: string };
  const xml = await feed.text();
  if (currency !== "USD" || !xml.includes("http://www.w3.org/2005/Atom")) return { status: "unavailable", listings: [] };
  const tokens = keywords.toLowerCase().replace(/[.']/g, "").match(/[a-z0-9]+/g) ?? [];
  const kindRequested = classifyGarment({ title: keywords });
  const terms = tokens.filter((token) => !/^(?:shirts?|pants?|trousers?|jeans?|vintage)$/.test(token));
  const candidates = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g), ([, entry]) => {
    const url = decodeText(entry.match(/<link\b[^>]*\brel="alternate"[^>]*\bhref="([^"]+)"/)?.[1] ?? "");
    const title = plainText(entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]);
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    const summary = plainText(entry.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)?.[1]);
    const handle = url.startsWith(shop.origin + "/") ? url.slice(shop.origin.length).match(/^\/products\/([\w-]+)$/)?.[1] : null;
    const garmentKind = classifyGarment({ title });
    const candidate = { title, handle, url, garmentKind, listedAt: published };
    const searchable = `${title} ${summary}`.toLowerCase().replace(/[.']/g, "");
    if (!handle || !title || !isFresh(published, window) || !fitsSearch(candidate, preferences)) return null;
    if ((kindRequested === "shirt" || kindRequested === "pants") && kindRequested !== garmentKind) return null;
    return terms.every((term) => searchable.includes(term)) ? { ...candidate, handle } : null;
  }).filter((item) => item !== null);

  return resolveCandidates(shortlist(candidates, preferences), async ({ handle, url, title, listedAt }) => {
    const response = await fetch(`${shop.origin}/products/${handle}.js`, options);
    if (response.status === 404 || response.status === 410) return null;
    if (!response.ok) throw new Error("Shop product details unavailable");
    const product = await response.json() as {
      id?: number; available?: boolean; published_at?: string; description?: string;
      featured_image?: string; variants?: { price?: number; available?: boolean }[];
    };
    const imageUrl = httpsImage(product.featured_image, "cdn.shopify.com", new URL(shop.origin).hostname);
    const id = product.id;
    if (!product.available || !imageUrl || !Number.isSafeInteger(id)) return null;
    if (product.published_at && !isFresh(product.published_at, window)) return null;
    const description = plainText(product.description);
    const price = product.variants?.find((variant) => variant.available)?.price;
    return { source: shop.source, externalId: String(id), url, title, description, imageUrl,
      listedAt: new Date(listedAt).toISOString(), priceCents: typeof price === "number" && Number.isSafeInteger(price) && price >= 0 ? price : null };
  });
}

type EtsyListing = {
  listing_id?: number; title?: string; description?: string; state?: string; quantity?: number;
  url?: string; original_creation_timestamp?: number; creation_timestamp?: number; created_timestamp?: number;
  price?: { amount?: number; divisor?: number; currency_code?: string };
};

export async function searchEtsy(preferences: ScoutPreferences, keywords: string, window: Window): Promise<SourceResult> {
  const key = process.env.ETSY_API_KEY?.trim();
  const secret = process.env.ETSY_SHARED_SECRET?.trim();
  if (!key || !secret) return { status: "needs-access", listings: [] };
  const signal = AbortSignal.timeout(10_000);
  const options: RequestInit = { cache: "no-store", signal, redirect: "error", headers: { "x-api-key": `${key}:${secret}` } };
  const customKind = classifyGarment({ title: keywords });
  const lanes = keywords
    ? (customKind === "shirt" || customKind === "pants" ? [[customKind, keywords]] : [["shirt", keywords + " shirt"], ["pants", keywords + " pants"]])
    : [["shirt", "vintage cotton work shirt"], ["shirt", "vintage chamois shirt"], ["shirt", "vintage lined shirt jacket"], ["pants", "vintage carpenter work pants"], ["pants", "vintage denim jeans"]];
  const querySet = new Set(lanes.flatMap(([kind, phrase]) => {
    const sizes = kind === "pants" ? preferences.pantsSizes : preferences.shirtSizes;
    // Broad searches catch alternate sizing language. A focused search gives the priority size its own result page.
    return sizes[0] ? [phrase, `${phrase} ${sizes[0]}`] : [phrase];
  }));
  const settled = await Promise.allSettled(Array.from(querySet, async (keywords) => {
    const params = new URLSearchParams({ keywords, sort_on: "created", sort_order: "desc", limit: "50", currency: "USD", buyer_country: "US" });
    const response = await fetch(`${etsy}/listings/active?${params}`, options);
    if (!response.ok) throw new Error(`Etsy search status ${response.status}`);
    return ((await response.json()) as { results: EtsyListing[] }).results;
  }));
  const successes = settled.filter((result) => result.status === "fulfilled");
  if (!successes.length) return { status: "unavailable", listings: [] };
  const unique = new Map(successes.flatMap((result) => result.value.map((listing) => [listing.listing_id, listing] as const)));
  const candidates = Array.from(unique.values()).flatMap((item) => {
    if (!item.listing_id || item.state !== "active" || item.quantity === 0 || !item.title) return [];
    const seconds = item.original_creation_timestamp ?? item.creation_timestamp ?? item.created_timestamp;
    if (!seconds || !Number.isFinite(seconds) || seconds * 1000 < window.start || seconds * 1000 > window.now) return [];
    const catalog = item.url?.match(/^https:\/\/(?:www\.)?etsy\.com\/(?:[a-z]{2}\/)?listing\/(\d+)(?:[/?#]|$)/i);
    if (!catalog || catalog[1] !== String(item.listing_id)) return [];
    const title = plainText(item.title);
    const description = plainText(item.description);
    const candidate = { title, description, listedAt: new Date(seconds * 1000).toISOString(), garmentKind: classifyGarment({ title }), item };
    return fitsSearch(candidate, preferences) ? [candidate] : [];
  });
  const status = successes.length === settled.length ? "searched" : "partial";
  return resolveCandidates(shortlist(candidates, preferences), async ({ item, listedAt, title, description }) => {
    const response = await fetch(`${etsy}/listings/${item.listing_id}/images`, options);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Etsy listing image unavailable");
    const { results } = await response.json() as { results?: { rank?: number; url_fullxfull?: string }[] };
    const best = results?.slice().sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))[0];
    const imageUrl = httpsImage(best?.url_fullxfull, "etsystatic.com");
    if (!imageUrl) return null;
    const { amount, divisor, currency_code } = item.price ?? {};
    const priceCents = currency_code === "USD" && typeof amount === "number" && amount >= 0 && typeof divisor === "number" && divisor > 0
      ? Math.round(amount / divisor * 100) : null;
    return { source: "etsy", externalId: String(item.listing_id), url: `https://www.etsy.com/listing/${item.listing_id}`, title,
      description, imageUrl, listedAt, priceCents };
  }, status);
}
