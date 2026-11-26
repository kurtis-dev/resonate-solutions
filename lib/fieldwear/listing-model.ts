import { departmentMatch, sizeMatch, type ScoutPreferences } from "./preferences";

export const marketplaceHosts = {
  ebay: ["ebay.com", "www.ebay.com"],
  etsy: ["etsy.com", "www.etsy.com"],
  grailed: ["grailed.com", "www.grailed.com"],
  poshmark: ["poshmark.com", "www.poshmark.com"],
  depop: ["depop.com", "www.depop.com"],
  mercari: ["mercari.com", "www.mercari.com"],
  vinted: ["vinted.com", "www.vinted.com"],
  shopgoodwill: ["shopgoodwill.com", "www.shopgoodwill.com"],
} as const;

export type MarketplaceSource = keyof typeof marketplaceHosts | "other";
export type GarmentKind = "shirt" | "pants" | "outerwear" | "unknown";

export type ListingInput = {
  source: MarketplaceSource;
  externalId: string;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  priceCents?: number | null;
  shippingCents?: number | null;
  size?: string | null;
  condition?: string | null;
  seller?: string | null;
};

export type ListingEvidence = {
  confirmed: string[];
  sellerClaims: string[];
  visualClues: string[];
};

export type EraVerdict = "probable-pre85" | "possible-pre85" | "undated" | "post85-or-contradicted";
export type FiberVerdict = "natural-fiber-claimed" | "blend-or-synthetic" | "unknown";

export type ListingScore = {
  fit: number;
  construction: number;
  age: number;
  condition: number;
  value: number;
  documentation: number;
  penalty: number;
  total: number;
  evidence: ListingEvidence;
  concerns: string[];
  missing: string[];
  hiddenBargain: boolean;
  tasteMatch: number;
  tasteReasons: string[];
  eraConfidence: number;
  eraReasons: string[];
  eraVerdict: EraVerdict;
  periodEligible: boolean;
  fiberVerdict: FiberVerdict;
  qualityException: boolean;
};

const preferredSizes = [
  "xlt", "txl", "xl tall", "xxl", "2xl",
  "38x32", "38 x 32", "38x34", "38 x 34",
  "40x32", "40 x 32", "40x34", "40 x 34",
];

const ageTerms: Array<[RegExp, string, number]> = [
  [/union(?:\s|-)?made|union label/i, "Union-label claim", 8],
  [/made in (?:the )?u\.?s\.?a\.?|usa made/i, "Made-in-USA claim", 8],
  [/talon|scovill|gripper|ideal zipper/i, "Period-hardware claim", 3],
  [/\b(?:19[3-7]\d|198[0-5])\b|\b(?:19[3-7]0s|30s|40s|50s|60s|70s)\b|early (?:80s|1980s)|pre[ -]?1985/i, "Pre-mid-1980s date claim", 10],
  [/\b(?:198[6-9]|199\d|1980s|1990s|80s|90s)\b/i, "Later vintage date claim", 4],
  [/single stitch|paper tag|lot number/i, "Construction or label-era claim", 3],
];

const constructionTerms: Array<[RegExp, string, number]> = [
  [/100% (?:wool|cotton)|pure wool|virgin wool|all (?:wool|cotton)/i, "100% natural-fiber claim", 8],
  [/made in (?:the )?u\.?s\.?a\.?|usa made|made in (?:canada|england|scotland|japan)/i, "Quality-manufacturing claim", 4],
  [/chamois|melton|moleskin|duck canvas|heavy(?:weight)? (?:cotton|flannel)/i, "Substantial fabric claim", 5],
  [/flannel[ -]?lined|blanket[ -]?lined/i, "Substantial woven lining claim", 6],
  [/denim|canvas/i, "Durable shell fabric claim", 4],
  [/shirt[ -]?jacket|shacket|overshirt/i, "Layering-oriented shirt jacket", 4],
  [/flat[ -]?fell|chain[ -]?stitch|double needle/i, "Durable seam claim", 4],
  [/double knee|reinforced|gusset|bar[ -]?tack/i, "Reinforced construction claim", 4],
  [/pile[ -]?lined|blanket[ -]?lined|quilted lining/i, "Functional lining claim", 3],
  [/selvedge|rivet|triple stitch/i, "Workwear construction claim", 3],
];

