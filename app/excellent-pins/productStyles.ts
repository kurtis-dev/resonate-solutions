export const productStyles = [
  {
    name: "Lapel pin",
    cardTitle: "Lapel pin",
    shortName: "Lapel pin",
    image: "/assets/excellent-pins/lovable/pin-soft-enamel.jpg",
    imageFit: "cover",
    accent: "#c92f2f",
    summary: "A custom pin made from your logo, artwork, event design, or organization mark.",
    goodFor: "Brand merch, clubs, events, recognition, fan pins.",
    affects: "Artwork, color, size, quantity, finish.",
    quoteNote: "Choose this if you want a pin people can wear. Excellent Pins can recommend the best pin style after seeing the artwork."
  },
  {
    name: "Medal",
    cardTitle: "Medal",
    shortName: "Medal",
    image: "/assets/excellent-pins/lovable-page/medal.png",
    imageFit: "cover",
    accent: "#c92f2f",
    summary: "An award or recognition piece, often paired with a ribbon.",
    goodFor: "Sports, ceremonies, service recognition.",
    affects: "Size, ribbon, plating, packaging.",
    quoteNote: "Choose this for awards, ceremonies, races, competitions, or recognition pieces."
  },
  {
    name: "Novelty coin",
    cardTitle: "Novelty coin",
    shortName: "Novelty coin",
    image: "/assets/excellent-pins/lovable-page/novelty-coin.png",
    imageFit: "cover",
    accent: "#d7a83d",
    summary: "A heavier keepsake-style metal piece, often made for display or collecting.",
    goodFor: "Challenge coins, commemoratives, gifts.",
    affects: "Diameter, thickness, two-tone plating, edge cut.",
    quoteNote: "Choose this when the item should feel substantial, collectible, or display-worthy."
  },
  {
    name: "Badge or nameplate",
    cardTitle: "Badge or nameplate",
    shortName: "Badge/nameplate",
    image: "/assets/excellent-pins/lovable-page/badge-nameplate.png",
    imageFit: "cover",
    accent: "#173866",
    summary: "A flat or shaped piece for names, roles, teams, organizations, or awards.",
    goodFor: "Staff, hospitality, service, conferences.",
    affects: "Backing, engraving, print, run size.",
    quoteNote: "Choose this for name badges, service badges, recognition plates, or branded organization pieces."
  },
  {
    name: "Keychain",
    cardTitle: "Keychain",
    shortName: "Keychain",
    image: "/assets/excellent-pins/lovable-page/keychain.png",
    imageFit: "cover",
    accent: "#173866",
    summary: "A custom metal charm on a split ring.",
    goodFor: "Giveaways, merch, member keepsakes.",
    affects: "Metal, fill style, ring hardware, weight.",
    quoteNote: "Choose this when the same custom artwork should be carried, sold, or handed out instead of worn."
  },
  {
    name: "Other metal emblem",
    cardTitle: "Other metal emblem",
    shortName: "Other emblem",
    image: "/assets/excellent-pins/lovable/pin-custom-shape.jpg",
    imageFit: "cover",
    accent: "#173866",
    summary: "A custom metal item that is not a standard pin, medal, coin, badge, or keychain.",
    goodFor: "Ornaments, cufflinks, plaques, charms, tags, and unusual shapes.",
    affects: "Shape, size, attachment, finish, intended use.",
    quoteNote: "Choose this for ornaments, cufflinks, plaques, charms, tags, or another custom metal piece."
  },
  {
    name: "Not sure yet",
    cardTitle: "Not sure yet",
    shortName: "Not sure",
    image: "/assets/excellent-pins/lovable-page/not-sure-finishes.png",
    imageFit: "cover",
    accent: "#c92f2f",
    summary: "Describe the result you want and Excellent Pins can recommend the closest option.",
    goodFor: "Early ideas, mixed needs, or artwork that could work several ways.",
    affects: "Excellent Pins will recommend the product type, finish, and quote path.",
    quoteNote: "Choose this if you know what you want the finished item to do, but not what to call it yet."
  }
];

export type ProductStyle = (typeof productStyles)[number];
