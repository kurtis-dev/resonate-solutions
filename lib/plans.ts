export type Plan = {
  name: string;
  price: string;
  description: string;
  limit: string;
  billingPeriod: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  checkoutUrl: string;
};

export const plans: Plan[] = [
  {
    name: "Audit",
    price: "$0",
    description: "A quick fit check for a local business that wants to know what customers cannot find.",
    limit: "Free discovery review",
    billingPeriod: "",
    features: ["Menu and link check", "Google profile notes", "Photo gap notes", "Simple next-step plan"],
    cta: "Start audit",
    checkoutUrl: "/menupilot"
  },
  {
    name: "Launch Kit",
    price: "$299",
    description: "A practical first package for food trucks, pop-ups, coffee shops, and small restaurants.",
    limit: "One-time setup",
    billingPeriod: "setup",
    features: ["Mobile menu page", "QR code", "Basic food or service photos", "Hours and location block", "Google review link", "One revision"],
    cta: "Choose Launch Kit",
    highlighted: true,
    checkoutUrl: "/checkout?plan=launch-kit"
  },
  {
    name: "Upkeep",
    price: "$49",
    description: "Monthly updates for businesses that change hours, specials, locations, or menu items.",
    limit: "Monthly plan",
    billingPeriod: "mo",
    features: ["Menu updates", "Hours and location updates", "Specials and sold-out notes", "Photo swaps", "Link cleanup"],
    cta: "Choose Upkeep",
    checkoutUrl: "/checkout?plan=upkeep"
  },
  {
    name: "Managed Presence",
    price: "$149",
    description: "A more hands-on plan for owners who want Resonate to keep customer-facing info fresh.",
    limit: "Monthly service",
    billingPeriod: "mo",
    features: ["Monthly check-in", "Google profile checklist", "Fresh content suggestions", "New photo support", "Customer link cleanup"],
    cta: "Choose Managed",
    checkoutUrl: "/checkout?plan=managed"
  }
];
