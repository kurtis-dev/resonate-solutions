export type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
  limit: string;
  billingPeriod: string;
  features: Array<{
    label: string;
    detail: string;
  }>;
  cta: string;
  highlighted?: boolean;
  checkoutUrl: string;
  stripePriceEnvKey?: string;
  stripePaymentLinkEnvKey?: string;
  paymentMode: "none" | "payment" | "subscription";
};

export const plans: Plan[] = [
  {
    id: "review",
    name: "Free Page Plan",
    price: "$0",
    description: "A clear recommendation for the MenuPilot page, menu, or services list your business needs before you pay for a custom build.",
    limit: "No payment required",
    billingPeriod: "",
    features: [
      { label: "MenuPilot recommendation", detail: "We identify whether the first project is a menu, services list, business page, or a combination." },
      { label: "Current link review", detail: "We look at the current website, menu, social page, or Google profile link if one exists." },
      { label: "Missing content notes", detail: "We flag the basics needed before build: photos, menu items, service list, hours, links, and contact details." },
      { label: "Recommended next step", detail: "You get a plain recommendation for Launch and any monthly care that fits the business." }
    ],
    cta: "Request Free Page Plan",
    checkoutUrl: "/checkout?plan=review",
    paymentMode: "none"
  },
  {
    id: "setup",
    name: "Launch",
    price: "$399",
    description: "The required one-time build that turns the approved MenuPilot plan into a polished page, food menu, services list, or combined customer page.",
    limit: "Required setup",
    billingPeriod: "",
    features: [
      { label: "Custom business page", detail: "A mobile-first page shaped around the business, not a generic template." },
      { label: "Menu or service structure", detail: "Food menus, service categories, packages, pricing notes, specials, photos, and next-step buttons are organized for scanning." },
      { label: "Core business details", detail: "Hours, service area or location, contact links, ordering, booking, quote, social, and review links are placed clearly." },
      { label: "QR-ready public link", detail: "One customer-ready URL for QR codes, counters, trucks, signs, texts, profiles, and printed materials." },
      { label: "Private preview", detail: "You review the page before it is shared publicly." },
      { label: "Launch check", detail: "We review the page on phone and desktop before the public link is used." }
    ],
    cta: "Start Launch",
    highlighted: true,
    checkoutUrl: "/checkout?plan=setup",
    stripePriceEnvKey: "STRIPE_PRICE_SETUP",
    stripePaymentLinkEnvKey: "STRIPE_PAYMENT_LINK_SETUP",
    paymentMode: "payment"
  },
  {
    id: "care",
    name: "Maintain",
    price: "$79",
    description: "For businesses that want the page kept current after launch without paying for a rebuild every time small details change.",
    limit: "Monthly care",
    billingPeriod: "mo",
    features: [
      { label: "Hosting and page care", detail: "The page stays available and Resonate remains the place to request changes." },
      { label: "Two update requests per month", detail: "Good for hours, links, small menu/service edits, price note changes, and photo swaps." },
      { label: "Monthly link check", detail: "We check the main call, map, booking, order, quote, and social/profile links." },
      { label: "Email support", detail: "Simple support for page questions and update requests." }
    ],
    cta: "Choose Maintain",
    checkoutUrl: "/checkout?plan=care",
    stripePriceEnvKey: "STRIPE_PRICE_CORE",
    stripePaymentLinkEnvKey: "STRIPE_PAYMENT_LINK_CORE",
    paymentMode: "subscription"
  },
  {
    id: "care-plus",
    name: "Managed",
    price: "$149",
    description: "For restaurants, food trucks, and service businesses that change often and want Resonate to keep the page useful without counting every small edit.",
    limit: "Priority monthly care",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Maintain", detail: "Includes hosting, link checks, update handling, and page support." },
      { label: "Unlimited standard updates", detail: "Useful for specials, seasonal menus, service changes, sold-out items, availability, featured offers, hours, links, and small copy/photo swaps. Larger rebuilds are quoted separately." },
      { label: "Monthly page polish", detail: "A recurring pass to improve labels, ordering, photos, and the customer path." },
      { label: "Priority turnaround", detail: "Update requests are treated ahead of standard care requests when the page needs to stay current." },
      { label: "Menu/service refresh help", detail: "We help reorganize supplied menu or service updates so customers can understand them quickly." }
    ],
    cta: "Choose Managed",
    checkoutUrl: "/checkout?plan=care-plus",
    stripePriceEnvKey: "STRIPE_PRICE_PLUS",
    stripePaymentLinkEnvKey: "STRIPE_PAYMENT_LINK_PLUS",
    paymentMode: "subscription"
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}

export function getConfiguredPaymentLink(plan: Plan) {
  return plan.stripePaymentLinkEnvKey ? process.env[plan.stripePaymentLinkEnvKey] || "" : "";
}
