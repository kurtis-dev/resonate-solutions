import { ownerCatalogPath } from "./owner-routes";

export const departmentLabels = { any: "Any department", men: "Men’s", women: "Women’s", unisex: "Unisex" } as const;
export type Department = keyof typeof departmentLabels;
export type CatalogProfile = "owner" | "women";

export function catalogProfile(value: unknown): CatalogProfile {
  return value === "women" ? "women" : "owner";
}

export function catalogHref(profile: CatalogProfile, params: Record<string, string> = {}, anchor = "fresh") {
  const query = new URLSearchParams(profile === "women" ? { ...params, department: "women" } : params).toString();
  return `${ownerCatalogPath}${query ? `?${query}` : ""}#${anchor}`;
}

export type ScoutPreferences = {
  department: Department;
  shirtSizes: string[];
  pantsSizes: string[];
  shirtBudget: number | null;
  pantsBudget: number | null;
  matchingOnly: boolean;
};

export const defaultScoutPreferences: ScoutPreferences = {
  department: "men",
  shirtSizes: ["XLT", "2XL"],
  pantsSizes: ["38x32", "38x34", "40x32", "40x34"],
  shirtBudget: 100,
  pantsBudget: 50,
  matchingOnly: false,
};

const alphaSize = /\b(?:\d\s*-?\s*X(?:XL|LT|L|T)?|XXXXL|XXXL|XXL|XXS|XLT|TXL|LT|MT|XS|XL|SMALL|MEDIUM|LARGE|S|M|L)(?:[ -]?(?:TALL|LONG|EXTRA LONG))?\b/gi;
const waistInseam = /\bW?\s*(\d{2}(?:\.\d{1,2})?)\s*[x×]\s*L?\s*(\d{2}(?:\.\d{1,2})?)\b/gi;

function normalizeAlpha(value: string) {
  const compact = value.toUpperCase().replace(/[ -]/g, "").replace(/(?:EXTRA)?LONG$/, "TALL");
  if (["XLT", "TXL", "XLTALL"].includes(compact)) return "XLT";
  if (["LT", "LTALL", "LARGETALL"].includes(compact)) return "LT";
  if (["MT", "MTALL", "MEDIUMTALL"].includes(compact)) return "MT";
  if (compact === "SMALL") return "S";
  if (compact === "MEDIUM") return "M";
  if (compact === "LARGE") return "L";
  return compact.replace(/^(X{2,4})L/, (_, xs: string) => `${xs.length}XL`).replace(/^(\d)X(?:L|XL)?(T|TALL)?$/, (_, number: string, tall?: string) => `${number}XL${tall ? "T" : ""}`);
}

