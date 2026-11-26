import { classifyGarment, type ListingInput } from "./listing-model";
import { setTimeout as delay } from "node:timers/promises";
import { vintageShops } from "./marketplace-directory";
import { departmentMatch, fitPriority, matchesScoutFit, pantsSizeTokens, shirtSizeTokens, type ScoutPreferences } from "./preferences";

export type LiveListing = ListingInput & { listedAt: string };
export type SourceResult = {
  status: "searched" | "partial" | "unavailable" | "needs-access" | "no-feed";
  listings: LiveListing[];
};

type Window = { start: number; now: number };
type Shop = (typeof vintageShops)[number];
const etsy = "https://openapi.etsy.com/v3/application";
const parallelLimit = 6;
// Keep a margin under Etsy's five requests per second for this app key.
const etsyRequestInterval = 250;
let etsyRequestQueue = Promise.resolve();
let nextEtsyRequest = 0;

async function fetchEtsy(path: string, options: RequestInit, signal: AbortSignal) {
  const ready = etsyRequestQueue.then(async () => {
    while (nextEtsyRequest > performance.now()) {
      await delay(Math.ceil(nextEtsyRequest - performance.now()), undefined, { signal });
    }
    signal.throwIfAborted();
    nextEtsyRequest = performance.now() + etsyRequestInterval;
  });
  etsyRequestQueue = ready.catch(() => {});
  await ready;
  const response = await fetch(`${etsy}${path}`, options);
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("retry-after"));
    if (retryAfter > 0 && Number.isFinite(retryAfter)) {
      nextEtsyRequest = Math.max(nextEtsyRequest, performance.now() + retryAfter * 1000);
    }
  }
  return response;
}

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
  const phrases = keywords ? [keywords] : [
    ...preferences.shirtSizes.slice(0, 3).map((size) => `work shirt ${size}`),
    ...preferences.pantsSizes.slice(0, 4),
  ];
  const [feed, cart, suggestions] = await Promise.all([
    fetch(`${shop.origin}/collections/${shop.collection}.atom`, options).catch(() => null),
    fetch(`${shop.origin}/cart.js`, options),
    Promise.allSettled(phrases.map(async (q) => {
      const params = new URLSearchParams({ q, "resources[type]": "product", "resources[options][unavailable_products]": "hide" });
      const response = await fetch(`${shop.origin}/search/suggest.json?${params}`, options);
      if (!response.ok) throw new Error("Shop search unavailable");
      const data = await response.json() as { resources?: { results?: { products?: { url?: string; title?: string; available?: boolean; product_type?: string; type?: string }[] } } };
      if (!Array.isArray(data.resources?.results?.products)) throw new Error("Invalid shop search response");
      return data.resources.results.products;
    })),
  ]);
  if (!cart.ok) return { status: "unavailable", listings: [] };
  const { currency } = await cart.json() as { currency?: string };
  if (currency !== "USD") return { status: "unavailable", listings: [] };
  const xml = feed?.ok ? await feed.text() : "";
  const hasFeed = xml.includes("http://www.w3.org/2005/Atom");
  if (!hasFeed && !suggestions.some((result) => result.status === "fulfilled")) return { status: "unavailable", listings: [] };
  const tokens = keywords.toLowerCase().replace(/[.']/g, "").match(/[a-z0-9]+/g) ?? [];
  const kindRequested = classifyGarment({ title: keywords });
  const terms = tokens.filter((token) => !/^(?:shirts?|pants?|trousers?|jeans?|vintage)$/.test(token));
  const candidateFor = (rawUrl: string, title: string, listedAt: string, type = "") => {
    const productPath = rawUrl.startsWith(shop.origin + "/") ? rawUrl.slice(shop.origin.length) : rawUrl;
    const handle = /^\/products\/([\w-]+)(?:[?#]|$)/.exec(productPath)?.[1];
    if (!handle || !title || /\b(?:reworked|cropped|cut.off|graphic tee|track pants|joggers?|sweatpants)\b/i.test(title)) return null;
    const inferred = classifyGarment({ title });
    const garmentKind = inferred === "unknown" && /^(?:button ups?|shirts?)$/i.test(type) ? "shirt" : inferred;
    const candidate = { title, handle, url: `${shop.origin}/products/${handle}`, garmentKind, listedAt };
    if (!fitsSearch(candidate, preferences)) return null;
    if ((kindRequested === "shirt" || kindRequested === "pants") && kindRequested !== garmentKind) return null;
    return candidate;
  };
  const feedCandidates = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g), ([, entry]) => {
    const url = decodeText(entry.match(/<link\b[^>]*\brel="alternate"[^>]*\bhref="([^"]+)"/)?.[1] ?? "");
    const title = plainText(entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]);
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    const summary = plainText(entry.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)?.[1]);
    const searchable = `${title} ${summary}`.toLowerCase().replace(/[.']/g, "");
    return isFresh(published, window) && terms.every((term) => searchable.includes(term)) ? candidateFor(url, title, published) : null;
  }).filter((item) => item !== null);
  const candidates = new Map(feedCandidates.map((item) => [item.handle, item]));
  for (const result of suggestions) {
    if (result.status !== "fulfilled") continue;
    for (const product of result.value) {
      if (!product.url || !product.title || product.available !== true) continue;
      const item = candidateFor(product.url, plainText(product.title), "", product.product_type ?? product.type);
      if (item && !candidates.has(item.handle)) candidates.set(item.handle, item);
    }
  }

  const sourceStatus = hasFeed && suggestions.every((result) => result.status === "fulfilled") ? "searched" : "partial";
  return resolveCandidates(shortlist(Array.from(candidates.values()), preferences), async ({ handle, url, title, listedAt, garmentKind }) => {
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
    const published = product.published_at ?? listedAt;
    if (!isFresh(published, window)) return null;
    const description = plainText(product.description).replace(/\b(PIT TO PIT:\s*\d+(?:\.\d+)?\s*["″])\s+LENGTH\s*:/gi, "$1 Body length:");
    if (!terms.every((term) => `${title} ${description}`.toLowerCase().replace(/[.']/g, "").includes(term))) return null;
    const sizeTag = description.match(/\bsize tag:\s*(.+?)(?=\s+(?:pit to pit|length|waist|inseam|collar|flaws)\s*:|$)/i)?.[1];
    const knownWaist = title.match(/\b(?:tagged(?: size)?|size)\s*W?\s*(\d{2})\b/i)?.[1];
    const size = garmentKind === "pants"
      ? pantsSizeTokens(title).filter((value) => value.includes("x")).join(" / ") || (knownWaist ? `W${knownWaist}` : undefined)
      : shirtSizeTokens(sizeTag ?? title.replace(/\b(?:[a-z]\.){2,}/gi, "")).join(" / ") || undefined;
    if ((!listedAt || preferences.matchingOnly) && !matchesScoutFit({ title, size, garmentKind }, preferences)) return null;
    const price = product.variants?.find((variant) => variant.available)?.price;
    return { source: shop.source, externalId: String(id), url, title, description, imageUrl, size,
      listedAt: new Date(published).toISOString(), priceCents: typeof price === "number" && Number.isSafeInteger(price) && price >= 0 ? price : null };
  }, sourceStatus);
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
  const signal = AbortSignal.timeout(15_000);
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
    const response = await fetchEtsy(`/listings/active?${params}`, options, signal);
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
    const response = await fetchEtsy(`/listings/${item.listing_id}/images`, options, signal);
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
