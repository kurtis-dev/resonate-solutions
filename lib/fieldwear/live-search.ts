import { classifyGarment, scoreListing } from "./listing-model";
import { departmentMatch, fitPriority, matchesScoutFit, pantsSizeTokens, shirtSizeTokens, type CatalogProfile, type ScoutPreferences } from "./preferences";
import { scoutDatabase } from "./owner-access";
import { isSturdyShopGarment, searchEtsy, searchVintageShop, shopSize, type LiveListing, type SourceResult } from "./inventory-sources";
import { isVintageShop, vintageShops } from "./marketplace-directory";
import { vintageSignals } from "./vintage-signals";
import { matchLook, type LookHunt, type LookProfile } from "./look-search";

const day = 86_400_000;
const ebay = "https://api.ebay.com";
const excluded = /\b(?:reproduction|replica|vintage[- ]style|print.on.demand|dry rot|sewing pattern|digital download|graphic tee|t-?shirt)\b/i;
const workwearTypes = ["shirt", "pants"] as const;
const womenTypes = [...workwearTypes, "outerwear", "dress", "skirt"] as const;
const garmentTypes = (preferences: ScoutPreferences) => preferences.department === "women" ? womenTypes : workwearTypes;

type SearchResult = {
  searchedAt: string;
  keywords: string;
  hunt?: LookHunt;
  status: "ok" | "partial" | "unavailable" | "unconfigured";
  listings: LiveListing[];
  coverage?: { source: string; status: SourceResult["status"] }[];
};

