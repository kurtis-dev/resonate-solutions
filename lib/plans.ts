export type Plan = {
  name: string;
  price: string;
  description: string;
  limit: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  checkoutUrl: string;
};

export const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Try ReplyPilot with a simple one-time reply credit.",
    limit: "10 free replies",
    features: ["Paste reviews manually", "Choose tone", "Copy and download replies"],
    cta: "Start free",
    checkoutUrl: "/replypilot/generator"
  },
  {
    name: "Starter",
    price: "$9",
    description: "A generous plan for one local business that wants review replies handled faster.",
    limit: "75 replies/month",
    features: ["Everything in Free", "Saved business profile", "Safe Reply Mode", "Mobile-friendly workflow"],
    cta: "Upgrade to Starter",
    checkoutUrl: "/replypilot/checkout?plan=starter"
  },
  {
    name: "Pro",
    price: "$29",
    description: "For busy businesses that need more automation, approval steps, and bulk drafting.",
    limit: "300 replies/month",
    features: ["Everything in Starter", "Multiple business profiles", "Approval workflow", "Bulk reply drafting placeholder"],
    cta: "Upgrade to Pro",
    highlighted: true,
    checkoutUrl: "/replypilot/checkout?plan=pro"
  },
  {
    name: "Agency",
    price: "$79",
    description: "For agencies and consultants replying for multiple clients.",
    limit: "1,000 replies/month",
    features: ["Everything in Pro", "Client workspaces", "CSV export placeholder", "Platform access status"],
    cta: "Upgrade to Agency",
    checkoutUrl: "/replypilot/checkout?plan=agency"
  }
];
