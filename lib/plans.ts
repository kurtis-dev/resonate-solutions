export type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
  limit: string;
  billingPeriod: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  checkoutUrl: string;
  stripePriceEnvKey?: string;
  paymentMode: "none" | "payment" | "subscription";
};

export const plans: Plan[] = [
  {
    id: "audit",
    name: "Mic Check",
    price: "$0",
    description: "A quick fit check for a local business that wants to know what customers cannot find before paying monthly.",
    limit: "Free discovery review",
    billingPeriod: "",
    features: ["Menu and link check", "Google profile notes", "Photo gap notes", "Low/high plan recommendation"],
    cta: "Request Mic Check",
    checkoutUrl: "/menupilot",
    paymentMode: "none"
  },
  {
    id: "core",
    name: "MenuPilot Core",
    price: "$49",
    description: "For owners who need one clean menu page, one QR code, and small monthly edits without managing another platform.",
    limit: "Low monthly plan",
    billingPeriod: "mo",
    features: ["Custom menu page", "QR code", "Ordering, call, and directions links", "Hours and location block", "Up to 2 menu or hours updates each month", "Email support"],
    cta: "Choose Core",
    highlighted: true,
    checkoutUrl: "/checkout?plan=core",
    stripePriceEnvKey: "STRIPE_PRICE_CORE",
    paymentMode: "subscription"
  },
  {
    id: "managed",
    name: "MenuPilot Managed",
    price: "$149",
    description: "For trucks and restaurants that change specials, photos, popups, hours, or locations and want Resonate to keep the public page fresh.",
    limit: "High monthly plan",
    billingPeriod: "mo",
    features: ["Everything in Core", "Up to 8 updates each month", "Specials and sold-out notes", "Popup menu switching", "Photo swaps and light cleanup", "Monthly customer-path check"],
    cta: "Choose Managed",
    checkoutUrl: "/checkout?plan=managed",
    stripePriceEnvKey: "STRIPE_PRICE_MANAGED",
    paymentMode: "subscription"
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}
