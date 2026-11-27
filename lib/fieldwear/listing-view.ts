import type { ListingView } from "@/components/fieldwear/listing-workbench";
import type { CuratedListing } from "./curated-listings";
import { classifyGarment, scoreListing, type ListingInput } from "./listing-model";
import { listingColors } from "./listing-colors";
import { listingMeasurements, vintageSignals } from "./vintage-signals";
import type { ScoutPreferences } from "./preferences";

export function toListingView(
  input:ListingInput,
  firstSeenAt:string,
  lastSeenAt:string,
  decision:string|null,
  preferences:ScoutPreferences,
  curated?:CuratedListing,
):ListingView {
  const rescored = scoreListing(input, preferences);
  const sellerClaims = [...rescored.evidence.sellerClaims];
  const confirmed = [...rescored.evidence.confirmed];
  const visualClues = [...rescored.evidence.visualClues];
  const missing = [...rescored.missing];

  if (curated) {
    sellerClaims.push(
      curated.curatedEvidence.fiberClaim,
      curated.curatedEvidence.eraClaim,
      curated.curatedEvidence.originClaim,
    );
    confirmed.push(`Marketplace snapshot captured ${new Date(curated.provenance.capturedAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric", timeZone:"UTC" })}`);
    visualClues.push(...(curated.curatedEvidence.corroboratingClues ?? []));
    missing.push("Recheck current availability and seller details on the original listing");
  }

  return {
    source:input.source,
    sellerName: input.source === "shopifycatalog" || input.source === "ebay" ? input.seller ?? null : null,
    externalId:input.externalId,
    url:input.url,
    title:input.title,
    imageUrl:input.imageUrl ?? null,
    imageUrls:input.imageUrls,
    priceCents:input.priceCents ?? null,
    priceKind:input.priceKind,
    shippingCents:input.shippingCents ?? null,
    pickupAvailable:input.pickupAvailable,
    size:input.size ?? null,
    sizeBasis:input.sizeBasis,
    colors:listingColors(input.title, input.color),
    measurements:listingMeasurements(input.description),
    vintage:vintageSignals(input),
    condition:input.condition ?? null,
    firstSeenAt,
    lastSeenAt,
    totalScore:rescored.total,
    fitScore:rescored.fit,
    constructionScore:rescored.construction,
    ageScore:rescored.age,
    conditionScore:rescored.condition,
    valueScore:rescored.value,
    documentationScore:rescored.documentation,
    tasteMatch:rescored.tasteMatch,
    tasteReasons:curated ? [curated.curatedEvidence.curationNote, ...rescored.tasteReasons] : rescored.tasteReasons,
    eraConfidence:rescored.eraConfidence,
    eraReasons:rescored.eraReasons,
    qualityException:rescored.qualityException,
    garmentKind:classifyGarment(input),
    evidence:{ ...rescored.evidence, confirmed, sellerClaims:Array.from(new Set(sellerClaims)), visualClues:Array.from(new Set(visualClues)), hiddenBargain:rescored.hiddenBargain },
    concerns:rescored.concerns,
    missing:Array.from(new Set(missing)),
    decision,
    curatedCategory:curated?.category ?? null,
  };
}
