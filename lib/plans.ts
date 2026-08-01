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
  stripePrices?: Array<{
    envKey: string;
    fallbackPriceId?: string;
  }>;
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
    stripePrices: [{ envKey: "STRIPE_PRICE_SETUP" }],
    stripePaymentLinkEnvKey: "STRIPE_PAYMENT_LINK_SETUP",
    paymentMode: "payment"
  },
  {
    id: "hosting",
    name: "Webpage Hosting",
    price: "$17.99",
    description: "Reliable hosting and routine platform care for a live customer webpage, without content updates.",
    limit: "Monthly hosting",
    billingPeriod: "mo",
    features: [
      { label: "Webpage hosting", detail: "Keeps one approved customer webpage available at its public Resonate link." },
      { label: "SSL", detail: "Keeps the hosted page served over a secure HTTPS connection." },
      { label: "Routine platform maintenance", detail: "Covers routine upkeep of the hosting platform and production delivery." },
      { label: "Basic uptime monitoring", detail: "Includes basic checks that the hosted page remains available." },
      { label: "No content updates", detail: "Text, photo, hours, menu, and service changes are not included in this plan." }
    ],
    cta: "Choose Launch + Hosting",
    checkoutUrl: "/checkout?plan=launch-hosting",
    stripePrices: [
      {
        envKey: "STRIPE_PRICE_HOSTING",
        fallbackPriceId: "price_1Tz7OmCXtuHVAwMwLgZcnUdy"
      }
    ],
    paymentMode: "subscription"
  },
  {
    id: "managed-page",
    name: "Managed Page",
    price: "$79.99",
    description: "Hosting plus a clear monthly update allowance for businesses that want Resonate to keep their page current.",
    limit: "Hosting + monthly updates",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Webpage Hosting", detail: "Includes hosting, SSL, routine platform maintenance, and basic uptime monitoring." },
      { label: "Up to 4 standard update requests", detail: "Four standard page-update requests are included each month." },
      { label: "Monthly page review", detail: "Resonate reviews the page each month for obvious content and presentation issues." },
      { label: "Common content updates", detail: "Includes supplied text, photo, hours, menu, and service updates." },
      { label: "Priority turnaround", detail: "Standard update requests are handled ahead of hosting-only requests." },
      { label: "Basic link and page-health checks", detail: "Includes basic checks of important links and the customer-facing page." }
    ],
    cta: "Choose Launch + Managed Page",
    checkoutUrl: "/checkout?plan=launch-managed-page",
    stripePrices: [
      {
        envKey: "STRIPE_PRICE_MANAGED_PAGE",
        fallbackPriceId: "price_1TzSrPCXtuHVAwMwdtSFQBZe"
      }
    ],
    paymentMode: "subscription"
  }
];

const launchHostingPlan: Plan = {
  id: "launch-hosting",
  name: "Launch + Webpage Hosting",
  price: "$416.99",
  description: "Launch your customer page and keep it hosted through one secure Stripe checkout.",
  limit: "$399 once + $17.99 monthly",
  billingPeriod: "first payment",
  features: [
    { label: "Launch", detail: "A one-time $399 custom page build included on the first Stripe invoice." },
    { label: "Webpage Hosting", detail: "$17.99 is charged today and renews monthly after launch." }
  ],
  cta: "Pay Launch + Hosting",
  checkoutUrl: "/checkout?plan=launch-hosting",
  stripePrices: [
    { envKey: "STRIPE_PRICE_SETUP" },
    {
      envKey: "STRIPE_PRICE_HOSTING",
      fallbackPriceId: "price_1Tz7OmCXtuHVAwMwLgZcnUdy"
    }
  ],
  paymentMode: "subscription"
};

const launchManagedPagePlan: Plan = {
  id: "launch-managed-page",
  name: "Launch + Managed Page",
  price: "$478.99",
  description: "Launch your customer page with hosting and ongoing monthly updates through one secure Stripe checkout.",
  limit: "$399 once + $79.99 monthly",
  billingPeriod: "first payment",
  features: [
    { label: "Launch", detail: "A one-time $399 custom page build included on the first Stripe invoice." },
    { label: "Managed Page", detail: "$79.99 is charged today and renews monthly after launch. Hosting is included." }
  ],
  cta: "Pay Launch + Managed Page",
  checkoutUrl: "/checkout?plan=launch-managed-page",
  stripePrices: [
    { envKey: "STRIPE_PRICE_SETUP" },
    {
      envKey: "STRIPE_PRICE_MANAGED_PAGE",
      fallbackPriceId: "price_1TzSrPCXtuHVAwMwdtSFQBZe"
    }
  ],
  paymentMode: "subscription"
};

export function getPlanById(id: string) {
  if (id === launchHostingPlan.id) return launchHostingPlan;
  if (id === launchManagedPagePlan.id) return launchManagedPagePlan;
  return plans.find((plan) => plan.id === id);
}

export function getConfiguredStripePriceIds(plan: Plan) {
  return (plan.stripePrices || []).map(({ envKey, fallbackPriceId }) => process.env[envKey] || fallbackPriceId || "");
}

export function getConfiguredPaymentLink(plan: Plan) {
  return plan.stripePaymentLinkEnvKey ? process.env[plan.stripePaymentLinkEnvKey] || "" : "";
}
