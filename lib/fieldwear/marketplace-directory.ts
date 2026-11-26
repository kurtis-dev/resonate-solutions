export const vintageShops = [
  { source: "dropspot", name: "Drop Spot Vintage", origin: "https://dropspotvintage.com", collections: ["mens-button-up-shirts", "mens-pants", "workwear"] },
  { source: "rebalance", name: "Rebalance Vintage", origin: "https://rebalancevintage.com", collections: ["button-up-shirts", "all-vintage-bottoms", "workwear"] },
  { source: "wyliewelling", name: "Wylie Welling", origin: "https://wyliewelling.com", collections: ["shirts", "all-live-pants", "shop-all"] },
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
