import { classifyGarment, type ListingInput } from "./listing-model";
import { setTimeout as delay } from "node:timers/promises";
import { isPeriodTourShirt } from "@/lib/seams/tour-shirts";
import { isGoodwillPickupOnly, vintageShops, tourShops } from "./marketplace-directory";
import { vintageSignals } from "./vintage-signals";
import { departmentMatch, fitPriority, matchesScoutFit, pantsSizeTokens, reportedPantsFit, shirtSizeTokens, type ScoutPreferences } from "./preferences";

export type LiveListing = ListingInput & { listedAt: string; endsAt?: string };
export type SourceResult = {
  status: "searched" | "partial" | "unavailable" | "needs-access" | "no-feed";
  listings: LiveListing[];
};

type Window = { start: number; now: number };
type Shop = (typeof vintageShops | typeof tourShops)[number];
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
  return (item.garmentKind === "shirt" || item.garmentKind === "pants" || (preferences.department === "women" && ["outerwear", "dress", "skirt"].includes(item.garmentKind)))
    && departmentMatch(item, preferences.department) > 0
    && (!preferences.matchingOnly || matchesScoutFit(item, preferences));
}

function shortlist<T extends Candidate>(candidates: T[], preferences: ScoutPreferences) {
  const compare = (a: T, b: T) => fitPriority(b, preferences) - fitPriority(a, preferences) || b.listedAt.localeCompare(a.listedAt);
  const kinds = preferences.department === "women" ? ["shirt", "pants", "outerwear", "dress", "skirt"] : ["shirt", "pants"];
  return kinds.flatMap((kind) => candidates.filter((item) => item.garmentKind === kind)
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

const shopPageSize = 100;
const shopExcluded = /\b(?:reworked|reproduction|replica|reissue|cropped|cut.off|tie[- ]dye|short[- ]sleeve|shorts?|track pants|joggers?|sweatpants|hoodies?|tees?|t[- ]?shirts?|sportswear)\b/i;
const workShirtClues = /\b(?:work(?:wear)?|field|utility|chore|flannel|two[- ]pocket|double[- ]pocket|pearl[- ]snap|western|chambray|pendleton|woolrich|filson|browning|big mac|big yank|five brother|saddle king|dee cee|oshkosh)\b/i;
const workPantsClues = /\b(?:carpenter|work(?:wear)?|double[- ]knee|painter|fatigue|cargo|riveted|straight[- ]leg|dungarees?|chinos?|(?:carhartt|dickies)\b[^\n.]{0,80}\bjeans)\b/i;
const newerThanPreferred = /\b(?:2010s|2020s|(?:produced|manufactured|made|dated) in 20[12]\d)\b/i;
const structuralDamage = /\b(?:dry rot|broken zip(?:per)?|heavy staining|large holes?|(?:major|unrepaired) tears?|rips?|(?:missing|ripped|torn) belt loops?|belt loops? (?:missing|ripped|torn)|tear on (?:the )?back pocket|torn open)\b/i;
const damageDenial = /\b(?:no|without)\s+(?:visible\s+)?(?:(?:(?:major|large|heavy)\s+)?(?:rips?|holes?|tears?|stains?)|flaws|damage)(?:(?:\s*,\s*(?:(?:and|or)\s+)?|\s+(?:and|or)\s+)(?:(?:(?:major|large|heavy)\s+)?(?:rips?|holes?|tears?|stains?)|flaws|damage))*/gi;
const lightweightPants = /\b(?:city flex|tactical lightweight|four[- ]way stretch|moisture[- ]wicking|slim[- ]fit\b[^\n.]{0,65}\bstretch)\b/i;

type ShopProduct = {
  id?: number;
  title?: string;
  handle?: string;
  body_html?: string;
  published_at?: string;
  product_type?: string;
  tags?: string | string[];
  images?: { src?: string }[];
  variants?: { id?: number; available?: boolean; price?: string; option1?: string; option2?: string; option3?: string }[];
  options?: { name?: string; position?: number }[];
};

export function shopSellerNotes(html = "") {
  return decodeText(html.replace(/<\/?(?:p|div|li|br)\b[^>]*>/gi, "\n").replace(/<[^>]*>/g, " "))
    .split(/\b(?:please note|all flaws mentioned)\b|\n\s*(?:shipping|local pick ?up)\s*(?=\n|:)/i, 1)[0]
    .split(/\n+/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n").slice(0, 1800);
}

export function shopSize(title: string, notes: string, option: string, garmentKind: "shirt" | "pants"): {
  size?: string;
  sizeBasis?: "tag" | "seller-fit" | "measured";
} {
  const fitSize = notes.match(/^(?:recommended|modern) size\s*:\s*(.+)$/im)?.[1];
  const taggedSize = notes.match(/^(?:tagged size|size(?: tag)?)\s*:\s*(.+)$/im)?.[1];
  if (garmentKind === "shirt") {
    const choices = [
      [fitSize, "seller-fit"],
      [taggedSize, "tag"],
      [option, "seller-fit"],
      [title.replace(/\b(?:[a-z]\.){2,}|\b[LS]\/[LS]\b/gi, ""), "seller-fit"],
    ] as const;
    for (const [raw, sizeBasis] of choices) {
      const size = shirtSizeTokens(raw ?? "").join(" / ");
      if (size) return { size, sizeBasis };
    }
    return {};
  }
  const waist = notes.match(/\bwaist(\s+flat|\s+laid flat)?\s*:\s*(\d{2}(?:\.\d+)?)\s*(?:["″]|in\b|inches\b|$)(\s+flat)?(?:\s*\(\s*(\d{2}(?:\.\d+)?)\s*(?:["″]|in\b|inches\b)?\s*doubled\s*\))?/im);
  const inseam = notes.match(/\binseam\s*:\s*(\d{2}(?:\.\d+)?)\s*(?:["″]|in\b|inches\b|$)/im);
  if (waist && inseam) {
    const fullWaist = waist[4] ?? String(Number(waist[2]) * (waist[1] || waist[3] ? 2 : 1));
    return { size: `${fullWaist}x${Number(inseam[1])}`, sizeBasis: "measured" };
  }
  const inlineDimensions = notes.match(/\b(\d{2}(?:\.\d+)?)\s*(?:["″]|in\b|inches\b)\s*waist\s*[-,;]\s*(\d{2}(?:\.\d+)?)\s*(?:["″]|in\b|inches\b)\s*inseam\b/i);
  if (inlineDimensions) return { size: `${Number(inlineDimensions[1])}x${Number(inlineDimensions[2])}`, sizeBasis: "measured" };
  const fitDimensions = pantsSizeTokens(fitSize ?? "").filter((size) => size.includes("x"));
  if (fitDimensions.length) return { size: fitDimensions.join(" / "), sizeBasis: "seller-fit" };
  const reported = reportedPantsFit(title);
  if (reported) return { size: reported, sizeBasis: "seller-fit" };
  const variant = pantsSizeTokens(option).filter((size) => size.includes("x"));
  if (variant.length) return { size: variant.join(" / "), sizeBasis: "tag" };
  const dimensions = pantsSizeTokens(title).filter((size) => size.includes("x"));
  if (dimensions.length) return { size: dimensions.join(" / "), sizeBasis: "seller-fit" };
  const tagged = pantsSizeTokens(taggedSize ?? "").filter((size) => size.includes("x")).join(" / ");
  if (tagged) return { size: tagged, sizeBasis: "tag" };
  const optionSize = shirtSizeTokens(option).join(" / ");
  return optionSize ? { size: optionSize, sizeBasis: "seller-fit" } : {};
}

export function isSturdyShopGarment(title: string, notes: string, kind: "shirt" | "pants") {
  if (shopExcluded.test(title) || newerThanPreferred.test(title) || newerThanPreferred.test(notes)) return false;
  if (structuralDamage.test(notes.replace(damageDenial, ""))) return false;
  if (kind === "pants" && lightweightPants.test(`${title} ${notes}`)) return false;
  const quality = vintageSignals({ title, description: notes });
  const workwear = (kind === "shirt" ? workShirtClues : workPantsClues).test(`${title} ${notes}`);
  return quality.build > 0 || (quality.build === 0 && workwear);
}

export async function searchVintageShop(shop: Shop, preferences: ScoutPreferences, keywords: string, { now }: Window, { tour = false, includePickupOnly = false } = {}): Promise<SourceResult> {
  const options: RequestInit = { cache: "no-store", signal: AbortSignal.timeout(9_000), redirect: "error" };
  const collections = preferences.department === "women" && "womensCollections" in shop ? shop.womensCollections : shop.collections;
  const pages = await Promise.allSettled(collections.map(async (collection) => {
    const loadPage = async (page: number) => {
      const response = await fetch(`${shop.origin}/collections/${collection}/products.json?limit=${shopPageSize}&page=${page}`, options);
      if (!response.ok) throw new Error(`Shop collection status ${response.status}`);
      const { products } = await response.json() as { products?: ShopProduct[] };
      if (!Array.isArray(products)) throw new Error("Invalid shop collection response");
      return products;
    };
    const first = await loadPage(1);
    const second = first.length === shopPageSize ? await loadPage(2).catch(() => null) : [];
    return { products: [...first, ...(second ?? [])], complete: second !== null };
  }));
  const catalogs = pages.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  if (!catalogs.length) return { status: "unavailable", listings: [] };

  const words = (value: string) => value.toLowerCase().replace(/[.']/g, "");
  const terms = (words(keywords).match(/[a-z0-9]+/g) ?? [])
    .filter((word) => !/^(?:shirts?|pants?|trousers?|jeans?|vintage)$/.test(word));
  const kindRequested = classifyGarment({ title: keywords });
  const host = new URL(shop.origin).hostname;
  const listings = new Map<string, LiveListing>();
  for (const { products } of catalogs) {
    for (const product of products) {
      if (!Number.isSafeInteger(product.id) || !product.handle || !/^[\w-]+$/.test(product.handle)) continue;
      const externalId = String(product.id);
      if (listings.has(externalId) || !product.published_at || !isFresh(product.published_at, { start: 0, now })) continue;
      const title = plainText(product.title);
      if (!title || (!tour && shopExcluded.test(title)) || newerThanPreferred.test(title)) continue;
      const rawType = product.product_type?.trim() ?? "";
      const inferred = tour ? "shirt" : classifyGarment({ title });
      const garmentKind = inferred !== "unknown" ? inferred
        : /^(?:button ups?|shirts?)$/i.test(rawType) ? "shirt" : "unknown";
      if (garmentKind === "unknown" || (preferences.department !== "women" && garmentKind !== "shirt" && garmentKind !== "pants")) continue;
      if (kindRequested !== "unknown" && kindRequested !== garmentKind) continue;

      const optionPosition = (name: RegExp) => product.options?.find((option) => name.test(option.name ?? ""))?.position ?? 0;
      const waistPosition = optionPosition(/^waist$/i);
      const inseamPosition = optionPosition(/^(?:inseam|length)$/i);
      const optionValue = (variant: NonNullable<ShopProduct["variants"]>[number], position: number) =>
        [variant.option1, variant.option2, variant.option3][position - 1]?.trim() ?? "";
      const notes = shopSellerNotes(product.body_html);
      const pickupOnly = isGoodwillPickupOnly(shop.source, [title, product.tags, plainText(product.body_html)].flat().join(" "));
      if (pickupOnly && !includePickupOnly) continue;
      if (tour && !isPeriodTourShirt(title, notes)) continue;
      const variant = product.variants?.find((value) => {
        if (!value.available) return false;
        if (garmentKind !== "pants" || !waistPosition || !inseamPosition) return true;
        const size = `${optionValue(value, waistPosition)}x${optionValue(value, inseamPosition)}`;
        return matchesScoutFit({ title: size, size, garmentKind }, preferences);
      });
      if (!variant) continue;
      const labeledColor = notes.match(/^colou?r\s*:\s*([^\n.]{2,35})$/im)?.[1] || optionValue(variant, optionPosition(/^colou?r$/i));
      const variantSize = waistPosition && inseamPosition
        ? `${optionValue(variant, waistPosition)}x${optionValue(variant, inseamPosition)}`
        : "";
      const detected = shopSize(title, notes, optionValue(variant, optionPosition(/^size$/i)), garmentKind === "pants" || garmentKind === "skirt" ? "pants" : "shirt");
      const size = detected.sizeBasis === "measured" ? detected.size : variantSize || detected.size;
      const sizeBasis = size === detected.size ? detected.sizeBasis : "tag";
      if (!matchesScoutFit({ title, size, garmentKind }, preferences)) continue;
      const description = [notes, inferred === "unknown" ? "Garment type: shirt." : ""].filter(Boolean).join("\n");
      if (!terms.every((term) => words(`${title} ${description} ${labeledColor ?? ""}`).includes(term))) continue;
      if (tour) {
        if (vintageSignals({title, description}).build < 0) continue;
      } else if (garmentKind === "shirt" || garmentKind === "pants") {
        if (!isSturdyShopGarment(title, description, garmentKind)) continue;
      } else if (vintageSignals({title, description}).build < 0) continue;
      const price = variant.price && /^\d{1,6}(?:\.\d{1,2})?$/.test(variant.price) ? Math.round(Number(variant.price) * 100) : null;
      const budget = garmentKind === "pants" || garmentKind === "skirt" ? preferences.pantsBudget : preferences.shirtBudget;
      if (price == null || (budget != null && price > Math.round(budget * 100))) continue;
      const [imageUrl, ...imageUrls] = (product.images ?? []).flatMap((image) => httpsImage(image.src, "cdn.shopify.com", host) ?? []).slice(0, 8);
      if (!imageUrl) continue;
      const condition = notes.match(/^(?:condition|flaws)\s*:\s*(.+)$/im)?.[1]
        ?? notes.match(/^pre[- ]owned\s*[-–:]\s*(.+)$/im)?.[1];
      listings.set(externalId, {
        source: shop.source, externalId, title, description: tour ? ["Garment type: shirt. Tour or era is seller-described. Check tag and print photographs.", description].join("\n") : description, imageUrl, imageUrls, size, sizeBasis, condition, color: labeledColor || undefined,
        listedAt: new Date(product.published_at).toISOString(), priceCents: price, pickupOnly: pickupOnly || undefined,
        url: `${shop.origin}/products/${product.handle}${variantSize && Number.isSafeInteger(variant.id) ? `?variant=${variant.id}` : ""}`,
      });
    }
  }
  const status = catalogs.length === pages.length && catalogs.every((catalog) => catalog.complete) ? "searched" : "partial";
  return { status, listings: Array.from(listings.values()) };
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
    : [["shirt", "cotton work shirt"], ["shirt", "chamois shirt"], ["shirt", "lined shirt jacket"], ["pants", "carpenter work pants"], ["pants", "denim jeans"]];
  const querySet = new Set(lanes.flatMap(([kind, phrase]) => {
    const sizes = kind === "pants" ? preferences.pantsSizes : preferences.shirtSizes;
    // Broad searches catch alternate sizing language. A focused search gives the priority size its own result page.
    return sizes[0] ? [phrase, `${phrase} ${sizes[0]}`] : [phrase];
  }));
  const settled = await Promise.allSettled(Array.from(querySet, async (keywords) => {
    const params = new URLSearchParams({ keywords, sort_on: "score", limit: "50", currency: "USD", buyer_country: "US" });
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
    const [imageUrl, ...imageUrls] = (results ?? []).toSorted((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
      .flatMap((photo) => httpsImage(photo.url_fullxfull, "etsystatic.com") ?? []).slice(0, 8);
    if (!imageUrl) return null;
    const { amount, divisor, currency_code } = item.price ?? {};
    const priceCents = currency_code === "USD" && typeof amount === "number" && amount >= 0 && typeof divisor === "number" && divisor > 0
      ? Math.round(amount / divisor * 100) : null;
    return { source: "etsy", externalId: String(item.listing_id), url: `https://www.etsy.com/listing/${item.listing_id}`, title,
      description, imageUrl, imageUrls, listedAt, priceCents };
  }, status);
}
