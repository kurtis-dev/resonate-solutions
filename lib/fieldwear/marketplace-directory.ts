// Public storefronts verified to publish their catalog prices in USD.
export const vintageShops = [
  { source: "dropspot", name: "Drop Spot Vintage", origin: "https://dropspotvintage.com", collections: ["mens-button-up-shirts", "mens-pants", "workwear"] },
  { source: "rebalance", name: "Rebalance Vintage", origin: "https://rebalancevintage.com", collections: ["button-up-shirts", "all-vintage-bottoms", "workwear"] },
  { source: "wyliewelling", name: "Wylie Welling", origin: "https://wyliewelling.com", collections: ["shirts", "all-live-pants", "shop-all"] },
  { source: "firstclass", name: "1STCLASS Vintage", origin: "https://1stclass-vintage.com", collections: ["carpenter", "pants", "denim", "wrangler-pants"] },
  { source: "secondtrail", name: "Second Trail Co.", origin: "https://secondtrailco.com", collections: ["mens-pants"] },
  { source: "fredgoodwill", name: "Rappahannock Goodwill", origin: "https://shop.fredgoodwill.org", collections: ["mens-bottoms", "carhartt-workwear", "workwear"] },
  { source: "cobblestore", name: "Cobblestore", origin: "https://cobblestore.com", collections: ["jeans", "vintage-pants", "sale"] },
  { source: "thriftmanguy", name: "Thrift Man Guy", origin: "https://thriftmanguy.com", collections: ["carhartt-pants", "carhartt-jeans", "levis-jeans", "jeans-pants", "workwear"] },
] as const;

export type VintageShopSource = (typeof vintageShops)[number]["source"];

export function marketplaceName(source: string) {
  if (source === "ebay") return "eBay";
  if (source === "shopgoodwill") return "ShopGoodwill";
  return vintageShops.find((shop) => shop.source === source)?.name
    ?? (source ? source[0].toUpperCase() + source.slice(1) : "Marketplace");
}

export function isVintageShop(source: string): source is VintageShopSource {
  return vintageShops.some((shop) => shop.source === source);
}

export function matchesMarketplace(source: string, filter: string) {
  return !filter || (filter === "shops" ? isVintageShop(source) : source === filter);
}
