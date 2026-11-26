export const vintageShops = [
  { source: "dropspot", name: "Drop Spot Vintage", origin: "https://dropspotvintage.com", collection: "workwear" },
  { source: "rebalance", name: "Rebalance Vintage", origin: "https://rebalancevintage.com", collection: "workwear" },
  { source: "wyliewelling", name: "Wylie Welling", origin: "https://wyliewelling.com", collection: "shop-all" },
] as const;

export type VintageShopSource = (typeof vintageShops)[number]["source"];

export function marketplaceName(source: string) {
  if (source === "ebay") return "eBay";
  if (source === "shopgoodwill") return "ShopGoodwill";
  return vintageShops.find((shop) => shop.source === source)?.name
    ?? (source ? source[0].toUpperCase() + source.slice(1) : "Marketplace");
}