type EbayMoney = { value?: string; currency?: string };
type EbayItem = {
  itemId?: string;
  legacyItemId?: string;
  itemWebUrl?: string;
  itemCreationDate?: string;
  itemOriginDate?: string;
  itemEndDate?: string;
  title?: string;
  image?: { imageUrl?: string };
  additionalImages?: { imageUrl?: string }[];
  price?: EbayMoney;
  currentBidPrice?: EbayMoney;
  buyingOptions?: string[];
  shippingOptions?: { shippingCost?: EbayMoney }[];
  condition?: string;
  shortDescription?: string;
  localizedAspects?: { name?: string; value?: string }[];
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

function buildQueries(preferences: ScoutPreferences, keywords: string, hunt?: LookHunt) {
  const department = { any: "", men: "mens", women: "womens", unisex: "unisex" }[preferences.department];
  const sizeTerms = (sizes: string[]) => {
    const aliases = sizes.flatMap((size) => size === "XLT" ? ["XLT", "TXL", '"XL Tall"'] : size === "2XL" ? ["2XL", "XXL"] : [size]);
    return aliases.length > 1 ? `(${aliases.join(",")})` : aliases[0] ?? "";
  };
  const shirt = sizeTerms(preferences.shirtSizes);
  const pants = sizeTerms(preferences.pantsSizes);
  const customKind = classifyGarment({ title: keywords });
  const womenswear = preferences.department === "women";
  const sizesFor = (kind: string) => kind === "pants" || kind === "skirt" ? pants : shirt;
  const lanes = hunt ? hunt.queries.map((query) => [hunt.kind === "shirt" ? shirt : pants, query]) : keywords
    ? (customKind !== "unknown" ? [[sizesFor(customKind), keywords]] : [[shirt, `${keywords} shirt`], [pants, `${keywords} pants`], ...(womenswear ? [[shirt, `${keywords} dress`], [pants, `${keywords} skirt`], [shirt, `${keywords} jacket`]] : [])])
    : womenswear ? [
      [shirt, "cotton chambray pearl snap shirt"], [shirt, "Pendleton wool plaid shirt"], [shirt, "cotton embroidered blouse"],
      [shirt, "wool cardigan 1990s"], [shirt, "chore canvas jacket"], [shirt, "denim trucker jacket 1990s"],
      [pants, "high rise straight denim jeans"], [pants, "double knee canvas carpenter pants"], [pants, "wool pleated trousers"],
      [shirt, "(Laura Ashley,Pendleton,Eddie Bauer) cotton button front dress"], [shirt, "cotton denim shirt dress 1990s"],
      [pants, "wool tartan skirt 1990s"], [pants, "cotton denim midi skirt"],
    ]
    : [
      [shirt, "cotton work shirt"], [shirt, "chamois shirt"], [shirt, "flannel lined shirt jacket"], [shirt, "wool work shirt"],
      [shirt, "chambray work shirt"], [shirt, '("Big Mac","Big Yank",Fieldmaster,Hercules) shirt'],
      [shirt, '("union made","made in usa",ACTWU) work shirt'],
      [pants, "canvas carpenter pants"], [pants, "straight denim jeans"], [pants, "wool trousers"],
      [pants, "(Carhartt,Dickies,Wrangler) double knee work pants"], [pants, "(Ben Davis,Red Kap,Big Smith) work pants"],
      [pants, '("Key Imperial","Round House","Stan Ray") pants'], [pants, '("OG-107","cotton sateen") fatigue pants'],
      [pants, '("union made","made in usa",ACTWU) work pants'], [pants, '(1980s,1990s,80s,90s) jeans'],
    ];
  const sized = Array.from(new Set(lanes.map(([sizes, garment]) => [department, sizes, garment].filter(Boolean).join(" "))));
  // Some sellers leave size out of the title. Probe a bounded set and admit only saved-size matches.
  const broader = hunt ? [] : keywords
    ? lanes.filter(([sizes]) => Boolean(sizes)).map(([, garment]) => garment)
    : [...(shirt ? ["cotton canvas button up work shirt", "denim flannel lined shirt jacket"] : []),
      ...(pants ? ["double knee duck canvas work pants"] : [])];
  return [
    ...sized.map((q) => ({ q, verifySize: false })),
    ...Array.from(new Set(broader.map((phrase) => [department, phrase].filter(Boolean).join(" "))))
      .filter((q) => !sized.includes(q)).map((q) => ({ q, verifySize: true })),
  ];
}

function moneyCents(price?: EbayMoney) {
  if (!price?.value || price.currency !== "USD") return null;
  const value = Number(price.value);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : null;
}

function ebayGallery(item: EbayItem) {
  return (item.additionalImages ?? []).flatMap(({ imageUrl }) => imageUrl && /^https:\/\/(?:[\w-]+\.)*ebayimg\.com\//i.test(imageUrl) ? [imageUrl] : []).slice(0, 7);
}

function mapItem(item: EbayItem, now: number): LiveListing | null {
  const listedAt = item.itemOriginDate ?? item.itemCreationDate;
  if (item.itemEndDate && Date.parse(item.itemEndDate) <= now) return null;
  const url = item.itemWebUrl?.match(/^https:\/\/(?:www\.)?ebay\.com\/itm\/(?:[^/?#]+\/)?(\d+)(?:[/?#]|$)/i);
  const id = item.legacyItemId ?? url?.[1];
  const imageUrl = item.image?.imageUrl;
  if (!url || id !== url[1] || !imageUrl || !/^https:\/\/(?:[\w-]+\.)*ebayimg\.com\//i.test(imageUrl) || !item.title) return null;
  const description = item.shortDescription?.replace(/<[^>]*>/g, " ").slice(0, 1000);
  const garment = classifyGarment({ title: item.title });
  const sizes = (garment === "pants" ? pantsSizeTokens : shirtSizeTokens)(item.title.replace(/\b(?:[a-z]\.){2,}|\b[LS]\/[LS]\b/gi, ""));
  const fit = garment === "pants" ? shopSize(item.title, description ?? "", "", "pants") : {};
  const auction = item.buyingOptions?.includes("AUCTION") && !item.buyingOptions.includes("FIXED_PRICE");
  return {
    source: "ebay", externalId: id, title: item.title, imageUrl, imageUrls: ebayGallery(item), listedAt: listedAt && Number.isFinite(Date.parse(listedAt)) ? listedAt : new Date(now).toISOString(), endsAt: item.itemEndDate,
    url: `https://www.ebay.com/itm/${id}`, description, condition: item.condition, size: fit.size ?? (sizes.join(" / ") || undefined), sizeBasis: fit.sizeBasis,
    priceCents: moneyCents(auction ? item.currentBidPrice ?? item.price : item.price ?? item.currentBidPrice),
    priceKind: auction || (!item.price && item.currentBidPrice) ? "bid" : undefined,
    shippingCents: moneyCents(item.shippingOptions?.[0]?.shippingCost),
  };
}

async function searchEbay(preferences: ScoutPreferences, keywords: string, { now }: { now: number }, hunt?: LookHunt): Promise<SourceResult> {
  const client = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;
  if (!client || !secret) return { status: "needs-access", listings: [] };
  const token = await ebayToken(client, secret);
  const queries = buildQueries(preferences, keywords, hunt);
  const settled = await Promise.allSettled(queries.map(async ({ q, verifySize }) => {
    const fetchPage = async (offset: number) => {
      const params = new URLSearchParams({
        q, limit: verifySize ? "30" : "100", offset: String(offset),
        filter: [
          "conditions:{USED}",
          `buyingOptions:{${hunt ? "FIXED_PRICE" : "FIXED_PRICE|AUCTION"}}`,
          classifyGarment({ title: q }) === "pants" && preferences.pantsBudget != null
            ? `price:[0..${preferences.pantsBudget}],priceCurrency:USD` : "",
        ].filter(Boolean).join(","),
      });
      const response = await fetch(`${ebay}/buy/browse/v1/item_summary/search?${params}`, {
        headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" },
        cache: "no-store", signal: AbortSignal.timeout(offset === 0 ? 7000 : 4000),
      });
      if (!response.ok) throw new Error(`eBay search status ${response.status}`);
      return response.json() as Promise<{ itemSummaries?: EbayItem[]; next?: string }>;
    };
    const first = await fetchPage(0);
    const second = first.next && !verifySize ? await fetchPage(100).catch(() => null) : undefined;
    const third = !hunt && second?.next ? await fetchPage(200).catch(() => null) : undefined;
    const hits = [...(first.itemSummaries ?? []), ...(second?.itemSummaries ?? []), ...(third?.itemSummaries ?? [])].flatMap((item) => {
      const listing = mapItem(item, now);
      return listing ? [{ listing, itemId: item.itemId, verifySize }] : [];
    });
    return { hits, partial: second === null || third === null };
  }));
  const hits = new Map<string, { listing: LiveListing; itemId?: string; verifySize: boolean }>();
  let succeeded = 0;
  let incomplete = false;
  for (const outcome of settled) {
    if (outcome.status !== "fulfilled") continue;
    succeeded++;
    incomplete ||= outcome.value.partial;
    for (const hit of outcome.value.hits) if (!hits.has(hit.listing.externalId)) hits.set(hit.listing.externalId, hit);
  }
  const candidates = Array.from(hits.values());
  const detailTargets = (hunt ? [hunt.kind] : garmentTypes(preferences)).flatMap((kind) => {
    const rankedHits = candidates
    .filter(({ listing, itemId }) => itemId && !excluded.test(listing.title) && classifyGarment(hunt ? { title: listing.title, size: listing.size } : listing) === kind &&
      withinBudget(listing, kind, preferences))
    .map((hit) => ({ hit, look: hunt ? probeRank(hit.listing, hunt) : 0, ...listingRank(hit.listing, preferences) }))
    .sort((a, b) => b.look - a.look || compareQuality(a, b))
    .map(({ hit }) => hit);
    const matching = rankedHits.filter(({ listing }) => matchesScoutFit({ ...listing, garmentKind: kind }, preferences));
    if (hunt?.profile !== "browning") return [
      ...matching.filter((hit) => !hit.verifySize).slice(0, hunt ? 24 : 10),
      ...rankedHits.filter((hit) => hit.verifySize && (!hit.listing.size || matchesScoutFit({ ...hit.listing, garmentKind: kind }, preferences))).slice(0, 6),
    ];
    const isBrowning = ({ listing }: (typeof rankedHits)[number]) => /\bbrowning\b/i.test(listing.title);
    return [
      ...matching.filter(isBrowning).slice(0, 14),
      ...matching.filter((hit) => !isBrowning(hit)).slice(0, 14),
    ];
  });
  // Details are optional so a slow single-item endpoint cannot stop the catalog.
  await Promise.allSettled(detailTargets.map(async (hit) => {
    const response = await fetch(`${ebay}/buy/browse/v1/item/${encodeURIComponent(hit.itemId!)}`, {
      headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" },
      cache: "no-store", signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return;
    const detail = await response.json() as EbayItem & { description?: string };
    if (detail.image?.imageUrl && /^https:\/\/(?:[\w-]+\.)*ebayimg\.com\//i.test(detail.image.imageUrl)) {
      hit.listing.imageUrl = detail.image.imageUrl;
    }
    const gallery = ebayGallery(detail);
    if (gallery.length) hit.listing.imageUrls = gallery;
    const facts = detail.localizedAspects ?? [];
    hit.listing.color = facts.find(({ name }) => /^colou?r$/i.test(name ?? ""))?.value?.trim() || undefined;
    if (hunt || hit.verifySize) {
      const size = facts.find(({ name }) => /^size$/i.test(name ?? ""))?.value;
      const kind = hunt?.kind ?? classifyGarment(hit.listing);
      const waist = facts.find(({ name }) => /^waist size$/i.test(name ?? ""))?.value?.match(/^\s*(\d{2}(?:\.\d+)?)(?:\s*(?:in\.?|inches|"))?\s*$/i)?.[1];
      const inseam = facts.find(({ name }) => /^inseam$/i.test(name ?? ""))?.value?.match(/^\s*(\d{2}(?:\.\d+)?)(?:\s*(?:in\.?|inches|"))?\s*$/i)?.[1];
      const sizes = kind === "pants"
        ? waist && inseam ? [`${waist}x${inseam}`] : pantsSizeTokens(size ?? "").filter((value) => value.includes("x"))
        : shirtSizeTokens(size ?? "");
      if (sizes.length) {
        hit.listing.size = sizes.join(" / ");
      }
    }
    const labeled = facts.filter(({ name, value }) => value && /^(?:material|fabric type|decade|year manufactured|country of origin|inseam|chest size|waist size)$/i.test(name ?? ""))
      .map(({ name, value }) => `${name}: ${/^inseam$/i.test(name ?? "") && /^\d{2}(?:\.\d+)?$/.test(value ?? "") ? `${value} in` : value}`);
    const description = detail.description?.replace(/<\/?(?:p|div|li|tr|br)\b[^>]*>/gi, "\n").replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ").replace(/&quot;|&#34;/gi, '"').trim().slice(0, 4200);
    hit.listing.description = [description || hit.listing.description, ...labeled].filter(Boolean).join("\n");
    if (classifyGarment(hit.listing) === "pants") {
      const fit = shopSize(hit.listing.title, description ?? "", "", "pants");
      if (fit.size && (fit.sizeBasis === "measured" || !hit.listing.size)) Object.assign(hit.listing, fit);
    }
  }));
  const listings = candidates.filter(({ listing, verifySize }) => !verifySize ||
    matchesScoutFit({ ...listing, garmentKind: classifyGarment(listing) }, preferences)).map(({ listing }) => listing);
  return { status: succeeded === queries.length && !incomplete ? "searched" : succeeded ? "partial" : "unavailable", listings };
}

function probeRank(listing: LiveListing, hunt: LookHunt) {
  const text = listing.title;
  if (hunt.profile === "browning" && /\bbrowning\b/i.test(text) && !/\bbuck suede\b/i.test(text)) {
    return /\b(?:elbow|leather|suede|patch)\b/i.test(text) ? 150 : 105;
  }
  return matchLook(listing, hunt)?.rank ?? 0;
}

function withinBudget(listing: LiveListing, kind: string, preferences: ScoutPreferences) {
  const budget = kind === "pants" || kind === "skirt" ? preferences.pantsBudget : preferences.shirtBudget;
  return budget == null || listing.priceCents == null || listing.priceCents + (listing.shippingCents ?? 0) <= Math.round(budget * 100);
}

function listingRank(listing: LiveListing, preferences: ScoutPreferences) {
  const signals = vintageSignals(listing);
  return {
    fit: fitPriority({ ...listing, garmentKind: classifyGarment(listing) }, preferences),
    quality: signals.period * 17 + signals.build * 14 + scoreListing(listing, preferences).tasteMatch / 4,
    listing,
  };
}

function compareQuality(a: ReturnType<typeof listingRank>, b: ReturnType<typeof listingRank>) {
  return b.fit - a.fit || b.quality - a.quality || (a.listing.priceCents ?? Infinity) - (b.listing.priceCents ?? Infinity);
}

export async function searchNewListings(preferences: ScoutPreferences, keywords: string, hunt?: LookHunt): Promise<SearchResult> {
  const now = Date.now();
  const window = { now, start: 0 };
  const otherKeywords = hunt ? (hunt.profile === "browning" ? "suede elbow shirt" : hunt.traits.slice(0, 2).join(" ")) : keywords;
  const requests = [
    { source: "ebay", run: searchEbay(preferences, keywords, window, hunt) },
    { source: "etsy", run: searchEtsy(preferences, otherKeywords, window) },
    ...vintageShops.map((shop) => ({ source: shop.source, run: searchVintageShop(shop, preferences, otherKeywords, window) })),
  ];
  const results = await Promise.all(requests.map(async ({ source, run }) => {
    const result = await run.catch((): SourceResult => ({ status: "unavailable", listings: [] }));
    return { source, ...result };
  }));
  const kinds: readonly string[] = garmentTypes(preferences);
  const ranked = results.flatMap(({ listings }) => listings).flatMap((listing) => {
    if (excluded.test(listing.title)) return [];
    const garmentKind = hunt ? classifyGarment({ title: listing.title, size: listing.size }) : classifyGarment(listing);
    const fit = { ...listing, garmentKind };
    if (!kinds.includes(garmentKind) || !departmentMatch(fit, preferences.department)) return [];
    if (preferences.department === "women" && departmentMatch(fit, "women") < 2 && departmentMatch(fit, "unisex") < 2) return [];
    if ((hunt || preferences.matchingOnly || garmentKind === "pants") && !matchesScoutFit(fit, preferences)) return [];
    if (!withinBudget(listing, garmentKind, preferences)) return [];
    if ((garmentKind === "pants" || garmentKind === "skirt") && preferences.pantsBudget != null && listing.priceCents == null) return [];
    if (!hunt && garmentKind === "pants" && !isSturdyShopGarment(listing.title, listing.description ?? "", "pants")) return [];
    if (!hunt && preferences.department === "women") {
      const signals = vintageSignals(listing);
      if (signals.build < 0 || (garmentKind !== "pants" && signals.period <= 0 && signals.build <= 0)) return [];
    }
    const look = hunt ? matchLook(listing, hunt) : undefined;
    if (hunt && (garmentKind !== hunt.kind || !look || listing.priceCents == null)) return [];
    return [{ ...listingRank(listing, preferences), garmentKind, look: look?.rank ?? 0 }];
  }).sort((a, b) => b.look - a.look || compareQuality(a, b));
  const listings = hunt ? ranked.slice(0, 24).map(({ listing }) => listing) : kinds.flatMap((kind) => {
    const candidates = ranked.filter((item) => item.garmentKind === kind);
    const marketplace = candidates.filter(({ listing }) => !isVintageShop(listing.source));
    const represented = results.flatMap(({ source }) => marketplace.filter(({ listing }) => listing.source === source).slice(0, 2));
    const shopListings = vintageShops.flatMap(({ source }) => candidates.filter(({ listing }) => listing.source === source).slice(0, 48));
    const included = new Set([...Array.from(new Set([...represented, ...marketplace])).slice(0, kind === "pants" ? 360 : 120), ...shopListings]);
    return candidates.filter((item) => included.has(item)).map(({ listing }) => listing);
  });
  const succeeded = results.some(({ status }) => status === "searched" || status === "partial");
  const status = succeeded ? (results.some(({ status }) => status === "unavailable" || status === "partial") ? "partial" : "ok") : "unavailable";
  const coverage: NonNullable<SearchResult["coverage"]> = [
    ...results.map(({ source, status }) => ({ source, status })),
    ...["grailed", "mercari", "depop", "poshmark", "vinted", "shopgoodwill", "carharttreworked", "geartrade", "salvationarmy", "wornwear"].map((source) => ({ source, status: "no-feed" as const })),
  ];
  return { searchedAt: new Date(now).toISOString(), keywords, hunt, status, listings, coverage };
}

type SearchScope = LookProfile | "owner" | "daily";
const searchKey = (scope: SearchScope, profile: CatalogProfile) => profile === "women" ? `women:${scope}` : scope;

export async function runAndStoreLiveSearch(preferences: ScoutPreferences, keywords: string, hunt?: LookHunt, profile: CatalogProfile = "owner", daily = false) {
  const result = await searchNewListings(preferences, keywords, hunt);
  if (daily && (!result.listings.length || result.status === "unavailable")) return { count: 0, status: result.status };
  if (daily) {
    const previous = await readLiveSearch(undefined, "daily", profile);
    const key = (item: LiveListing) => `${item.source}:${item.externalId}`;
    const known = new Set(previous?.listings.map(key));
    result.listings.sort((a, b) => Number(known.has(key(a))) - Number(known.has(key(b))));
  }
  const sql = await scoutDatabase();
  await sql`INSERT INTO fieldwear_live_search (profile, settings, searched_at, result)
    VALUES (${searchKey(daily ? "daily" : hunt?.profile ?? "owner", profile)}, ${JSON.stringify(preferences)}::jsonb, ${result.searchedAt}::timestamptz, ${JSON.stringify(result)}::jsonb)
    ON CONFLICT (profile) DO UPDATE SET settings = EXCLUDED.settings, searched_at = EXCLUDED.searched_at, result = EXCLUDED.result
    WHERE fieldwear_live_search.searched_at <= EXCLUDED.searched_at`;
  return { count: result.listings.length, status: result.status };
}

export async function readLiveSearch(preferences?: ScoutPreferences, scope: SearchScope = "owner", profile: CatalogProfile = "owner") {
  const key = searchKey(scope, profile);
  const sql = await scoutDatabase();
  const [row] = preferences
    ? await sql`SELECT result FROM fieldwear_live_search WHERE profile = ${key} AND settings = ${JSON.stringify(preferences)}::jsonb` as { result: SearchResult }[]
    : await sql`SELECT result FROM fieldwear_live_search WHERE profile = ${key}` as { result: SearchResult }[];
  if (!row) return null;
  const now = Date.now();
  const expired = Date.parse(row.result.searchedAt) < now - (scope === "daily" ? day * 2 : day / 4);
  return {
    ...row.result, expired,
    listings: expired ? [] : row.result.listings.filter((item) => !item.endsAt || !(Date.parse(item.endsAt) <= now)),
  };
}