export function shirtSizeTokens(input: string) {
  const spelled = input.replace(/\b(women|men|ladie|girl|boy)[’']s\b/gi, "$1s").replace(/\b(extra small|extra large|large tall|medium tall|xl extra long)\b/gi, (match) =>
    ({ "extra small": "XS", "extra large": "XL", "large tall": "LT", "medium tall": "MT", "xl extra long": "XLT" })[match.toLowerCase()] ?? match);
  const numeric = Array.from(spelled.matchAll(/\b(?:tagged(?: size)?|size|sz|us|womens?)\s*[:.=]?\s*(\d{1,2}(?:\.5)?w?)\b/gi), ([, value]) => value.toUpperCase());
  if (/^\d{1,2}(?:\.5)?W?$/i.test(spelled.trim())) numeric.push(spelled.trim().toUpperCase());
  return Array.from(new Set([...(spelled.match(alphaSize) ?? []).map(normalizeAlpha), ...numeric]));
}

export function pantsSizeTokens(input: string) {
  const dimensions = Array.from(input.matchAll(waistInseam), ([, waist, inseam]) => `${waist}x${inseam}`);
  return dimensions.length ? dimensions : shirtSizeTokens(input);
}

export function reportedPantsFit(title: string) {
  const fit = title.match(/\b(?:fits?(?:[ -]+like)?|actual(?:[ -]+(?:size|fit))?|measures)\s*[:=]?[ -]*W?\s*(\d{2}(?:\.\d{1,2})?)\s*[x×]\s*L?\s*(\d{2}(?:\.\d{1,2})?)\b/i);
  return fit ? `${fit[1]}x${fit[2]}` : undefined;
}

export type FitListing = { title: string; size?: string | null; sizeBasis?: "tag" | "seller-fit" | "measured"; garmentKind: string };

export function sizeMatch(item: FitListing, preferences: ScoutPreferences) {
  const pants = item.garmentKind === "pants" || item.garmentKind === "skirt";
  const targets = pants ? preferences.pantsSizes : preferences.shirtSizes;
  if (!targets.length) return true;
  const parse = pants ? pantsSizeTokens : shirtSizeTokens;
  const reported = pants && item.sizeBasis !== "measured" ? reportedPantsFit(item.title) : undefined;
  const field = reported ?? item.size?.trim() ?? "";
  const tagged = parse(field);

  const title = item.title.replace(/\b(?:[a-z]\.){2,}/gi, "");
  const candidates = tagged.length ? tagged : parse(title);
  if (pants && candidates.length > 1) return candidates.every((size) => targets.includes(size));
  return candidates.some((size) => targets.includes(size));
}

export function departmentMatch({ title }: FitListing, selected: Department) {
  if (selected === "any") return 1;
  const departments = [
    ["unisex", /\b(?:unisex|gender[- ]neutral)\b/i],
    ["women", /\b(?:women(?:['’]?s)?|ladies)\b/i],
    ["men", /\b(?:men(?:['’]?s)?)\b/i],
    ["youth", /\b(?:youth|kids|boys|girls)\b/i],
  ] as const;
  const labels = departments.filter(([, pattern]) => pattern.test(title)).map(([label]) => label);
  if (labels.includes(selected)) return 2;
  if (!labels.length || labels.includes("unisex")) return 1;
  return 0;
}

export function matchesScoutFit(item: FitListing, preferences: ScoutPreferences) {
  return sizeMatch(item, preferences) && departmentMatch(item, preferences.department) > 0;
}

export function fitPriority(item: FitListing, preferences: ScoutPreferences) {
  const department = departmentMatch(item, preferences.department);
  return department === 0 ? 0 : department + (sizeMatch(item, preferences) ? 3 : 0);
}

export function marketplaceQuery(preferences: ScoutPreferences, pants: boolean, size: string) {
  const department = { any: "", unisex: "unisex", men: "mens", women: "womens" }[preferences.department];
  const garment = pants ? "work pants" : "cotton work shirt";
  return [department, size, garment].filter(Boolean).join(" ");
}

export function parseScoutPreferences(form: FormData): ScoutPreferences | null {
  const department = String(form.get("department") ?? "");
  if (!Object.prototype.hasOwnProperty.call(departmentLabels, department)) return null;
  const parseSizes = (name: string, pants: boolean) => {
    const value = String(form.get(name) ?? "").trim();
    if (value.length > 120) return null;
    const tokens = value.split(",").map((token) => token.trim()).filter(Boolean);
    if (tokens.length > 12) return null;
    const sizes = tokens.map((token) => {
      const dimensions = pants ? Array.from(token.matchAll(waistInseam)) : [];
      if (dimensions[0]?.[0] === token) return `${dimensions[0][1]}x${dimensions[0][2]}`;
      if (/^\d{1,2}(?:\.5)?W?$/i.test(token)) return token.toUpperCase();
      if (/^(?:XXS|XS|S|M|L|XL|X{2,4}L|XLT|TXL|XL[ -]?(?:TALL|LONG|EXTRA LONG)|[ML](?:T|[ -]?TALL)|[1-9]\s*-?\s*X(?:L|T|LT|L[ -]?TALL)?|small|medium|large|extra small|extra large|large tall|medium tall)$/i.test(token)) return shirtSizeTokens(token)[0];
      return undefined;
    });
    return sizes.some((size) => !size) ? null : Array.from(new Set(sizes as string[]));
  };
  const parseBudget = (name: string) => {
    const value = String(form.get(name) ?? "").trim();
    if (!value) return null;
    const budget = Number(value);
    return /^\d{1,4}(?:\.\d{1,2})?$/.test(value) && budget > 0 ? budget : undefined;
  };
  const shirtSizes = parseSizes("shirtSizes", false);
  const pantsSizes = parseSizes("pantsSizes", true);
  const shirtBudget = parseBudget("shirtBudget");
  const pantsBudget = parseBudget("pantsBudget");
  if (!shirtSizes || !pantsSizes || shirtBudget === undefined || pantsBudget === undefined) return null;
  return { department: department as Department, shirtSizes, pantsSizes, shirtBudget, pantsBudget, matchingOnly: form.get("matchingOnly") === "on" };
}
