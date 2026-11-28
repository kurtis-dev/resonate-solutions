import { vintageSignals } from "./vintage-signals";

const tee = /\b(?:tees?|t[\s-]*shirts?)\b/i;
const crewNeck = /\bcrew[\s-]*neck\b/i;
const vNeck = /\bv[\s-]*neck\b/i;
const sweat = /\bsweat[\s-]*shirts?\b/i;
const incompatible = /\b(?:hoodies?|tank tops?|shirt[\s-]*jackets?|shackets?|polos?|henleys?|button[\s-]*(?:front|downs?|ups?))\b/i;
const printOrRework = /\b(?:graphic|screen[\s-]*print(?:ed)?|concert|tour shirt|souvenir|parody|reunion|promo(?:tional)?|marlboro|cigarettes?|tie[\s-]*dye|reworked|cut[\s-]*off|reprints?|repro(?:duction)?|replica|vintage[\s-]*style|print[\s-]*on[\s-]*demand|sewing pattern|dry rot|everlane|bronson mfg)\b/i;

export function casualTopStyle(title: string) {
  if (incompatible.test(title)) return null;
  if (sweat.test(title)) return "sweatshirt";
  if (!tee.test(title) && !((crewNeck.test(title) || vNeck.test(title))
    && /\b(?:short[\s-]*sleeve|shirts?)\b/i.test(title) && !/\b(?:sweaters?|blouses?|dresses?|dress shirts?)\b/i.test(title))) return null;
  return crewNeck.test(title) ? "crew-tee" : vNeck.test(title) ? "v-tee" : "tee";
}

export function isQualityCasualTop(item: { title: string; description?: string }) {
  if (!casualTopStyle(item.title) || printOrRework.test(item.title)) return false;
  const signals = vintageSignals(item);
  if (signals.build < 0 || (signals.period < 0 && !signals.sturdy2000s)) return false;
  const evidence = `${item.title} ${item.description ?? ""}`;
  if (/\bsingle[\s-]*stitch(?:ed)?\b/i.test(evidence)) return true;
  if (signals.period > 0) return signals.cotton || signals.build > 0 || /\b(?:blank|plain|solid|pocket|ringer|v[\s-]*notch)\b/i.test(item.title);
  if (signals.sturdy2000s) return true;
  return (signals.build > 0 && /\b(?:v[\s-]*notch|double[\s-]*v|ringer)\b/i.test(evidence))
    || (signals.cotton && /\bmade in (?:the )?(?:u\.?s\.?a\.?|united states)\b/i.test(evidence));
}
