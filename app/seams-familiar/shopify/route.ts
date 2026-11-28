import { toListingView } from "@/lib/fieldwear/listing-view";
import { searchShopifyCatalog, type ShopifyGarmentScope } from "@/lib/fieldwear/shopify-catalog";
import { defaultMemberSettings, readMember } from "@/lib/seams/members";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const scopes: readonly ShopifyGarmentScope[] = ["all", "shirt", "pants", "outerwear", "dress", "skirt"];

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const member = await readMember();
  const settings = member?.settings ?? defaultMemberSettings;
  const requestedDepartment = params.get("department");
  const department = requestedDepartment === "any" || requestedDepartment === "men" || requestedDepartment === "women"
    ? requestedDepartment : settings.department;
  const scope = scopes.find((value) => value === params.get("garment")) ?? "all";
  const decade = params.get("decade");
  const preferences = {
    department,
    shirtSizes: settings.topSizes,
    pantsSizes: settings.bottomSizes,
    shirtBudget: settings.budget,
    pantsBudget: settings.budget,
    matchingOnly: true,
  };
  const result = await searchShopifyCatalog(preferences, (params.get("q") ?? "").trim().slice(0, 80), undefined, scope);
  const checkedAt = new Date(result.checkedAt).toISOString();
  const items = result.listings.map((item) => toListingView(item, checkedAt, checkedAt, null, preferences))
    .filter(({ vintage }) => decade === "80s" || decade === "90s" ? vintage.decade === decade : vintage.period >= 0 || vintage.sturdy2000s);
  return Response.json({ items, expiresAt: result.expiresAt }, {
    status: result.status === "unavailable" ? 503 : 200,
    headers: { "Cache-Control": "private, no-store" },
  });
}
