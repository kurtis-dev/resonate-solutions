// Public storefronts verified to publish their catalog prices in USD.
export const vintageShops = [
  { source: "dropspot", name: "Drop Spot Vintage", origin: "https://dropspotvintage.com", collections: ["mens-button-up-shirts", "mens-pants", "workwear"] },
  { source: "rebalance", name: "Rebalance Vintage", origin: "https://rebalancevintage.com", collections: ["button-up-shirts", "all-vintage-bottoms", "workwear"], casualCollections: ["blank-tees", "ringer-tees", "blank-sweatshirts"] },
  { source: "wyliewelling", name: "Wylie Welling", origin: "https://wyliewelling.com", collections: ["shirts", "all-live-pants", "shop-all"] },
  { source: "firstclass", name: "1STCLASS Vintage", origin: "https://1stclass-vintage.com", collections: ["carpenter", "pants", "denim", "wrangler-pants"] },
  { source: "secondtrail", name: "Second Trail Co.", origin: "https://secondtrailco.com", collections: ["mens-pants"] },
  { source: "fredgoodwill", name: "Goodwill Rewards Marketplace", origin: "https://shop.fredgoodwill.org", collections: ["mens-bottoms", "carhartt-workwear", "workwear"], womensCollections: ["women", "womens-bottoms", "dresses"] },
  { source: "cobblestore", name: "Cobblestore", origin: "https://cobblestore.com", collections: ["jeans", "vintage-pants", "sale"] },
  { source: "thriftmanguy", name: "Thrift Man Guy", origin: "https://thriftmanguy.com", collections: ["carhartt-pants", "carhartt-jeans", "levis-jeans", "jeans-pants", "workwear"] },
  { source: "secondlife", name: "Second Life Vintage", origin: "https://secondlifevtg.com", collections: ["buttonupshirts", "denimpants"], womensCollections: ["womens"], casualCollections: ["blankessentials", "sweatshirtshoodies"] },
  { source: "distress", name: "Distress Vintage", origin: "https://www.distressvintage.com", collections: ["t-shirts"] },
] as const;

export function isGoodwillPickupOnly(source: string, listingText: string) {
  return source === "fredgoodwill" && /\b(?:pick[- ]?up[- ]only|local[- ]pick[- ]?up[- ]required|no shipping available|(?:cannot|can['’]t|does not) ship (?:this item|this product))\b/i.test(listingText);
}

export const tourShops = [
  { source: "rebalance", name: "Rebalance Vintage", origin: "https://rebalancevintage.com", collections: ["music-lovers", "tees"] },
  { source: "secondlife", name: "Second Life Vintage", origin: "https://secondlifevtg.com", collections: ["bandtees"] },
] as const;

export type VintageShopSource = (typeof vintageShops | typeof tourShops)[number]["source"];

export const marketplaceBrowse: Readonly<Record<string, { name: string; url: string }>> = {
  etsy: { name: "Etsy", url: "https://www.etsy.com/market/carhartt_work_pants" },
  grailed: { name: "Grailed", url: "https://www.grailed.com/browse/carhartt-work-pants" },
  mercari: { name: "Mercari", url: "https://www.mercari.com/us/shop/carhartt-work-pants/" },
  depop: { name: "Depop", url: "https://www.depop.com/search/?q=carhartt%20work%20pants" },
  poshmark: { name: "Poshmark", url: "https://poshmark.com/browse/mens-work-pants-carhartt" },
  vinted: { name: "Vinted", url: "https://www.vinted.com/catalog/583-pants/brand/362-carhartt" },
  shopgoodwill: { name: "ShopGoodwill", url: "https://shopgoodwill.com/" },
  carharttreworked: { name: "Carhartt Reworked", url: "https://reworked.carhartt.com/collections/mens-pants-jeans-shorts-loose-fit" },
  geartrade: { name: "Geartrade", url: "https://geartrade.com/" },
  salvationarmy: { name: "ShopTheSalvationArmy", url: "https://www.shopthesalvationarmy.com/Browse/C160719-C187090/" },
  wornwear: { name: "Patagonia Worn Wear", url: "https://wornwear.patagonia.com/" },
};

export function marketplaceName(source: string) {
  if (source === "shopifycatalog") return "Shopify Global Catalog";
  if (source === "ebay") return "eBay";
  if (marketplaceBrowse[source]) return marketplaceBrowse[source].name;
  return [...vintageShops, ...tourShops].find((shop) => shop.source === source)?.name
    ?? (source ? source[0].toUpperCase() + source.slice(1) : "Marketplace");
}

export function isVintageShop(source: string): source is VintageShopSource {
  return [...vintageShops, ...tourShops].some((shop) => shop.source === source);
}

export function matchesMarketplace(source: string, filter: string) {
  return !filter || (filter === "shops" ? isVintageShop(source) : source === filter);
}