const tasteSignals:Array<[RegExp, string, number]> = [
  [/\b(?:xlt|txl|xl tall)\b/i, "Tall XL fit", 15],
  [/\b(?:xxl|2xl)\b/i, "Roomy preferred size", 8],
  [/100% (?:cotton|wool)|pure wool|virgin wool|all (?:wool|cotton)/i, "100% cotton or wool", 20],
  [/\b(?:19[3-7]\d|198[0-5])\b|\b(?:19[3-7]0s|30s|40s|50s|60s|70s)\b|early (?:80s|1980s)|pre[ -]?1985/i, "Pre-mid-1980s evidence", 15],
  [/made in (?:the )?u\.?s\.?a\.?|usa made|union(?:\s|-)?made/i, "USA or union-made evidence", 12],
  [/made in (?:canada|england|scotland|japan)/i, "Quality-country manufacturing clue", 7],
  [/shirt[ -]?jacket|shacket|overshirt/i, "Shirt-jacket silhouette", 12],
  [/flannel[ -]?lined|blanket[ -]?lined/i, "Warm woven lining", 12],
  [/chamois|denim|duck canvas|melton|moleskin|heavy(?:weight)? (?:cotton|flannel)/i, "Substantial fabric", 15],
  [/relaxed|oversized|roomy|layering|rugged|workwear|work shirt/i, "Practical relaxed construction", 10],
  [/flat[ -]?fell|chain[ -]?stitch|double needle|triple stitch|bar[ -]?tack|reinforced/i, "Durable construction detail", 10],
  [/\b(?:blue|navy|indigo|brown|tan|khaki|olive|green|gray|grey|rust)\b/i, "Restrained workwear color", 3],
];

// Brand longevity never dates a garment by itself. These makers only establish that a
// pre-1985 example is plausible; a second independent clue is required for the period lane.
const pre85Makers = /l\.?l\.?\s*bean|woolrich|pendleton|big mac|big yank|five brother|oshkosh|sears|roebucks|hercules|fieldmaster|frostproof|king kole|washington dee cee|carhartt|wrangler|lee|key imperial|key work|cabela'?s|red head|filson|bemidji|wool o'? the west|richman brothers|pilgrim|towncraft|foremost|headlight|sweet[- ]orr|pointer brand|round house|big smith/i;
const post85Makers = /duluth trading|legendary whitetails|dixxon|amazon essentials|ridgecut toughwear|ariat|untuckit|roark revival|faherty/i;
const heritageBrand = /l\.?l\.?\s*bean|woolrich|pendleton|big mac|big yank|five brother|oshkosh|sears|roebucks|hercules|fieldmaster|frostproof|king kole|washington dee cee|carhartt|wrangler|lee|key imperial|key work|cabela'?s|red head|filson|bemidji/i;
const periodCountry = /made in (?:the )?u\.?s\.?a\.?|usa made|made in (?:canada|england|scotland|ireland|japan)/i;
// These origins are not quality judgments. Paired with a US heritage label, they are a
// useful production-generation contradiction, but cannot date an unrelated maker.
const laterHeritageOrigin = /made in (?:china|vietnam|bangladesh|cambodia|jordan|lesotho|sri lanka|indonesia|thailand)|imported from (?:china|vietnam|bangladesh|cambodia)/i;
const strongPre85Date = /\b(?:19[3-7]\d|198[0-5])\b|\b(?:19[3-7]0s|30s|40s|50s|60s|70s)\b|early (?:80s|1980s)|pre[ -]?1985/i;
const explicitPost85Date = /\b(?:198[6-9]|199\d|20[0-2]\d)\b|\b(?:late 80s|90s|1990s|y2k|2000s|2010s|2020s)\b/i;
const periodHardware = /talon|scovill|gripper|union label|single stitch|paper tag|lot number/i;
const modernTagCue = /(?:www\.|https?:\/\/|\.com\b|qr code|scan (?:the )?code|instagram|made for .*\.com)/i;
const naturalFiber = /100% (?:wool|cotton)|pure wool|virgin wool|all (?:wool|cotton)/i;
const syntheticDominant = /100% (?:polyester|acrylic)|polyester shell|(?:60|65|70|75|80|85|90|95)% polyester/i;
const syntheticBlend = /poly(?:ester)?[\s/-]*(?:cotton|blend)|cotton[\s/-]*poly(?:ester)?|wool[\s/-]*blend/i;

