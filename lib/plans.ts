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
    description: "We review what customers need to find and recommend the most useful page before you pay for a build.",
    limit: "No payment required",
    billingPeriod: "",
    features: [
      { label: "What customers need", detail: "We identify the answers and actions customers should be able to find quickly." },
      { label: "What you already have", detail: "We review the current website, menu, social page, or Google profile link if one exists." },
      { label: "What is missing", detail: "We flag important hours, photos, pricing, services, ordering links, or quote details that still need attention." },
      { label: "A clear next step", detail: "You get a plain recommendation before deciding whether to start Launch." }
    ],
    cta: "Get a Free Page Plan",
    checkoutUrl: "/checkout?plan=review",
    paymentMode: "none"
  },
  {
    id: "setup",
    name: "Launch",
    price: "$399",
    description: "The one-time build that gives customers one clear place for the information and next steps they need.",
    limit: "Required setup",
    billingPeriod: "",
    features: [
      { label: "One clear customer page", detail: "A mobile-first page shaped around what customers need from your business." },
      { label: "Menu or service structure", detail: "Food menus, service categories, packages, pricing notes, specials, photos, and next-step buttons are organized for scanning." },
      { label: "Core business details", detail: "Hours, service area or location, contact links, ordering, booking, quote, social, and review links are placed clearly." },
      { label: "One link to share", detail: "A customer-ready URL for QR codes, counters, trucks, signs, texts, profiles, and printed materials." },
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
    description: "Keep the approved page live, secure, and technically maintained. Content changes are handled separately.",
    limit: "Keep the page live",
    billingPeriod: "mo",
    features: [
      { label: "Webpage hosting", detail: "Keeps one approved customer webpage available at its public Resonate link." },
      { label: "SSL", detail: "Keeps the hosted page served over a secure HTTPS connection." },
      { label: "Routine technical maintenance", detail: "Covers routine upkeep needed to keep the approved page available." },
      { label: "Basic uptime monitoring", detail: "Includes basic checks that the hosted page remains available." },
      { label: "Content updates not included", detail: "Text, photo, hours, menu, and service changes are handled through Managed Page or scoped separately." }
    ],
    cta: "Start Launch + Hosting",
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
    description: "For owners who want updates at their fingertips. Use the Resonate app to request changes, share details, track status, and get confirmation when your page is current.",
    limit: "Resonate app access included",
    billingPeriod: "mo",
    features: [
      { label: "Hosting included", detail: "Includes hosting, SSL, routine technical maintenance, and basic uptime monitoring." },
      { label: "Resonate app access", detail: "Submit update requests, add notes or files, and see request status from one owner-friendly place." },
      { label: "Standard updates when things change", detail: "Request standard updates whenever your business changes. Resonate reviews the change, updates your page, and confirms when it’s complete." },
      { label: "Monthly page review", detail: "Resonate reviews the page each month for obvious content and presentation issues." },
      { label: "Routine content updates", detail: "Includes supplied text, photo, hours, menu, and service updates." },
      { label: "Priority turnaround", detail: "Supported Managed Page updates are handled ahead of hosting-only support." },
      { label: "Basic link and page-health checks", detail: "Includes basic checks of important links and the customer-facing page." }
    ],
    cta: "Start Launch + Managed Page",
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
  description: "Build the approved customer page and keep it live with simple monthly hosting.",
  limit: "$399 once + $17.99 monthly",
  billingPeriod: "first payment",
  features: [
    { label: "Launch", detail: "A one-time $399 custom page build included on the first Stripe invoice." },
    { label: "Webpage Hosting", detail: "$17.99 is charged today and renews monthly after launch." }
  ],
  cta: "Start Launch + Hosting",
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
  description: "Build the approved customer page, include hosting, and give you Resonate app access for update requests and status tracking.",
  limit: "$399 once + $79.99 monthly",
  billingPeriod: "first payment",
  features: [
    { label: "Launch", detail: "A one-time $399 custom page build included on the first Stripe invoice." },
    { label: "Managed Page", detail: "$79.99 is charged today and renews monthly after launch. Hosting is included." }
  ],
  cta: "Start Launch + Managed Page",
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
