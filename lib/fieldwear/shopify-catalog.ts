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
      const photo = safeUrl((variant.media ?? product.media)?.find((media) => media.type === "image")?.url);
      if (!photo || photo.hostname !== "cdn.shopify.com") continue;
      const option = (name: RegExp) => variant.options?.find((value) => name.test(value.name))?.label ?? "";
      const fit = shopSize(normalizeSize(title), description, normalizeSize(option(/^size$/i)), "pants");
      if (!fit.size?.includes("x") || !matchesScoutFit({ title, size: fit.size, garmentKind: "pants" }, preferences)) continue;
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
  const sizes = preferences.pantsSizes.slice(0, 6).join(" ");
  const terms = keywords.replace(/\bvintage\b/gi, "").trim();
  const lanes = terms ? [terms + " work pants"] : [
    "duck canvas carpenter work pants",
    "double knee heavy cotton work pants",
    "straight heavyweight denim work jeans",
  ];
  const checkedAt = Date.now();
  const results = await Promise.allSettled(lanes.map(async (lane) => {
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "tools/call",
        params: { name: "search_catalog", arguments: {
          meta: { "ucp-agent": { profile } },
          catalog: {
            query: `${preferences.department === "any" ? "" : preferences.department === "unisex" ? "unisex " : preferences.department + "'s "}used ${lane} ${sizes}`, view: "compact", limit: 10, context: { address_country: "US" },
            filters: {
              ships_to: { country: "US" }, condition: ["secondhand"], available: true,
              ...(preferences.pantsBudget == null ? {} : { price: { max: Math.round(preferences.pantsBudget * 100) } }),
            },
          },
        } },
      }),
    });
    if (!response.ok) throw new Error(`Shopify HTTP ${response.status}`);
    const body = await response.json() as { result?: { structuredContent?: { products?: CatalogProduct[] } } };
    const products = body.result?.structuredContent?.products;
    if (!Array.isArray(products)) throw new Error("Missing Shopify catalog response");
    return products;
  }));
  const products = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const status = results.every((result) => result.status === "rejected") ? "unavailable"
    : results.some((result) => result.status === "rejected") ? "partial" : "searched";
  return { status, listings: catalogListings(products, preferences), checkedAt, expiresAt: checkedAt + ageLimit };
}
