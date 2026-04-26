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

function contactLine(includeContactOffer?: boolean) {
  if (!includeContactOffer) return "";
  return " If you would like to share anything else, please contact our team directly so we can help.";
}

function signoff(managerName?: string) {
  return managerName ? `\n\n- ${managerName}` : "";
}

export function generatePlaceholderReplies(input: ReplyInput) {
  const business = input.businessName || "our business";
  const type = input.businessType || "team";
  const stars = Number(input.starRating);
  const positive = stars >= 4;
  const neutral = stars === 3;
  const openers = toneOpeners[input.tone];

  const reviewMention = input.reviewText.trim()
    ? "Your comments help us understand what matters most to our customers."
    : "Your feedback helps us keep improving.";

  const optionOne = positive
    ? `${openers[0]} We are glad to hear you had a positive experience with ${business}. Our ${type} works hard to deliver helpful, reliable service, and your support means a lot.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : `${openers[0]} We are sorry to hear that your experience with ${business} was not what you expected. ${reviewMention} We will review this with our team and look for ways to do better.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`;

  const optionTwo = neutral
    ? `${openers[1]} We appreciate the balanced feedback about ${business}. We are always looking for ways to improve the experience for our customers, and your review gives us useful direction.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : `${openers[1]} ${positive ? "It is great to know our team made a good impression." : "We understand how frustrating that must have been."} Thank you for giving ${business} the opportunity to learn from your experience.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`;

  const optionThree = input.tone === "short"
    ? `${openers[2]} We appreciate you choosing ${business} and sharing your experience.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`
    : `${openers[2]} Feedback like yours helps ${business} continue improving as a ${type}. We appreciate the opportunity to serve you and hope to provide an even better experience next time.${contactLine(input.includeContactOffer)}${signoff(input.managerName)}`;

  return [optionOne, optionTwo, optionThree];
}
