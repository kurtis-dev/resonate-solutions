import { isSturdyShopGarment, shopSellerNotes, shopSize } from "./inventory-sources";
import { classifyGarment, type GarmentKind, type ListingInput } from "./listing-model";
import { departmentMatch, matchesScoutFit, type ScoutPreferences } from "./preferences";
import { vintageSignals } from "./vintage-signals";
import { casualTopStyle, isQualityCasualTop } from "./casual-tops";

const endpoint = "https://catalog.shopify.com/api/ucp/mcp";
const profileUrl = "https://www.resonate.solutions/fieldwear/shopify-agent.json";
const ageLimit = 9 * 60 * 1000;
export type ShopifyGarmentScope = Exclude<GarmentKind, "unknown"> | "all";
const publicLanes: Record<ShopifyGarmentScope, string[]> = {
  all: ["heavy cotton pocket tee", "cotton lined work shirt", "duck canvas carpenter work pants", "heavy straight leg denim jeans",
    "wool chore jacket", "heavy wool cardigan sweater", "cotton denim button front dress", "wool tartan skirt"],
  shirt: ["plain cotton crew neck tee", "cotton V-neck tee", "single stitch pocket tee", "plain crewneck sweatshirt",
    "heavy cotton work shirt", "chamois shirt", "wool cardigan sweater", "cotton chambray blouse"],
  pants: ["duck canvas carpenter work pants", "double knee heavy cotton work pants", "straight heavyweight denim work jeans",
    "Carhartt Dickies carpenter work pants", "Wrangler Lee Riders Levi's 505 straight denim", "Key Imperial Round House Stan Ray painter pants",
    "Red Kap Ben Davis cotton twill work trousers", "cotton sateen utility fatigue pants", "Carhartt B11 B01 B136 cotton duck work pants"],
  outerwear: ["wool chore jacket", "denim trucker jacket", "heavy canvas work jacket"],
  dress: ["cotton denim dress", "cotton button front dress"],
  skirt: ["wool tartan skirt", "cotton denim midi skirt"],
};
type CatalogVariant = {
  id?: string;
  title?: string;
  url?: string;
  condition?: string[];
  availability?: { available?: boolean };
  price?: { currency?: string; amount?: number };
  seller?: { name?: string };
  options?: { name: string; label: string }[];
  media?: { type?: string; url?: string }[];
};
type CatalogProduct = {
  title?: string;
  description?: { plain?: string };
  media?: CatalogVariant["media"];
  variants?: CatalogVariant[];
};

function safeUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

function normalizeSize(value: string) {
  return value
    .replace(/\bW(\d{2})[-\s]+L(\d{2})\b/gi, "$1x$2")
    .replace(/\b(\d{2})\s*W[-\s]+(\d{2})\s*L\b/gi, "$1x$2");
}

function catalogListings(products: CatalogProduct[], preferences: ScoutPreferences, scope?: ShopifyGarmentScope) {
  const unique = new Map<string, ListingInput>();
  for (const product of products) {
    const title = product.title?.trim();
    const description = shopSellerNotes(product.description?.plain);
    if (!title) continue;
    const garmentKind = classifyGarment({ title, description });
    const womenswear = preferences.department === "women";
    if (garmentKind === "unknown" || (scope ? scope !== "all" && garmentKind !== scope : !womenswear && garmentKind !== "pants")) continue;
    if (womenswear && departmentMatch({ title, garmentKind }, "women") < 2 && departmentMatch({ title, garmentKind }, "unisex") < 2) continue;
    const quality = vintageSignals({ title, description });
    if (garmentKind === "pants" ? !isSturdyShopGarment(title, description, "pants") : (quality.build < 0 || (quality.build <= 0 && quality.period <= 0))) continue;
    if (scope && casualTopStyle(title) && !isQualityCasualTop({ title, description })) continue;
    const budget = garmentKind === "pants" || garmentKind === "skirt" ? preferences.pantsBudget : preferences.shirtBudget;
    if (/\b(?:select pair|assorted|mystery|bundle|lot of|nwt|deadstock|new with tags)\b/i.test(title)) continue;
    for (const variant of product.variants ?? []) {
      if (!variant.condition?.includes("secondhand") || variant.availability?.available !== true) continue;
      const price = variant.price?.amount;
      if (typeof price !== "number" || !Number.isSafeInteger(price) || price <= 0 || variant.price?.currency !== "USD"
        || (budget != null && price > budget * 100)) continue;
      const url = safeUrl(variant.url);
      const id = variant.id?.match(/^gid:\/\/shopify\/ProductVariant\/(\d+)$/)?.[1];
      if (!url || !id || !/\/products\/[^/]+\/?$/.test(url.pathname)) continue;
      // Brand-operated resale uses representative photos, so prefer exact-item listings in this shelf.
      if (["reworked.carhartt.com", "secondhand.levi.com", "wornwear.patagonia.com"].includes(url.hostname)) continue;
      // Global Catalog can still index products from this password-gated storefront.
      if (url.hostname.replace(/^www\./, "") === "badplaidthrift.com") continue;
      const [imageUrl, ...imageUrls] = (variant.media?.length ? variant.media : product.media ?? []).flatMap((media) => {
        const url = media.type === "image" ? safeUrl(media.url) : null;
        return url?.hostname === "cdn.shopify.com" ? [url.href] : [];
      }).slice(0, 8);
      if (!imageUrl) continue;
      const option = (name: RegExp) => variant.options?.find((value) => name.test(value.name))?.label ?? "";
      const fit = shopSize(normalizeSize(title), description, normalizeSize(option(/^size$/i)), garmentKind === "pants" || garmentKind === "skirt" ? "pants" : "shirt");
      if ((!scope && !womenswear && !fit.size?.includes("x")) || !matchesScoutFit({ title, size: fit.size, sizeBasis: fit.sizeBasis, garmentKind }, preferences)) continue;
      const seller = variant.seller?.name?.trim() || url.hostname.replace(/^www\./, "");
      const condition = description.match(/^(?:condition|flaws)\s*:\s*(.+)$/im)?.[1] || option(/^condition$/i) || "Secondhand";
      unique.set(url.hostname + url.pathname, {
        source: "shopifycatalog", externalId: id, title, description, size: fit.size, sizeBasis: fit.sizeBasis,
        imageUrl, imageUrls, url: url.href, priceCents: price, seller, condition,
        color: option(/^colou?r$/i) || description.match(/^colou?r\s*:\s*([^\n.]{2,35})$/im)?.[1],
      });
    }
  }
  return Array.from(unique.values()).sort((a, b) => {
    const left = vintageSignals(a);
    const right = vintageSignals(b);
    return right.period - left.period || right.build - left.build;
  });
}

