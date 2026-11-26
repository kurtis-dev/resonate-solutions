import type { ListingInput } from "./listing-model";

const modern = /\b(?:reissue|reproduction|replica|vintage[- ]style|retro[- ]inspired|lvc|levi'?s vintage clothing|ll bean signature|unite here)\b/i;
const old = /\b(?:pre[- ]?1999|(?:19)?[4-8]0s|(?:early|mid)[ -](?:19)?90s|(?:year manufactured:|from|dated|made in|circa|c\.)\s*(?:19[4-8]\d|199[0-8]))\b/i;
const sometime90s = /\b(?:1990s|90s)\b/i;
const newer = /\b(?:(?:year manufactured:|from|dated|made in|circa)\s*(?:1999|20[0-2]\d)|(?:20)?00s|2010s|2020s|y2k)\b/i;
const historicLabels = /\b(?:actwu|acwa|amalgamated clothing (?:and textile )?workers|gimbels|(?:made in|country of origin:)\s*(?:west germany|czechoslovakia|u\.?s\.?s\.?r\.?))\b/i;
const durableFabric = /\b(?:duck(?: canvas)?|canvas|denim|chamois|sateen|moleskin|melton|twill|herringbone|wool whipcord|heavy[- ]?weight|heavy cotton|heavy flannel)\b/i;
const durableBuild = /\b(?:double[- ]knee|reinforced|bar[- ]?tack|flat[- ]?fell(?:ed)?|felled seams|triple[- ]stitched|gusset(?:ed)?|riveted|blanket[- ]lined|flannel[- ]lined)\b/i;
const synthetic = /\b(?:polyester|poly[- ]?cotton|cotton[- ]poly|poly blend|nylon|acrylic|spandex|elastane|synthetic)\b/i;
const light = /\b(?:light[- ]?weight|thin fabric|sheer|performance|moisture[- ]wicking|quick[- ]dry)\b/i;
const lining = /\b(?:lining|liner|fill|padding|insulation)\s*[:=-]\s*(?:(?!\b(?:shell|outer(?: fabric| material)?|body)\s*[:=-])[^\n;])*/gi;
const liningMaterial = /\b(?:\d{1,3}\s*%\s*)?(?:cotton|wool|polyester|nylon|acrylic|synthetic)(?:[- ](?:blend|flannel|fleece|twill))?[- ](?:lining|liner|fill|padding|insulation|lined)\b|\b(?:lined|padded)\s+with\s+(?:\d{1,3}\s*%\s*)?(?:cotton|wool|polyester|nylon|acrylic|synthetic)\b/gi;
const canvas = /\b(?:canvas|duck(?!\s+head\b|\s+camo\b))\b/i;

export function vintageSignals({ title, description }: Pick<ListingInput, "title" | "description">) {
  const text = [title, description].filter(Boolean).join("\n").replace(/[’‘]/g, "'");
  const shell = text.replace(lining, "").replace(liningMaterial, "").replace(/\b(?:lining|liner|fill|padding|insulation)\s+(?:\d{1,3}\s*%\s*)?(?:cotton|wool|polyester|nylon|acrylic|synthetic)\b/gi, "");
  const substantial = durableFabric.test(shell) || durableBuild.test(text);
  const blend = synthetic.test(shell);
  const pureSynthetic = /\b100\s*%\s*(?:polyester|nylon|acrylic)\b/i.test(shell);
  const mixedFibers = blend || /\b(?:blend(?:ed)?|mixed[- ]fiber)\b/i.test(shell);
  const natural = /\b(?:100\s*%\s*(?:cotton|wool)|pure wool|all wool)\b/i.test(shell) && !mixedFibers;
  const cotton = !mixedFibers && /\bcotton\b/i.test(shell);
  const wool = !mixedFibers && /\bwool\b/i.test(shell);
  const period = modern.test(text) || newer.test(text) ? -2 : old.test(text) || historicLabels.test(text) ? 2 : sometime90s.test(text) ? 1 : 0;
  const build = pureSynthetic || (blend && (light.test(shell) || !substantial)) ? -2 : substantial && (natural || durableBuild.test(shell)) ? 2 : substantial || natural ? 1 : 0;
  const eraNote = period < 0 ? "Listing wording points to a newer garment or reissue."
    : period === 2 ? (old.test(text) ? "Seller date language points to before 1999. Check the label photos." : "A period label or origin is mentioned. Check the actual tag and garment.")
    : period === 1 ? "Seller mentions the 1990s. The exact year is open."
    : "Garment date is open.";
  const fabricNote = natural ? "Listing states 100% cotton or wool."
    : mixedFibers && substantial && build > 0 ? "Listing describes a blend with a substantial fabric or reinforced build."
    : cotton || wool ? `Listing mentions ${cotton && wool ? "cotton and wool" : cotton ? "cotton" : "wool"} in the shell. Check the fiber tag for percentages.`
    : substantial ? "Listing mentions a substantial fabric or reinforced construction."
    : null;
  return { period, build, natural, eraNote, fabricNote, cotton, wool, sturdyBlend: mixedFibers && substantial && !pureSynthetic && !light.test(shell), canvas: canvas.test(shell) };
}

export function listingMeasurements(description = "") {
  return Array.from(description.matchAll(/\b(chest\s*\(pit[- ]to[- ]pit\)|pit[- ]to[- ]pit|chest(?: width| size)?|(?:back |body )?length\s*\(shoulder[- ]to[- ]hem\)|back length|body length|sleeve(?: length)?|shoulder(?: width)?|(?:flat )?waist(?: laid flat| size)?|inseam|front rise|leg opening)\s*(?::|=|-|is)?\s*(\d{1,3}(?:\.\d+|[ ]+\d\/\d|[½¼¾])?)\s*(inches|inch|in\b|cm\b|["″])(?=$|[\s,.;)])/gi), ([, part, value, unit]) =>
    `${part[0].toUpperCase()}${part.slice(1).toLowerCase()} ${value} ${unit.toLowerCase() === "cm" ? "cm" : "in"}`,
  ).filter((value, index, values) => values.indexOf(value) === index).slice(0, 8);
}
