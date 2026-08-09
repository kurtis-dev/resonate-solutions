import { questionsEmail } from "@/lib/contact";

export type NavigationLink = {
  label: string;
  href: string;
};

export type NavigationGroup = {
  label: string;
  links: readonly NavigationLink[];
};

export const homeLink = { label: "Home", href: "/" } as const;
export const solutionsLink = { label: "How We Help", href: "/#solutions" } as const;
export const workLink = { label: "Examples", href: "/#work" } as const;
export const pricingLink = { label: "Pricing", href: "/pricing" } as const;
export const aboutLink = { label: "How It Works", href: "/#about" } as const;
export const menuPilotLink = { label: "MenuPilot", href: "/menupilot" } as const;
export const ownerPortalLink = { label: "Managed Page", href: "/portal" } as const;
export const startProjectLink = { label: "Get a Free Page Plan", href: "/checkout?plan=review" } as const;
export const billingLink = { label: "Billing", href: "/billing" } as const;
export const contactLink = { label: "Contact", href: `mailto:${questionsEmail}` } as const;
export const privacyLink = { label: "Privacy", href: "/privacy" } as const;
export const termsLink = { label: "Terms", href: "/terms" } as const;
export const disclaimerLink = { label: "Disclaimer", href: "/disclaimer" } as const;

export const primaryNavigationLinks = [homeLink, solutionsLink, workLink] as const;
export const productNavigationLinks = [menuPilotLink, ownerPortalLink] as const;
export const secondaryNavigationLinks = [pricingLink, aboutLink] as const;

export const footerNavigationGroups: readonly NavigationGroup[] = [
  {
    label: "Company",
    links: [homeLink, solutionsLink, workLink, aboutLink]
  },
  {
    label: "Products",
    links: [menuPilotLink, ownerPortalLink, pricingLink]
  },
  {
    label: "Get Started",
    links: [startProjectLink, billingLink, contactLink]
  },
  {
    label: "Legal",
    links: [privacyLink, termsLink, disclaimerLink]
  }
] as const;

export const menuPilotNavigationLinks = [
  { label: "Overview", href: "/menupilot" },
  { label: "Examples", href: "/menupilot/examples" },
  ownerPortalLink,
  { label: "Pricing", href: "/pricing" }
] as const;

export const globalNavigationExcludedPrefixes = [
  "/m/",
  "/excellent-pins",
  "/admin",
  "/dashboard"
] as const;

export function isGlobalNavigationExcluded(pathname: string) {
  return globalNavigationExcludedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function isNavigationLinkActive(pathname: string, href: string) {
  const path = href.split(/[?#]/, 1)[0];

  if (!path || href.includes("#")) {
    return false;
  }

  if (path === "/") {
    return pathname === "/";
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isNavigationLinkCurrent(pathname: string, href: string) {
  const path = href.split(/[?#]/, 1)[0];
  return Boolean(path) && !href.includes("#") && pathname === path;
}