export async function searchShopifyCatalog(preferences: ScoutPreferences, keywords: string, profile = profileUrl, scope?: ShopifyGarmentScope) {
  const sizes = (scope === "all" ? [] : scope && scope !== "pants" && scope !== "skirt" ? preferences.shirtSizes : preferences.pantsSizes).slice(0, 6);
  const department = { any: "", men: "men's", women: "women's", unisex: "unisex" }[preferences.department];
  const womenswear = preferences.department === "women";
  const terms = keywords.replace(/\bvintage\b/gi, "").trim();
  const lanes = scope ? (terms ? [terms, ...publicLanes[scope].slice(0, 3).map((lane) => `${terms} ${lane}`)] : publicLanes[scope])
    : terms ? [womenswear ? terms : terms + " work pants"] : womenswear ? [
    "cotton denim chore jacket", "wool Pendleton plaid skirt", "cotton denim shirt dress",
    "cotton chambray blouse", "wool cardigan 1990s", "high rise straight denim jeans", "duck canvas carpenter pants",
  ] : [
    "duck canvas carpenter work pants",
    "double knee heavy cotton work pants",
    "straight heavyweight denim work jeans",
    "Carhartt Dickies Dungarees carpenter work pants",
    "Wrangler 13MWZ Lee Riders Levi's 505 straight denim",
    "Key Imperial Big Smith Round House Stan Ray painter pants",
    "Red Kap Ben Davis cotton twill work trousers",
    "herringbone cotton sateen utility fatigue pants",
    "Carhartt B11 B01 B136 cotton duck work pants",
    "Dickies 1939 duck canvas heavyweight carpenter",
    "Wrangler Riggs reinforced carpenter cotton denim",
    "cotton work dungarees utility pants reinforced pockets",
  ];
  const priceCap = scope === "pants" || scope === "skirt" ? preferences.pantsBudget
    : scope === "all" ? null : scope ? preferences.shirtBudget : womenswear ? null : preferences.pantsBudget;
  const checkedAt = Date.now();
  const results = await Promise.allSettled(lanes.map(async (lane, index) => {
    const sizeWords = !scope && womenswear ? "" : scope ? sizes[index % sizes.length] ?? "" : index < 3 ? sizes.join(" ") : sizes[index % sizes.length] ?? "";
    const fetchPage = async (cursor?: string) => {
      const request: RequestInit = {
        method: "POST",
        cache: "no-store",
        headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1, method: "tools/call",
          params: { name: "search_catalog", arguments: {
            meta: { "ucp-agent": { profile } },
            catalog: {
              query: [department, "used", lane, sizeWords].filter(Boolean).join(" "), view: "compact",
              pagination: { limit: index < 3 ? 40 : 22, ...(cursor ? { cursor } : {}) }, context: { address_country: "US" },
              filters: {
                ships_to: { country: "US" }, condition: ["secondhand"], available: true,
                ...(priceCap == null ? {} : { price: { max: Math.round(priceCap * 100) } }),
              },
            },
          } },
        }),
      };
      const send = () => fetch(endpoint, { ...request, signal: AbortSignal.timeout(8_000) });
      let response = await send();
      if (response.status === 429) {
        const seconds = Number(response.headers.get("retry-after") ?? 1);
        if (seconds >= 0 && seconds <= 2) {
          await new Promise((resolve) => setTimeout(resolve, Math.max(1, seconds) * 1000));
          response = await send();
        }
      }
      if (!response.ok) throw new Error(`Shopify HTTP ${response.status}`);
      const body = await response.json() as { result?: { structuredContent?: { products?: CatalogProduct[]; pagination?: { cursor?: string; has_next_page?: boolean } } } };
      const products = body.result?.structuredContent?.products;
      if (!Array.isArray(products)) throw new Error("Missing Shopify catalog response");
      return { products, pagination: body.result?.structuredContent?.pagination };
    };
    const first = await fetchPage();
    const cursor = first.pagination?.has_next_page && first.pagination.cursor;
    const second = cursor && index < 3 ? await fetchPage(cursor).catch(() => null) : undefined;
    return { products: [...first.products, ...(second?.products ?? [])], partial: second === null };
  }));
  const products = results.flatMap((result) => result.status === "fulfilled" ? result.value.products : []);
  const status: "searched" | "partial" | "unavailable" = results.every((result) => result.status === "rejected") ? "unavailable"
    : results.some((result) => result.status === "rejected" || result.value.partial) ? "partial" : "searched";
  return { status, listings: catalogListings(products, preferences, scope), checkedAt, expiresAt: checkedAt + ageLimit };
}
