export const colorFamilies = [
  { label: "Black", swatch: "#25282D", terms: /\bblack\b/i },
  { label: "Blue", swatch: "#4A6E9F", terms: /\b(?:blue|navy|indigo|cobalt|denim blue|teal|turquoise)\b/i },
  { label: "Brown", swatch: "#79553E", terms: /\b(?:brown|chocolate|coffee|espresso|saddle|tobacco|caramel|timber)\b/i },
  { label: "Tan / khaki", swatch: "#C4AD86", terms: /\b(?:tan|khaki|beige|camel|sandstone|sand|stone|taupe|ecru)\b/i },
  { label: "Gray", swatch: "#838891", terms: /\b(?:gray|grey|charcoal|slate|graphite|silver)\b/i },
  { label: "Green", swatch: "#68744B", terms: /\b(?:green|olive|sage|forest|moss)\b/i },
  { label: "Red", swatch: "#A44549", terms: /\b(?:red|burgundy|maroon|cranberry|oxblood|wine)\b/i },
  { label: "Orange", swatch: "#CD6C37", terms: /\b(?:orange|rust|copper)\b/i },
  { label: "Yellow", swatch: "#D3AA44", terms: /\b(?:yellow|mustard|gold|ochre)\b/i },
  { label: "White / cream", swatch: "#FAF7EC", terms: /\b(?:white|off[- ]white|cream|ivory|undyed)\b/i },
  { label: "Pink", swatch: "#D08A9F", terms: /\b(?:pink|rose|magenta|fuchsia|salmon)\b/i },
  { label: "Purple", swatch: "#766093", terms: /\b(?:purple|lavender|violet|plum|lilac)\b/i },
  { label: "Multicolor", swatch: "linear-gradient(135deg, #4a6e9f 33%, #68744b 33% 66%, #a44549 66%)", terms: /\b(?:multi(?:[ -]?colou?r(?:ed)?)?|rainbow)\b/i },
] as const;

export type ColorFamily = (typeof colorFamilies)[number]["label"];

export function listingColors(title: string, sellerColor?: string | null): ColorFamily[] {
  const find = (text: string) => colorFamilies.filter(({ terms }) => terms.test(text)).map(({ label }) => label);
  const explicit = find(sellerColor ?? "");
  if (explicit.some((color) => color !== "Multicolor")) return explicit;

  const garment = title
    .replace(/\b(?:blue\s+bell|black\s+label|red\s+(?:kap|head|wing)|green\s+label|white\s+label|brown(?:ing)?\s+duck\s+co)\b/gi, "")
    .replace(/\b(?:black|white|red|orange|blue|green|yellow)\s+(?:tab|tag|label)\b/gi, "")
    .replace(/\b(?:black|white|red|orange|blue|green|yellow|brown|tan|khaki|navy|grey|gray)\s+(?:elbow\s+patch(?:es)?|(?:flannel|fleece|sherpa|quilted)\s+lin(?:ing|ed))\b/gi, "");
  const inferred = find(garment);
  const colors = new Set([...explicit, ...inferred]);
  return Array.from(colors);
}
