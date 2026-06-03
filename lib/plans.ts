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
  paymentMode: "none" | "payment" | "subscription";
};

export const plans: Plan[] = [
  {
    id: "review",
    name: "Free Fit Check",
    price: "$0",
    description: "A quick review to understand whether you need a food menu, service list, or simple business page before you pay.",
    limit: "No payment required",
    billingPeriod: "",
    features: [
      { label: "Need fit", detail: "We identify whether the first project is a menu, services list, business page, or a combination." },
      { label: "Current link review", detail: "We look at the current website, menu, social page, or Google profile link if one exists." },
      { label: "Missing content notes", detail: "We flag the basics needed before build: photos, menu items, service list, hours, links, and contact details." },
      { label: "Recommended next step", detail: "You get a plain recommendation for the setup and monthly option that fits the business." }
    ],
    cta: "Request Fit Check",
    checkoutUrl: "/menupilot",
    paymentMode: "none"
  },
  {
    id: "setup",
    name: "Page/Menu Build",
    price: "$399",
    description: "The required one-time setup to turn the business details into a polished page, food menu, service list, or combined customer page.",
    limit: "One-time setup",
    billingPeriod: "",
    features: [
      { label: "Custom business page", detail: "A mobile-first page shaped around the business, not a generic template." },
      { label: "Menu or service structure", detail: "Food menus, service categories, packages, pricing notes, specials, photos, and next-step buttons are organized for scanning." },
      { label: "Core business details", detail: "Hours, service area or location, contact links, ordering, booking, quote, social, and review links are placed clearly." },
      { label: "QR-ready public link", detail: "One customer-ready URL for QR codes, counters, trucks, signs, texts, profiles, and printed materials." },
      { label: "Launch check", detail: "We review the page on phone and desktop before it is shared publicly." }
    ],
    cta: "Start Setup",
    highlighted: true,
    checkoutUrl: "/checkout?plan=setup",
    stripePriceEnvKey: "STRIPE_PRICE_SETUP",
    paymentMode: "payment"
  },
  {
    id: "care",
    name: "Care Plan",
    price: "$79",
    description: "For businesses that want the page kept current after launch without paying for a rebuild every time small details change.",
    limit: "After setup",
    billingPeriod: "mo",
    features: [
      { label: "Hosting and page care", detail: "The page stays available and Resonate remains the place to request changes." },
      { label: "Two update requests per month", detail: "Good for hours, links, small menu/service edits, price note changes, and photo swaps." },
      { label: "Monthly link check", detail: "We check the main call, map, booking, order, quote, and social/profile links." },
      { label: "Email support", detail: "Simple support for page questions and update requests." }
    ],
    cta: "Choose Care",
    checkoutUrl: "/checkout?plan=care",
    stripePriceEnvKey: "STRIPE_PRICE_CORE",
    paymentMode: "subscription"
  },
  {
    id: "care-plus",
    name: "Care Plus",
    price: "$149",
    description: "For restaurants, food trucks, and service businesses that change more often and want priority help keeping the page useful.",
    limit: "After setup",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Care", detail: "Includes hosting, link checks, update handling, and page support." },
      { label: "Eight update requests per month", detail: "Useful for specials, seasonal menus, service changes, sold-out items, availability, and featured offers." },
      { label: "Monthly page polish", detail: "A recurring pass to improve labels, ordering, photos, and the customer path." },
      { label: "Priority turnaround", detail: "Update requests are treated ahead of standard care requests when the page needs to stay current." },
      { label: "Menu/service refresh help", detail: "We help reorganize supplied menu or service updates so customers can understand them quickly." }
    ],
    cta: "Choose Care Plus",
    checkoutUrl: "/checkout?plan=care-plus",
    stripePriceEnvKey: "STRIPE_PRICE_PLUS",
    paymentMode: "subscription"
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}
