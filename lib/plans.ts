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
      { label: "Plan recommendation", detail: "A plain recommendation for whether you should update the page yourself or have Resonate handle updates." }
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
      { label: "Basic update switches", detail: "Starter includes simple switches for routine messages like open, closed, or special hours." },
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
      { label: "Specials and status updates", detail: "Turn on closed early, sold out, happy hour, popup menu, and changed location notices when customers need to know." },
      { label: "Best sellers and local favorites", detail: "Guide people toward the items they should try first instead of making every item compete equally." },
      { label: "Monthly page checkup", detail: "A recurring look at the page so stale details, weak labels, and broken links do not sit untouched." },
      { label: "Google, Clover, and social link help", detail: "Help connecting the public page to the profiles and order links customers already use." }
    ],
    cta: "Choose Plus",
    highlighted: true,
    checkoutUrl: "/checkout?plan=plus",
    stripePriceEnvKey: "STRIPE_PRICE_PLUS",
    paymentMode: "subscription"
  },
  {
    id: "managed",
    name: "Resonate Managed",
    price: "$299",
    description: "For owners who want the page kept fresh without logging in or chasing menu details.",
    limit: "$499 setup fee",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Plus", detail: "You still get the custom page, QR link, action buttons, update tools, monthly polish, and mobile-first customer menu." },
      { label: "Resonate handles updates", detail: "Send changes by email or message and I update hours, specials, popup menus, photos, and visible page details for you." },
      { label: "Weekly menu page check", detail: "I check that the public page still reflects what customers need to know that week." },
      { label: "Specials and event support", detail: "Happy Hour, Fry Day, 2 for $22, popup days, weather closures, and sold-out notices can be surfaced quickly." },
      { label: "Photo swaps and light cleanup", detail: "I can replace weak item images, crop better photos, and keep the page looking intentional." },
      { label: "Priority support", detail: "This is priced for higher-touch service so urgent changes are not treated like casual favors." }
    ],
    cta: "Choose Resonate Managed",
    checkoutUrl: "/checkout?plan=managed",
    stripePriceEnvKey: "STRIPE_PRICE_MANAGED",
    paymentMode: "subscription"
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}