const documentedCondition = /no (?:holes|stains|tears)|excellent condition|light wear|wear shown|flaw|repair/i;
const measurementTerms = /pit to pit|chest measures|waist measures|inseam|shoulder|sleeve|measurements/i;
const proofTerms = /tag photo|label photo|care tag|zipper|close[ -]?up|returns accepted/i;
const hypeTerms = /\b(?:vintage|rare|archive|archival|gorpcore|y2k|deadstock)\b/i;
const severeTerms: Array<[RegExp, string, number]> = [
  [/dry rot/i, "Dry rot disclosed", 35],
  [/print[ -]?on[ -]?demand/i, "Print-on-demand item", 30],
  [/reproduction|replica|repro\b/i, "Modern reproduction", 24],
  [/graphic (?:tee|t-shirt)|concert tee|movie tee/i, "Graphic merchandise", 20],
  [/large hole|major tear/i, "Major damage disclosed", 15],
  [/moth (?:hole|damage)/i, "Moth damage disclosed", 12],
  [/100% (?:polyester|acrylic)|polyester shell|(?:60|65|70|75|80|85|90|95)% polyester/i, "Synthetic-dominant fabric", 14],
  [/poly(?:ester)?[\s/-]*(?:cotton|blend)|cotton[\s/-]*poly(?:ester)?/i, "Polyester-blend fabric", 6],
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeMarketplaceUrl(raw: string) {
  const url = new URL(raw.trim());
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Use a valid http or https listing URL.");
  url.hash = "";
  for (const key of Array.from(url.searchParams.keys())) {
    if (key.startsWith("utm_") || ["irgwc", "afsrc", "mkcid", "mkevt", "siteid", "campid", "customid", "toolid"].includes(key)) {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

export function detectMarketplace(rawUrl: string): MarketplaceSource {
  const hostname = new URL(rawUrl).hostname.toLowerCase().replace(/^m\./, "www.");
  for (const [source, hosts] of Object.entries(marketplaceHosts)) {
    if ((hosts as readonly string[]).some((host) => hostname === host || hostname.endsWith(`.${host.replace(/^www\./, "")}`))) {
      return source as MarketplaceSource;
    }
  }
  return "other";
}

export function stableListingId(source: MarketplaceSource, url: string) {
  const ebayId = url.match(/\/itm\/(?:[^/]+\/)?(\d{9,15})/i)?.[1];
  if (source === "ebay" && ebayId) return ebayId;
  let hash = 2166136261;
  for (const char of url) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0).toString(36);
}

export function classifyGarment(input: Pick<ListingInput, "title" | "description" | "size">): GarmentKind {
  const text = `${input.title} ${input.description ?? ""} ${input.size ?? ""}`;
  if (/\b(?:pants|jeans?|dungarees?|trousers?|carpenters?|painters?|overalls?)\b|\b(?:38|40)\s?[x×]\s?(?:32|34)\b/i.test(text)) return "pants";
  if (/\b(?:coat|parka|blazer|outerwear)\b|\bjacket\b(?![- ]?shirt)/i.test(text) && !/shirt[- ]?(?:jacket|jac)|shacket/i.test(text)) return "outerwear";
  if (/\b(?:shirts?|flannel|chamois|overshirt|shirt[- ]?(?:jacket|jac)|shacket)\b/i.test(text)) return "shirt";
  return "unknown";
}

export function scoreListing(input: ListingInput, preferences?: ScoutPreferences): ListingScore {
  const text = `${input.title} ${input.description ?? ""} ${input.size ?? ""} ${input.condition ?? ""}`.toLowerCase();
  const evidence: ListingEvidence = { confirmed: [], sellerClaims: [], visualClues: [] };
  const concerns: string[] = [];
  const missing: string[] = [];
  const tasteReasons:string[] = [];
  const eraReasons:string[] = [];

  let eraConfidence = 0;
  let eraPositiveSignals = 0;
  let eraStrongSignals = 0;
  let eraContradiction = 0;
  const makerIsPeriodCompatible = pre85Makers.test(text);
  const hasExplicitPre85Date = strongPre85Date.test(text);
  const hasPeriodOrigin = periodCountry.test(text);
  const hasPeriodHardware = periodHardware.test(text);
  const hasLaterHeritageOrigin = heritageBrand.test(text) && laterHeritageOrigin.test(text);
  const approvedBeanIndiaReference = /l\.?l\.?\s*bean/i.test(text) && /made in india/i.test(text) && /denim|chamois|canvas|flannel[ -]?lined|shirt[ -]?jacket|shacket/i.test(text);

  if (pre85Makers.test(text)) {
    eraConfidence += 8;
    eraPositiveSignals += 1;
    eraReasons.push("Maker existed before 1985; brand alone does not date the garment");
  }
  if (hasExplicitPre85Date) {
    eraConfidence += 42;
    eraPositiveSignals += 1;
    eraStrongSignals += 1;
    eraReasons.push("Seller gives a pre-mid-1980s date");
  }
  if (hasPeriodOrigin) {
    eraConfidence += 32;
    eraPositiveSignals += 1;
    eraReasons.push("Country or union claim is compatible with period production, but is not proof by itself");
  }
  if (hasPeriodHardware) {
    eraConfidence += 32;
    eraPositiveSignals += 1;
    eraStrongSignals += 1;
    eraReasons.push("Period label or hardware clue");
  }
  if (post85Makers.test(text)) {
    eraContradiction += 80;
    eraReasons.push("Maker or line post-dates the target era");
  }
  if (explicitPost85Date.test(text)) {
    eraContradiction += 55;
    eraReasons.push("Stated date falls after the 1985 cutoff");
  }
  if (modernTagCue.test(text)) {
    eraContradiction += 70;
    eraReasons.push("Web or QR information on the tag is a modern contradiction");
  }
  if (hasLaterHeritageOrigin) {
    eraContradiction += 45;
    eraReasons.push("Heritage-brand origin points to a later production generation");
  }
  if (approvedBeanIndiaReference) {
    eraContradiction += 45;
    eraReasons.push("Made-in-India L.L.Bean is treated as later production, not authentic pre-1985");
  }
  const rawEraConfidence = clamp(eraConfidence - eraContradiction, 0, 100);
  // Period results need corroboration: maker + origin, date + label, etc. This keeps a
  // modern shirt from entering the old-stock lane merely because the brand is old.
  const periodEligible = eraPositiveSignals >= 2 && eraStrongSignals >= 1 && eraContradiction < 40 && rawEraConfidence >= 40;
  // Existing consumers use the numeric threshold, so an uncorroborated maker + country
  // combination is capped below the period lane even when its raw clues add to 40.
  eraConfidence = periodEligible ? rawEraConfidence : Math.min(rawEraConfidence, 39);
  const eraVerdict: EraVerdict = eraContradiction >= 40
    ? "post85-or-contradicted"
    : periodEligible && eraConfidence >= 65
      ? "probable-pre85"
      : periodEligible
        ? "possible-pre85"
        : "undated";

  const fiberVerdict: FiberVerdict = naturalFiber.test(text)
    ? "natural-fiber-claimed"
    : syntheticDominant.test(text) || syntheticBlend.test(text)
      ? "blend-or-synthetic"
      : "unknown";

  let tasteMatch = 0;
  for (const [pattern, label, points] of tasteSignals) {
    if (preferences && (label === "Tall XL fit" || label === "Roomy preferred size")) continue;
    if (pattern.test(text)) {
      tasteMatch += points;
      tasteReasons.push(label);
    }
  }
  if (syntheticDominant.test(text)) {
    tasteMatch -= 35;
    tasteReasons.push("Synthetic-dominant fabric lowers the match");
  } else if (syntheticBlend.test(text)) {
    tasteMatch -= 15;
    tasteReasons.push("Polyester blend lowers the match");
  }
  if (makerIsPeriodCompatible) {
    tasteMatch += 4;
    tasteReasons.push("Heritage workwear maker");
  }
  if (/graphic (?:tee|t-shirt)|concert tee|movie tee|dress shirt|non-iron/i.test(text)) tasteMatch -= 50;
  tasteMatch = clamp(tasteMatch, 0, 100);

  if (input.priceCents != null) evidence.confirmed.push(`Listed at $${(input.priceCents / 100).toFixed(2)} before shipping`);
  if (input.shippingCents != null) evidence.confirmed.push(`Shipping listed at $${(input.shippingCents / 100).toFixed(2)}`);
  if (input.size) evidence.confirmed.push(`Seller-entered size: ${input.size}`);

  const fitInput = { ...input, garmentKind: classifyGarment(input) };
  const matchedSize = preferences ? sizeMatch(fitInput, preferences) : preferredSizes.some((size) => text.includes(size));
  const sizes = fitInput.garmentKind === "pants" ? preferences?.pantsSizes : preferences?.shirtSizes;
  const compatibleDepartment = preferences ? departmentMatch(fitInput, preferences.department) > 0 : !/women|womens|ladies|youth|kids/i.test(text);
  const partialFit = !preferences && /\b(?:xl|xxl|2xl|38|40)\b/i.test(text);
  const fit = compatibleDepartment ? (sizes?.length === 0 ? 15 : matchedSize ? 25 : partialFit ? 12 : 5) : 0;
  if (matchedSize && sizes?.length !== 0) evidence.sellerClaims.push("Listing size matches a preferred size");
  else if (sizes?.length !== 0) missing.push("Preferred size or garment measurements");

  let construction = 3;
  for (const [pattern, label, points] of constructionTerms) {
    if (pattern.test(text)) {
      construction += points;
      evidence.sellerClaims.push(label);
    }
  }
  construction = clamp(construction, 0, 25);
  if (syntheticDominant.test(text)) construction = Math.max(0, construction - 8);
  else if (syntheticBlend.test(text)) construction = Math.max(0, construction - 3);
  if (construction <= 5) missing.push("Fiber content, fabric weight, or seam construction");
  if (fiberVerdict === "unknown") missing.push("Fiber-content tag showing 100% cotton or wool");
  if (fiberVerdict === "blend-or-synthetic") concerns.push("Fiber content conflicts with the natural-fiber preference");

  let age = 0;
  for (const [pattern, label, points] of ageTerms) {
    if (pattern.test(text)) {
      age += points;
      evidence.sellerClaims.push(label);
    }
  }
  // Cap age sharply unless the item clears the corroborated period gate.
  age = periodEligible ? clamp(age, 8, 20) : clamp(age, 0, eraContradiction >= 40 ? 2 : 6);
  if (age < 5) missing.push("Label, hardware, or date evidence");
  if (/\bvintage\b/i.test(text) && age < 5) concerns.push("“Vintage” appears without supporting age evidence");

  let condition = 8;
  if (documentedCondition.test(text)) condition += 4;
  if (/stain|hole|tear|fray|repair|distress/i.test(text)) condition -= 3;
  condition = clamp(condition, 0, 15);
  if (!documentedCondition.test(text)) missing.push("Specific condition notes and close-up photos");

  const totalCents = (input.priceCents ?? 0) + (input.shippingCents ?? 0);
  const substantialLayer = /flannel[ -]?lined|blanket[ -]?lined|shirt[ -]?jacket|shacket|overshirt|chamois|heavy(?:weight)? (?:cotton|flannel)/i.test(text);
  const targetCents = classifyGarment(input) === "pants" ? 3500 : substantialLayer ? 4500 : 2500;
  let value = 4;
  if (input.priceCents == null) missing.push("Price");
  else if (totalCents <= targetCents) value = 10;
  else if (totalCents <= targetCents * 1.25) value = 7;
  else if (totalCents <= targetCents * 1.6) value = 4;
  else value = 1;

  let documentation = 0;
  if (measurementTerms.test(text)) documentation += 3;
  else missing.push("Actual measurements");
  if (proofTerms.test(text)) documentation += 2;
  else missing.push("Tag and construction close-ups");
  documentation = clamp(documentation, 0, 5);

  let penalty = 0;
  for (const [pattern, label, points] of severeTerms) {
    if (pattern.test(text)) {
      penalty += points;
      concerns.push(label);
    }
  }
  if (hypeTerms.test(text) && age < 5) penalty += 2;

  const total = clamp(fit + construction + age + condition + value + documentation - penalty, 0, 100);
  const hiddenBargain = !hypeTerms.test(text) && input.priceCents != null && totalCents <= targetCents * 1.25 && total >= 48;
  const qualityException = !periodEligible && construction >= 14 && penalty < 14 && (tasteMatch >= 50 || approvedBeanIndiaReference);
  if (qualityException) eraReasons.push("Quality exception only: construction may fit the taste even though the era is unproven");
  return { fit, construction, age, condition, value, documentation, penalty, total, evidence, concerns, missing, hiddenBargain, tasteMatch, tasteReasons, eraConfidence, eraReasons, eraVerdict, periodEligible, fiberVerdict, qualityException };
}

export function parseOptionalMoney(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const amount = Number(raw.replace(/[$,]/g, ""));
  if (!Number.isFinite(amount) || amount < 0 || amount > 100000) throw new Error("Enter a valid dollar amount.");
  return Math.round(amount * 100);
}
