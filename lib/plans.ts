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
    name: "Mic Check",
    price: "$0",
    description: "A quick fit check for a local business that wants to know what customers cannot find before paying monthly.",
    limit: "Free discovery review",
    billingPeriod: "",
    features: [
      { label: "Menu and link check", detail: "I look at what a customer can actually find right now: menu, address, ordering, hours, and social links." },
      { label: "Google profile notes", detail: "Basic notes on whether the business profile sends people to the right place." },
      { label: "Photo gap notes", detail: "A quick read on whether the food, space, or service needs better visual proof." },
      { label: "Plan recommendation", detail: "A plain recommendation for owner-managed or Resonate-managed support." }
    ],
    cta: "Request Mic Check",
    checkoutUrl: "/menupilot",
    paymentMode: "none"
  },
  {
    id: "core",
    name: "Owner Managed",
    price: "$59",
    description: "For owners who want the custom menu page and the controls to keep it current themselves.",
    limit: "Best when you want control without another website builder",
    billingPeriod: "mo",
    features: [
      { label: "Custom branded menu page", detail: "Your logo, colors, food photos, categories, best sellers, specials, and customer actions are built into one mobile-first page." },
      { label: "Live QR menu link", detail: "Use the same QR code on signs, counters, truck windows, posts, and receipts without reprinting when the menu changes." },
      { label: "Owner control center", detail: "Change hours, closed notes, sold-out alerts, daily specials, and popup menu mode from a simple admin page." },
      { label: "Ordering, call, directions, and review links", detail: "Customers can get to the actions they need without digging through Facebook posts or blurry screenshots." },
      { label: "Unlimited self-serve routine edits", detail: "You are not boxed into two edits per month. If you can update it through the control center, use it as often as needed." },
      { label: "Resonate support for fixes", detail: "If something breaks or a control needs help, you can reach out by email." }
    ],
    cta: "Choose Owner Managed",
    highlighted: true,
    checkoutUrl: "/checkout?plan=core",
    stripePriceEnvKey: "STRIPE_PRICE_CORE",
    paymentMode: "subscription"
  },
  {
    id: "managed",
    name: "Resonate Managed",
    price: "$299",
    description: "For owners who want the page kept fresh without logging in, editing controls, or chasing menu details.",
    limit: "Best when you want me handling the updates",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Owner Managed", detail: "You still get the custom page, QR link, action buttons, admin controls, and mobile-first customer menu." },
      { label: "Resonate handles updates", detail: "Send changes by email or message and I update hours, specials, popup menus, photos, and visible page details for you." },
      { label: "Weekly menu presence check", detail: "I check that the public page still reflects what customers need to know that week." },
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
