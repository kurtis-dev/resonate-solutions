export const productStyles = [
  {
    name: "Soft enamel pin",
    cardTitle: "Soft enamel pin",
    shortName: "Soft enamel",
    image: "/assets/excellent-pins/lovable/pin-soft-enamel.jpg",
    imageFit: "cover",
    accent: "#c92f2f",
    summary: "Raised metal lines with recessed enamel color.",
    goodFor: "Brand merch, community runs, fan pins.",
    affects: "Color count, plating, size, quantity.",
    quoteNote: "Good when you want bold color, clear metal lines, and a traditional custom pin feel."
  },
  {
    name: "Hard enamel pin",
    cardTitle: "Hard enamel pin",
    shortName: "Hard enamel",
    image: "/assets/excellent-pins/lovable/pin-hard-enamel.jpg",
    imageFit: "cover",
    accent: "#173866",
    summary: "Smooth, polished color that sits flush with the metal.",
    goodFor: "Corporate, awards, professional gifts.",
    affects: "Polish, plating, detail tolerance.",
    quoteNote: "Good when you want a smoother finish and a more polished final piece."
  },
  {
    name: "Die struck pin",
    cardTitle: "Die struck pin",
    shortName: "Die struck",
    image: "/assets/excellent-pins/lovable/pin-die-struck.jpg",
    imageFit: "cover",
    accent: "#d7a83d",
    summary: "Metal-only relief with raised and recessed detail.",
    goodFor: "Heritage marks, formal insignia, antique looks.",
    affects: "Antique finish, depth of die, weight.",
    quoteNote: "Good when color is not needed and the design can be carried by the metal shape."
  },
  {
    name: "Printed pin",
    cardTitle: "Printed pin",
    shortName: "Printed",
    image: "/assets/excellent-pins/lovable-page/printed-pin.png",
    imageFit: "cover",
    accent: "#173866",
    summary: "Full-color printed artwork under a clear epoxy dome - gradients and fine detail.",
    goodFor: "Photographs, illustrations, detailed logos.",
    affects: "Print resolution, dome, shape.",
    quoteNote: "Good when the artwork has fine detail that would not work well as separated enamel colors."
  },
  {
    name: "Medal",
    cardTitle: "Medal",
    shortName: "Medal",
    image: "/assets/excellent-pins/lovable-page/medal.png",
    imageFit: "cover",
    accent: "#c92f2f",
    summary: "Award or recognition piece with a woven ribbon - worn around the neck.",
    goodFor: "Sports, ceremonies, service recognition.",
    affects: "Size, ribbon, plating, packaging.",
    quoteNote: "Good when the item is worn or presented as an award instead of a small lapel pin."
  },
  {
    name: "Novelty coin",
    cardTitle: "Novelty coin",
    shortName: "Novelty coin",
    image: "/assets/excellent-pins/lovable-page/novelty-coin.png",
    imageFit: "cover",
    accent: "#d7a83d",
    summary: "Substantial two-sided keepsake coin - a heavier, collectible feel.",
    goodFor: "Challenge coins, commemoratives, gifts.",
    affects: "Diameter, thickness, two-tone plating, edge cut.",
    quoteNote: "Good when the piece should feel substantial, collectible, or display-worthy."
  },
  {
    name: "Badge or nameplate",
    cardTitle: "Badge or nameplate",
    shortName: "Badge/nameplate",
    image: "/assets/excellent-pins/lovable-page/badge-nameplate.png",
    imageFit: "cover",
    accent: "#173866",
    summary: "Flat rectangular or shield-style badge for ID and organizational use.",
    goodFor: "Staff, hospitality, service, conferences.",
    affects: "Backing (magnet/pin), engraving vs print, runs.",
    quoteNote: "Good when the item needs to identify a person, role, organization, award, or branded display."
  },
  {
    name: "Keychain",
    cardTitle: "Keychain",
    shortName: "Keychain",
    image: "/assets/excellent-pins/lovable-page/keychain.png",
    imageFit: "cover",
    accent: "#173866",
    summary: "Custom metal charm on a split ring - carried, not worn.",
    goodFor: "Giveaways, merch, member keepsakes.",
    affects: "Metal, fill style, ring hardware, weight.",
    quoteNote: "Good when the same custom artwork should be carried, sold, or handed out instead of worn."
  },
  {
    name: "Other / not sure",
    cardTitle: "Not sure yet",
    shortName: "Not sure",
    image: "/assets/excellent-pins/lovable-page/not-sure-finishes.png",
    imageFit: "cover",
    accent: "#c92f2f",
    summary: "Compare plating options - gold, nickel silver, black nickel, antique brass.",
    goodFor: "Undecided on style - we'll recommend based on your artwork.",
    affects: "We'll walk through finish, fill and format with you.",
    quoteNote: "Send what you know. Excellent Pins can recommend the practical product type, finish, backing, and quote path."
  }
];

export type ProductStyle = (typeof productStyles)[number];
