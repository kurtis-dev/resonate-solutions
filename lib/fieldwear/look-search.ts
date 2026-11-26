import { classifyGarment, type ListingInput } from "./listing-model";
import { vintageSignals } from "./vintage-signals";

export const beanReferenceId = "87148811";
export type LookProfile = "similar" | "browning";
export const lookDays = 365;

const traits = {
  denim: /\b(?:denim|jeans)\b/i,
  canvas: /\b(?:canvas|duck(?!\s+(?:head|camo)\b))\b/i,
  chamois: /\bchamois\b/i,
  wool: /\b(?:wool|melton|whipcord)\b/i,
  flannel: /\bflannel\b/i,
  lined: /\b(?:lined|insulated|quilted)\b/i,
  utility: /\b(?:work|utility|chore|carpenter|double[- ]knee|fatigues?)\b/i,
  straight: /\bstraight\b/i,
  overshirt: /\b(?:shirt[- ]?jacket|shacket|overshirt)\b/i,
} as const;
type Trait = keyof typeof traits;
const terms: Record<Trait,string> = { ...Object.fromEntries(Object.keys(traits).map((key) => [key,key])) as Record<Trait,string>, overshirt: "shirt jacket" };
const material = /\b(?:leather|suede|deerskin)\b/i;
const elbows = /\b(?:elbow[- ]?patch(?:es)?|(?:reinforced|patched|padded) elbows?|elbow reinforcement)\b/i;
const faux = /\b(?:faux|imitation|synthetic|vegan)[- ]+(?:leather|suede)\b/i;
const browning = /\bbrowning\b/i;
const bean = /\bl\.?\s*l\.?\s*bean\b/i;
const otherBrand = /\b(?:orvis|pendleton|woolrich|eddie bauer|polo ralph lauren|redhead|filson|ll bean)\b/i;
const flashy = /\b(?:camo(?:uflage)?|blaze orange|neon|tactical|performance)\b/i;

export type LookHunt = {
  profile: LookProfile;
  title: string;
  kind: "shirt" | "pants";
  queries: string[];
  traits: Trait[];
  reference?: { source: string; externalId: string };
};

export const browningHunt: LookHunt = {
  profile: "browning", title: "Browning & leather elbow patches", kind: "shirt", traits: [],
  queries: [
    'Browning ("elbow patch","elbow patches",suede,leather) shirt',
    'Browning ("super naturals",upland,shooting) shirt',
    'Browning (denim,canvas,cotton) hunting shirt',
    '(suede,leather) ("elbow patch","elbow patches") shirt',
    'Woolrich suede elbow shirt',
    'Pendleton (suede,leather) ("elbow patch","elbow patches") shirt',
    '(Woolrich,Pendleton,Orvis,RedHead) ("elbow patch","elbow patches") shirt',
  ],
};

export function similarHunt(reference: ListingInput): LookHunt | null {
  const garment = classifyGarment({ title: reference.title, size: reference.size });
  if (garment !== "shirt" && garment !== "pants") return null;
  const requested = (Object.keys(traits) as Trait[]).filter((key) => traits[key].test(reference.title));
  const isBeanReference = reference.source === "grailed" && reference.externalId === beanReferenceId;
  const keyTerms = requested.filter((key) => key !== "overshirt").slice(0, 3).map((key) => terms[key]);
  const noun = garment === "shirt" ? "shirt" : "pants";
  const label = reference.title;
  return {
    profile: "similar", title: label, kind: garment, traits: requested,
    reference: { source: reference.source, externalId: reference.externalId },
    queries: isBeanReference ? ['"LL Bean" lined denim shirt', "denim flannel lined shirt", "denim lined shirt jacket"]
      : [`${keyTerms.join(" ")} ${noun}`, `${keyTerms.slice(0, 2).join(" ")} ${traits.overshirt.test(label) ? "shirt jacket" : `work ${noun}`}`].map((query) => query.trim()),
  };
}

export function matchLook(input: ListingInput, hunt: LookHunt): { rank: number; note: string | null; group?: "browning-patched" | "other-patched" | "browning-field" } | null {
  const text = [input.title, input.description].filter(Boolean).join("\n");
  const quality = vintageSignals(input);
  if (quality.build < 0 || /\b(?:costume|distressed\s+beyond|thrashed|faux suede)\b/i.test(input.title)) return null;
  const stylePenalty = flashy.test(input.title) ? 10 : 0;
  if (hunt.profile === "browning") {
    if (/\b(?:short[- ]sleeve|polo shirt|rugby|t[- ]?shirt|rocawear)\b/i.test(input.title)) return null;
    const isBrowning = browning.test(input.title);
    const patched = elbows.test(text) && material.test(text.replace(/\bbuck suede\b/gi, "")) && !faux.test(text)
      && !/\b(?:canvas|cotton|cordura)[- ]+(?:forearm\/)?elbow[- ]+patch/i.test(text);
    const suitable = otherBrand.test(input.title) || quality.build > 0 && /\b(?:field|work|utility|outdoor|wool)\b/i.test(input.title);
    if (patched && (isBrowning || suitable)) return {
      rank: (isBrowning ? 110 : 86) + (otherBrand.test(text) ? 4 : 0) + quality.build * 3 - stylePenalty,
      group: isBrowning ? "browning-patched" : "other-patched",
      note: isBrowning ? "Browning · leather or suede elbow patches described" : "Other maker · leather or suede elbow patches described",
    };
    const field = /\b(?:hunting|shooting|upland|utility|field|super naturals)\b/i.test(text);
    const shell = quality.cotton || quality.wool || quality.sturdyBlend || /\b(?:canvas|denim|twill|chamois)\b/i.test(input.title);
    if (!isBrowning || !field || !shell || /\bbuck suede\b/i.test(input.title)) return null;
    const reinforcedElbow = elbows.test(text);
    return { rank: 35 + quality.build * 5 + (reinforcedElbow ? 20 : 0) - stylePenalty,
      note: reinforcedElbow ? "Browning · reinforced elbows described" : "Browning field shirt · leather elbow patches unconfirmed", group: "browning-field" };
  }

  if (hunt.reference?.source === input.source && hunt.reference.externalId === input.externalId) return null;
  const shared = hunt.traits.filter((key) => traits[key].test(text));
  const isBeanReference = hunt.reference?.source === "grailed" && hunt.reference.externalId === beanReferenceId;
  if (isBeanReference) {
    if (!shared.includes("denim") || !shared.includes("lined")) return null;
    const flannel = /\b(?:flannel|tartan)[- ]lined\b|\b(?:flannel|tartan) lining\b/i.test(text)
      || (/\bflannel\b/i.test(input.title) && /\blined\b/i.test(input.title));
    return {
      rank: 65 + (flannel ? 24 : 0) + (bean.test(input.title) ? 13 : 0) + quality.build * 4 + Math.max(0, quality.period) * 3 - stylePenalty,
      note: `${bean.test(input.title) ? "L.L.Bean · " : ""}${flannel ? "Flannel-lined denim" : "Lined denim"}`,
    };
  }
  const meaningful = shared.some((key) => !["utility", "straight", "overshirt"].includes(key));
  if (hunt.traits.length && !meaningful && shared.length < Math.min(2, hunt.traits.length)) return null;
  return { rank: shared.length * 17 + quality.build * 5 + Math.max(0, quality.period) * 3 - stylePenalty, note: null };
}
