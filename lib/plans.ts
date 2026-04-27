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
    name: "Audit",
    price: "$0",
    description: "A quick fit check for a local business that wants to know what customers cannot find.",
    limit: "Free discovery review",
    billingPeriod: "",
    features: ["Menu and link check", "Google profile notes", "Photo gap notes", "Simple next-step plan"],
    cta: "Start audit",
    checkoutUrl: "/menupilot",
    paymentMode: "none"
  },
  {
    id: "launch-kit",
    name: "Launch Kit",
    price: "$299",
    description: "A practical first package for food trucks, pop-ups, coffee shops, and small restaurants.",
    limit: "One-time setup",
    billingPeriod: "setup",
    features: ["Mobile menu page", "QR code", "Basic food or service photos", "Hours and location block", "Google review link", "One revision"],
    cta: "Choose Launch Kit",
    highlighted: true,
    checkoutUrl: "/checkout?plan=launch-kit",
    stripePriceEnvKey: "STRIPE_PRICE_LAUNCH_KIT",
    paymentMode: "payment"
  },
  {
    id: "upkeep",
    name: "Upkeep",
    price: "$49",
    description: "Monthly updates for businesses that change hours, specials, locations, or menu items.",
    limit: "Monthly plan",
    billingPeriod: "mo",
    features: ["Menu updates", "Hours and location updates", "Specials and sold-out notes", "Photo swaps", "Link cleanup"],
    cta: "Choose Upkeep",
    checkoutUrl: "/checkout?plan=upkeep",
    stripePriceEnvKey: "STRIPE_PRICE_UPKEEP",
    paymentMode: "subscription"
  },
  {
    id: "managed",
    name: "Managed Presence",
    price: "$149",
    description: "A more hands-on plan for owners who want Resonate to keep customer-facing info fresh.",
    limit: "Monthly service",
    billingPeriod: "mo",
    features: ["Monthly check-in", "Google profile checklist", "Fresh content suggestions", "New photo support", "Customer link cleanup"],
    cta: "Choose Managed",
    checkoutUrl: "/checkout?plan=managed",
    stripePriceEnvKey: "STRIPE_PRICE_MANAGED",
    paymentMode: "subscription"
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.id === id);
}
