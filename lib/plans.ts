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
    id: "audit",
    name: "Free Menu Review",
    price: "$0",
    description: "A quick review for a local business that wants to know what customers cannot find before paying monthly.",
    limit: "Free discovery review",
    billingPeriod: "",
    features: [
      { label: "Menu and link check", detail: "I look at what a customer can actually find right now: menu, address, ordering, hours, and social links." },
      { label: "Google profile notes", detail: "Basic notes on whether the business profile sends people to the right place." },
      { label: "Photo gap notes", detail: "A quick read on whether the food, space, or service needs better visual proof." },
      { label: "Plain next step", detail: "A simple recommendation for what would make the menu easier for customers to use." }
    ],
    cta: "Request Free Review",
    checkoutUrl: "/menupilot",
    paymentMode: "none"
  },
  {
    id: "core",
    name: "MenuPilot Starter",
    price: "$49",
    description: "For very small trucks and popups that want a clean branded menu page and mostly manage updates themselves.",
    limit: "$199 setup fee",
    billingPeriod: "mo",
    features: [
      { label: "Custom branded menu page", detail: "A mobile-first page using the business logo, colors, menu, food photos, hours, location, and order links." },
      { label: "Hours, location, menu, and photos", detail: "The essential customer details live in one clean place instead of scattered posts and old screenshots." },
      { label: "Clover/order link", detail: "MenuPilot does not replace checkout. It sends ready customers to Clover or another ordering link." },
      { label: "QR code", detail: "One QR link for the truck, counter, social profiles, printed cards, and signs." },
      { label: "Mobile-first page", detail: "Built for customers checking late at night or from a parking lot before they drive over." },
      { label: "Basic update switches", detail: "Starter includes simple switches for open today, closed today, special hours, and moved location." },
      { label: "Email support", detail: "Questions and basic support go through questions@resonate.solutions." }
    ],
    cta: "Choose Starter",
    checkoutUrl: "/checkout?plan=core",
    stripePriceEnvKey: "STRIPE_PRICE_CORE",
    paymentMode: "subscription"
  },
  {
    id: "plus",
    name: "MenuPilot Plus",
    price: "$99",
    description: "The main offer for food trucks and small restaurants that want the page plus easy daily update tools.",
    limit: "$299 setup fee",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Starter", detail: "Includes the branded menu page, QR code, order link, photos, hours, location, mobile layout, and email support." },
      { label: "More update switches", detail: "Turn on closed early, sold out, happy hour, daily special, popup menu, and changed location notices when customers need to know." },
      { label: "Best sellers and local favorites", detail: "Guide people toward the items they should try first instead of making every item compete equally." },
      { label: "Monthly page checkup", detail: "A recurring look at the page so stale details, weak labels, and broken links do not sit untouched." },
      { label: "Link placement help", detail: "I place the ordering, maps, phone, social, and review links you already have so customers know where to go next." }
    ],
    cta: "Choose Plus",
    highlighted: true,
    checkoutUrl: "/checkout?plan=plus",
    stripePriceEnvKey: "STRIPE_PRICE_PLUS",
    paymentMode: "subscription"
  },
  {
    id: "design",
    name: "Custom Design Buildout",
    price: "$499",
    description: "A one-time deeper setup for businesses that want help shaping the look, photos, page sections, and launch details before monthly service starts.",
    limit: "$499 setup fee",
    billingPeriod: "",
    features: [
      { label: "Brand direction", detail: "We shape the menu page around the business colors, logo, voice, food style, and customer experience." },
      { label: "Menu page layout", detail: "I organize the page sections, favorites, photos, QR code, location, hours, and ordering path." },
      { label: "Photo and copy cleanup", detail: "I crop supplied photos, tighten labels, and make the menu easier to scan." },
      { label: "Launch checklist", detail: "We check the page on phone and desktop before sharing the QR code or link publicly." }
    ],
    cta: "Ask About Buildout",
    checkoutUrl: "/checkout?plan=design",
    stripePriceEnvKey: "STRIPE_PRICE_DESIGN",
    paymentMode: "payment"
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}
