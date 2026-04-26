export type ReplyInput = {
  businessName: string;
  businessType: string;
  reviewText: string;
  starRating: string;
  tone: "professional" | "warm" | "apologetic" | "short" | "friendly";
  managerName?: string;
  includeContactOffer?: boolean;
};

const toneOpeners: Record<ReplyInput["tone"], string[]> = {
  professional: ["Thank you for sharing your feedback.", "We appreciate you taking the time to leave a review.", "Thank you for reviewing us."],
  warm: ["Thank you so much for your thoughtful review.", "We truly appreciate your kind feedback.", "Thanks for taking a moment to share this with us."],
  apologetic: ["Thank you for bringing this to our attention.", "We are sorry your experience did not meet expectations.", "Thank you for your honest feedback."],
  short: ["Thanks for your review.", "Thank you for the feedback.", "We appreciate your review."],
  friendly: ["Thanks so much for sharing this.", "We are happy you reached out with your review.", "Thanks for taking the time to review us."]
};

function naturalBusinessType(rawType: string) {
  const normalized = rawType.trim().toLowerCase();
  const map: Record<string, string> = {
    coffee: "coffee shop",
    cafe: "cafe",
    restaurant: "restaurant",
    bar: "bar",
    salon: "salon",
    spa: "spa",
    "med spa": "med spa",
    dentist: "dental office",
    dental: "dental office",
    hotel: "hotel",
    contractor: "service business",
    plumbing: "plumbing company",
    plumber: "plumbing company",
    hvac: "HVAC company",
    electrician: "electrical company",
    auto: "auto shop",
    "auto repair": "auto repair shop"
  };

  return map[normalized] || normalized || "local business";
}

function serviceContext(type: string) {
  if (["coffee shop", "cafe"].includes(type)) return "drink quality and guest experience";
  if (type.includes("restaurant") || type === "bar") return "food, service, and guest experience";
  if (type.includes("dental")) return "patient experience";
  if (type.includes("hotel")) return "guest experience";
  if (type.includes("salon") || type.includes("spa")) return "client experience";
  if (type.includes("auto")) return "service experience";
  return "customer experience";
}

function complaintFocus(reviewText: string) {
  const review = reviewText.toLowerCase();
  const issues = [];

  if (review.includes("sugar") || review.includes("sweet")) issues.push("the drink preparation");
  if (review.includes("wait") || review.includes("forever") || review.includes("slow")) issues.push("the wait time");
  if (review.includes("rude") || review.includes("manager") || review.includes("staff")) issues.push("the service interaction");
  if (review.includes("cold") || review.includes("burnt") || review.includes("flavor") || review.includes("taste")) issues.push("the product quality");
  if (review.includes("dirty") || review.includes("clean")) issues.push("the cleanliness concern");

  if (!issues.length) return "the concern you described";
  return Array.from(new Set(issues)).slice(0, 2).join(" and ");
}

function contactLine(includeContactOffer?: boolean) {
  if (!includeContactOffer) return "";
  return " If you would like to share anything else, please contact our team directly so we can help.";
}

function signoff(managerName?: string) {
  return managerName ? `\n\n- ${managerName}` : "";
}

export function generatePlaceholderReplies(input: ReplyInput) {
  const business = input.businessName || "our business";
  const type = naturalBusinessType(input.businessType);
  const context = serviceContext(type);
  const focus = complaintFocus(input.reviewText);
  const stars = Number(input.starRating);
  const positive = stars >= 4;
  const neutral = stars === 3;
  const negative = stars <= 2;
  const openers = toneOpeners[input.tone];

  const optionOne = positive
    ? `${openers[0]} We are glad to hear you had a positive experience with ${business}. Our ${type} team works hard to deliver a great ${context}, and your support means a lot.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : `${openers[0]} We are sorry to hear that your experience with ${business} was not what you expected. We will review ${focus} with our team and look for ways to do better.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`;

  const optionTwo = negative
    ? `${openers[1]} We understand how frustrating that must have been, especially when ${focus} did not meet expectations. Thank you for giving ${business} the opportunity to learn from your experience.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : neutral
    ? `${openers[1]} We appreciate the balanced feedback about ${business}. We are always looking for ways to improve the experience for our customers, and your review gives us useful direction.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : `${openers[1]} ${positive ? "It is great to know our team made a good impression." : "We understand how frustrating that must have been."} Thank you for giving ${business} the opportunity to learn from your experience.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`;

  const optionThree = negative
    ? `${openers[2]} We appreciate you letting us know about ${focus}. This is useful feedback for our ${type}, and we will use it to improve the ${context}.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : input.tone === "short"
    ? `${openers[2]} We appreciate you choosing ${business} and sharing your experience.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : `${openers[2]} Feedback like yours helps ${business} keep improving the ${context}. We appreciate the opportunity to serve you and hope to provide an even better experience next time.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`;

  return [optionOne, optionTwo, optionThree];
}
