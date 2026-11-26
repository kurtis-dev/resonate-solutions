import { isSturdyShopGarment, shopSellerNotes, shopSize } from "./inventory-sources";
import { classifyGarment, type ListingInput } from "./listing-model";
import { matchesScoutFit, type ScoutPreferences } from "./preferences";
import { vintageSignals } from "./vintage-signals";

const endpoint = "https://catalog.shopify.com/api/ucp/mcp";
const profileUrl = "https://www.resonate.solutions/fieldwear/shopify-agent.json";
const ageLimit = 9 * 60 * 1000;
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

function catalogListings(products: CatalogProduct[], preferences: ScoutPreferences) {
  const unique = new Map<string, ListingInput>();
  for (const product of products) {
    const title = product.title?.trim();
    const description = shopSellerNotes(product.description?.plain);
    if (!title || classifyGarment({ title, description }) !== "pants" || !isSturdyShopGarment(title, description, "pants")) continue;
    if (/\b(?:select pair|assorted|mystery|bundle|lot of|nwt|deadstock|new with tags)\b/i.test(title)) continue;
    for (const variant of product.variants ?? []) {
      if (!variant.condition?.includes("secondhand") || variant.availability?.available !== true) continue;
      const price = variant.price?.amount;
      if (typeof price !== "number" || !Number.isSafeInteger(price) || price <= 0 || variant.price?.currency !== "USD"
        || (preferences.pantsBudget != null && price > preferences.pantsBudget * 100)) continue;
      const url = safeUrl(variant.url);
      const id = variant.id?.match(/^gid:\/\/shopify\/ProductVariant\/(\d+)$/)?.[1];
      if (!url || !id || !/\/products\/[^/]+\/?$/.test(url.pathname)) continue;
      // Brand-operated resale uses representative photos, so prefer exact-item listings in this shelf.
      if (["reworked.carhartt.com", "secondhand.levi.com", "wornwear.patagonia.com"].includes(url.hostname)) continue;
      // Global Catalog can still index products from this password-gated storefront.
      if (url.hostname.replace(/^www\./, "") === "badplaidthrift.com") continue;
      const photo = safeUrl((variant.media ?? product.media)?.find((media) => media.type === "image")?.url);
      if (!photo || photo.hostname !== "cdn.shopify.com") continue;
      const option = (name: RegExp) => variant.options?.find((value) => name.test(value.name))?.label ?? "";
      const fit = shopSize(normalizeSize(title), description, normalizeSize(option(/^size$/i)), "pants");
      if (!fit.size?.includes("x") || !matchesScoutFit({ title, size: fit.size, sizeBasis: fit.sizeBasis, garmentKind: "pants" }, preferences)) continue;
      const seller = variant.seller?.name?.trim() || url.hostname.replace(/^www\./, "");
      const condition = description.match(/^(?:condition|flaws)\s*:\s*(.+)$/im)?.[1] || option(/^condition$/i) || "Secondhand";
      unique.set(url.hostname + url.pathname, {
        source: "shopifycatalog", externalId: id, title, description, size: fit.size, sizeBasis: fit.sizeBasis,
        imageUrl: photo.href, url: url.href, priceCents: price, seller, condition,
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

export async function searchShopifyCatalog(preferences: ScoutPreferences, keywords: string, profile = profileUrl) {
  const sizes = preferences.pantsSizes.slice(0, 6);
  const department = { any: "", men: "men's", women: "women's", unisex: "unisex" }[preferences.department];
  const terms = keywords.replace(/\bvintage\b/gi, "").trim();
  const lanes = terms ? [terms + " work pants"] : [
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
  const checkedAt = Date.now();
  const results = await Promise.allSettled(lanes.map(async (lane, index) => {
    const sizeWords = index < 3 ? sizes.join(" ") : sizes[index % sizes.length] ?? "";
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
                ...(preferences.pantsBudget == null ? {} : { price: { max: Math.round(preferences.pantsBudget * 100) } }),
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
  return { status, listings: catalogListings(products, preferences), checkedAt, expiresAt: checkedAt + ageLimit };
}
