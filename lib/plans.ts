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
    name: "Free Local Review",
    price: "$0",
    description: "A quick review for a local business that wants to know what customers cannot find before paying monthly.",
    limit: "Free discovery review",
    billingPeriod: "",
    features: [
      { label: "Page and link check", detail: "I look at what a customer can actually find right now: services, address, booking or ordering links, hours, and social links." },
      { label: "Google profile notes", detail: "Basic notes on whether the business profile sends people to the right place." },
      { label: "Photo gap notes", detail: "A quick read on whether the food, space, or service needs better visual proof." },
      { label: "Plain next step", detail: "A simple recommendation for what would make the business easier for customers to understand and contact." }
    ],
    cta: "Request Free Review",
    checkoutUrl: "/menupilot",
    paymentMode: "none"
  },
  {
    id: "core",
    name: "Resonate Local Starter",
    price: "$49",
    description: "For local businesses that want one clean branded page and mostly manage updates themselves.",
    limit: "$199 setup fee",
    billingPeriod: "mo",
    features: [
      { label: "Custom branded local page", detail: "A mobile-first page using the business logo, colors, services, photos, hours, location, and next-step links." },
      { label: "Hours, location, services, and photos", detail: "The essential customer details live in one clean place instead of scattered posts and old screenshots." },
      { label: "Booking, quote, or order link", detail: "The page does not replace the tools you already use. It sends ready customers to the right next step." },
      { label: "QR code", detail: "One QR link for the truck, counter, social profiles, printed cards, and signs." },
      { label: "Mobile-first page", detail: "Built for customers checking from their phone before they call, book, order, or drive over." },
      { label: "Business-type layout", detail: "The page language is shaped around the kind of business, not a one-size-fits-all template." },
      { label: "Email support", detail: "Questions and basic support go through questions@resonate.solutions." }
    ],
    cta: "Choose Starter",
    checkoutUrl: "/checkout?plan=core",
    stripePriceEnvKey: "STRIPE_PRICE_CORE",
    paymentMode: "subscription"
  },
  {
    id: "plus",
    name: "Resonate Local Plus",
    price: "$99",
    description: "The main offer for businesses that want the page plus easy update tools for availability, specials, delays, policies, or promotions.",
    limit: "$299 setup fee",
    billingPeriod: "mo",
    features: [
      { label: "Everything in Starter", detail: "Includes the branded local page, QR code, next-step links, photos, hours, location, mobile layout, and email support." },
      { label: "Business-specific updates", detail: "Show openings, delays, specials, availability, policy reminders, service area changes, or promotions when customers need to know." },
      { label: "Featured services or offers", detail: "Guide people toward the service, package, or offer you want them to notice first." },
      { label: "Monthly page checkup", detail: "A recurring look at the page so stale details, weak labels, and broken links do not sit untouched." },
      { label: "Link placement help", detail: "I place the booking, quote, ordering, maps, phone, social, and review links you already have so customers know where to go next." }
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
      { label: "Brand direction", detail: "We shape the page around the business colors, logo, voice, service style, and customer experience." },
      { label: "Page layout", detail: "I organize the page sections, featured services, photos, QR code, location, hours, and next-step path." },
      { label: "Photo and copy cleanup", detail: "I crop supplied photos, tighten labels, and make the page easier to scan." },
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
