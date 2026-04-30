"use client";

import Link from "next/link";
import { useState } from "react";
import { mailtoLink, questionsEmail } from "@/lib/contact";

type BusinessTheme = {
  id: string;
  name: string;
  label: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  sampleName: string;
  sampleMeta: string;
  status: string;
  actions: string[];
  highlights: string[];
  updates: Array<{
    id: string;
    title: string;
    label: string;
    text: string;
    customerSees: string;
    active: boolean;
    icon: string;
  }>;
};

const businessThemes: BusinessTheme[] = [
  {
    id: "food",
    name: "MenuPilot",
    label: "Food",
    icon: "menu",
    eyebrow: "Food trucks, restaurants, and popups",
    title: "A clean menu page that helps people decide before they order.",
    description: "Show your menu, photos, specials, hours, location, and ordering links in one place that feels like your business.",
    sampleName: "Mellow Moose Burgers",
    sampleMeta: "Smash burgers - Siloam Springs, AR",
    status: "Open today - 11a-8p",
    actions: ["Order", "Map", "Call", "Share"],
    highlights: ["Menu", "Specials", "Photos"],
    updates: [
      {
        id: "food-soldout",
        title: "Sold out",
        label: "Sold out",
        text: "Mark an item unavailable before customers ask.",
        customerSees: "Sold out: Cowboy Burger. Back Friday.",
        active: false,
        icon: "box"
      },
      {
        id: "food-special",
        title: "Daily special",
        label: "Featured",
        text: "Feature one offer at the top of the page.",
        customerSees: "Today: Slammer Jammer and fries for $13.",
        active: false,
        icon: "tag"
      },
      {
        id: "food-moved",
        title: "Changed location",
        label: "Moved",
        text: "Update where the truck is parked.",
        customerSees: "Today only - parked at Memorial Park.",
        active: false,
        icon: "truck"
      },
      {
        id: "food-popup",
        title: "Popup menu active",
        label: "Takeover",
        text: "Switch to a takeover or event menu.",
        customerSees: "Dos Gordos Takeover - tortas and tacos today.",
        active: false,
        icon: "flame"
      }
    ]
  },
  {
    id: "lawn",
    name: "LawnPilot",
    label: "Lawn",
    icon: "leaf",
    eyebrow: "Lawn care and landscaping",
    title: "A local lawn care page that turns yard work into easy quote requests.",
    description: "Show mowing, edging, cleanup, seasonal services, service areas, photos, and a simple way to request a quote.",
    sampleName: "Greenline Lawn Care",
    sampleMeta: "Mowing, cleanup, and seasonal lawn help",
    status: "Booking spring cleanups",
    actions: ["Quote", "Call", "Areas", "Photos"],
    highlights: ["Mowing", "Cleanups", "Mulch"],
    updates: [
      {
        id: "lawn-weather",
        title: "Rain delay",
        label: "Weather",
        text: "Let customers know when routes move because of weather.",
        customerSees: "Rain delay today. Thursday routes move to Friday.",
        active: false,
        icon: "cloud"
      },
      {
        id: "lawn-openings",
        title: "Quote openings",
        label: "Open slots",
        text: "Promote available estimate times.",
        customerSees: "Two quote openings left this week.",
        active: false,
        icon: "clock"
      },
      {
        id: "lawn-seasonal",
        title: "Seasonal offer",
        label: "Spring",
        text: "Push seasonal services when demand spikes.",
        customerSees: "Spring cleanup and mulch bookings are open.",
        active: false,
        icon: "leaf"
      },
      {
        id: "lawn-area",
        title: "Service area note",
        label: "Areas",
        text: "Clarify where you are accepting new customers.",
        customerSees: "Now quoting Siloam Springs and nearby neighborhoods.",
        active: false,
        icon: "pin"
      }
    ]
  },
  {
    id: "cleaning",
    name: "CleanPilot",
    label: "Cleaning",
    icon: "spark",
    eyebrow: "Maids and cleaning services",
    title: "A cleaning page that makes your services feel clear and trustworthy.",
    description: "Show deep cleans, recurring options, move-out cleaning, checklists, service areas, and booking details.",
    sampleName: "Bright Home Cleaning",
    sampleMeta: "Recurring, deep, and move-out cleans",
    status: "New client spots available",
    actions: ["Book", "Call", "Checklist", "Areas"],
    highlights: ["Deep clean", "Weekly", "Move-out"],
    updates: [
      {
        id: "cleaning-openings",
        title: "Open cleaning slots",
        label: "Available",
        text: "Show the next openings without a back-and-forth message.",
        customerSees: "Openings available Tuesday and Friday afternoon.",
        active: false,
        icon: "clock"
      },
      {
        id: "cleaning-special",
        title: "Deep clean special",
        label: "Special",
        text: "Feature a limited-time package.",
        customerSees: "$25 off first deep clean this month.",
        active: false,
        icon: "tag"
      },
      {
        id: "cleaning-checklist",
        title: "Checklist highlight",
        label: "Includes",
        text: "Make scope clear before someone books.",
        customerSees: "Deep cleans include baseboards, fans, and appliance fronts.",
        active: false,
        icon: "check"
      },
      {
        id: "cleaning-recurring",
        title: "Recurring spots",
        label: "Recurring",
        text: "Push the jobs you want more of.",
        customerSees: "Two biweekly cleaning spots just opened.",
        active: false,
        icon: "star"
      }
    ]
  },
  {
    id: "detailing",
    name: "DetailPilot",
    label: "Detailing",
    icon: "car",
    eyebrow: "Mobile car detailers",
    title: "A detailing page that shows the shine before customers book.",
    description: "Show interior, exterior, ceramic, mobile service areas, before-and-after photos, and package pricing.",
    sampleName: "Mirror Finish Detailing",
    sampleMeta: "Mobile interior and exterior details",
    status: "Mobile appointments open",
    actions: ["Book", "Packages", "Photos", "Call"],
    highlights: ["Interior", "Exterior", "Ceramic"],
    updates: [
      {
        id: "detail-mobile",
        title: "Mobile day",
        label: "Mobile",
        text: "Let people know where you are booking mobile jobs.",
        customerSees: "Mobile detailing in Bentonville this Thursday.",
        active: false,
        icon: "truck"
      },
      {
        id: "detail-package",
        title: "Package promo",
        label: "Promo",
        text: "Feature the package you want to sell.",
        customerSees: "Interior refresh package is $30 off this week.",
        active: false,
        icon: "tag"
      },
      {
        id: "detail-gallery",
        title: "Fresh gallery",
        label: "Photos",
        text: "Point customers to recent before-and-after work.",
        customerSees: "New before-and-after photos added today.",
        active: false,
        icon: "camera"
      },
      {
        id: "detail-weather",
        title: "Weather note",
        label: "Weather",
        text: "Set expectations for exterior work.",
        customerSees: "Exterior details may move if storms arrive.",
        active: false,
        icon: "cloud"
      }
    ]
  },
  {
    id: "beauty",
    name: "BeautyPilot",
    label: "Beauty",
    icon: "spark",
    eyebrow: "Nail techs and beauty pros",
    title: "A beauty page that makes your work easy to browse and book.",
    description: "Show sets, services, pricing, policies, location, booking links, and the openings you want filled.",
    sampleName: "Studio Rose Nails",
    sampleMeta: "Gel sets, fills, art, and appointments",
    status: "Open slots this week",
    actions: ["Book", "Gallery", "Policies", "DM"],
    highlights: ["Gel sets", "Art", "Fills"],
    updates: [
      {
        id: "beauty-slots",
        title: "Open appointment",
        label: "Open slot",
        text: "Fill cancellations without posting everywhere.",
        customerSees: "Last-minute opening Friday at 2:30.",
        active: false,
        icon: "clock"
      },
      {
        id: "beauty-gallery",
        title: "New set gallery",
        label: "Gallery",
        text: "Show the latest work customers ask about.",
        customerSees: "New spring set photos are live.",
        active: false,
        icon: "camera"
      },
      {
        id: "beauty-policy",
        title: "Policy reminder",
        label: "Policy",
        text: "Keep booking expectations visible.",
        customerSees: "Please book fills within 3 weeks for returning pricing.",
        active: false,
        icon: "book"
      },
      {
        id: "beauty-offer",
        title: "New client offer",
        label: "Offer",
        text: "Feature a first-time client reason to book.",
        customerSees: "$10 off first gel set for new clients.",
        active: false,
        icon: "tag"
      }
    ]
  },
  {
    id: "wellness",
    name: "WellnessPilot",
    label: "Wellness",
    icon: "star",
    eyebrow: "Massage therapists and wellness providers",
    title: "A wellness page that helps clients choose the right session.",
    description: "Show massage types, session lengths, new-client offers, location, availability, and a clean booking path.",
    sampleName: "Stillwater Massage",
    sampleMeta: "Therapeutic, relaxation, and prenatal massage",
    status: "New clients welcome",
    actions: ["Book", "Sessions", "Call", "Location"],
    highlights: ["60 min", "90 min", "Prenatal"],
    updates: [
      {
        id: "wellness-availability",
        title: "Availability note",
        label: "Openings",
        text: "Show the next windows clients can book.",
        customerSees: "Openings available Wednesday morning and Saturday.",
        active: false,
        icon: "clock"
      },
      {
        id: "wellness-new-client",
        title: "New client offer",
        label: "New client",
        text: "Give first-time clients a simple next step.",
        customerSees: "New clients can book a 60-minute intro session.",
        active: false,
        icon: "tag"
      },
      {
        id: "wellness-session",
        title: "Session focus",
        label: "Focus",
        text: "Feature a service type people may not know you offer.",
        customerSees: "Prenatal massage appointments are available this month.",
        active: false,
        icon: "star"
      },
      {
        id: "wellness-location",
        title: "Location reminder",
        label: "Location",
        text: "Make arrival details easy before the appointment.",
        customerSees: "Please use the west entrance for evening sessions.",
        active: false,
        icon: "pin"
      }
    ]
  },
  {
    id: "other",
    name: "Other local service",
    label: "Other",
    icon: "star",
    eyebrow: "Custom services, photos, booking",
    title: "A flexible local page for the business you actually run.",
    description: "Show what you offer, who you help, where you work, what it costs to get started, and the easiest way for customers to contact or book you.",
    sampleName: "Your Local Service",
    sampleMeta: "Services, photos, proof, and booking details",
    status: "Now accepting new customers",
    actions: ["Book", "Quote", "Call", "Details"],
    highlights: ["Services", "Photos", "Reviews"],
    updates: [
      {
        id: "other-availability",
        title: "Availability update",
        label: "Available",
        text: "Tell customers when you can take new work.",
        customerSees: "Now accepting new customers for next week.",
        active: false,
        icon: "clock"
      },
      {
        id: "other-service",
        title: "Featured service",
        label: "Featured",
        text: "Put one offer or service in front of customers.",
        customerSees: "Featured service: quick-start package for new customers.",
        active: false,
        icon: "star"
      },
      {
        id: "other-area",
        title: "Service area note",
        label: "Areas",
        text: "Clarify where you are currently booking.",
        customerSees: "Serving Siloam Springs and nearby areas this month.",
        active: false,
        icon: "pin"
      },
      {
        id: "other-promo",
        title: "Simple promotion",
        label: "Promo",
        text: "Share a limited-time reason to reach out.",
        customerSees: "New customers can request a free intro quote.",
        active: false,
        icon: "tag"
      }
    ]
  }
];

const customerView = [
  "A customer-ready page that feels like your business",
  "Services, photos, hours, pricing, location, and booking links",
  "Call, directions, quote, booking, review, and social buttons",
  "Optional updates for openings, delays, specials, policies, and availability"
];

const ownerView = [
  "Start with a clean page that explains what you do",
  "Choose the business type so the language matches your services",
  "Add premium update tools when the business needs frequent changes",
  "Keep booking, quote, call, map, and review links in one place",
  "Use photos and proof without making customers dig through social posts",
  "Refresh the page as the business grows without rebuilding from scratch"
];

const reasons = [
  {
    title: "Social posts disappear",
    text: "Customers should not have to scroll through old posts to find your services, prices, hours, or booking link.",
    icon: "message"
  },
  {
    title: "Google is not always enough",
    text: "Your profile matters, but it rarely explains your offers, photos, policies, and next steps the way your own page can.",
    icon: "pin"
  },
  {
    title: "Booking links need context",
    text: "A booking or quote form is useful after someone decides. Your page helps them understand what they are choosing first.",
    icon: "external"
  },
  {
    title: "Screenshots are not a business page",
    text: "Blurry price lists, flyers, and old graphics make it harder for customers to trust what they are reading.",
    icon: "camera"
  },
  {
    title: "One clear place",
    text: "Put services, photos, hours, phone, maps, reviews, social links, QR codes, and booking paths in one polished place.",
    icon: "star"
  },
  {
    title: "Room to grow",
    text: "Start simple, then add availability updates, seasonal offers, route changes, policies, and promotions when they matter.",
    icon: "bolt"
  }
];

const brandItems = [
  { label: "Your colors", icon: "palette" },
  { label: "Your photos", icon: "camera" },
  { label: "Your voice", icon: "star" },
  { label: "Your story", icon: "book" }
];

const brandedExamples = [
  {
    number: "01",
    label: "Brand sample - lawn care",
    name: "Greenline Lawn Care",
    tagline: "Healthy lawns, on schedule.",
    description: "Mowing, cleanup, mulch, and seasonal lawn help.",
    status: "Booking spring cleanups",
    update: "Rain delay today. Thursday routes move to Friday.",
    image: "/assets/lovable-lawn-care.jpg",
    imageAlt: "Freshly mowed striped lawn",
    actions: ["Request Quote", "Call", "Service Areas"],
    highlights: ["Weekly mowing", "Spring cleanup", "Mulch installs"],
    shell: "border-[#c7dfca] bg-[#f8fff5] text-[#17251b]",
    labelClass: "border-[#b7d8ba] bg-[#eaf7e8] text-[#176a37]",
    hero: "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_18%),linear-gradient(135deg,#1f7a38,#7dbc42)]",
    heroOverlay: "bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0_18%,transparent_18%_34%,rgba(255,255,255,0.1)_34%_47%,transparent_47%_100%)]",
    button: "bg-[#176a37] text-white",
    accent: "bg-[#e6f5df] text-[#176a37]",
    updateClass: "bg-[#2e7d32] text-white"
  },
  {
    number: "02",
    label: "Customer page preview - cleaning",
    name: "Bright Home Cleaning",
    tagline: "A cleaner home, on your schedule.",
    description: "Recurring, deep, and move-out cleans.",
    status: "New client spots available",
    update: "Openings available Tuesday and Friday afternoon.",
    image: "/assets/lovable-cleaning.jpg",
    imageAlt: "Bright spotless living room",
    actions: ["Book Cleaning", "Call", "Checklist"],
    highlights: ["Deep cleans", "Weekly service", "Move-out clean"],
    shell: "border-[#c9dff4] bg-[#f8fbff] text-[#102033]",
    labelClass: "border-[#b9d9f4] bg-[#eaf5ff] text-[#1769b3]",
    hero: "bg-[linear-gradient(135deg,#eaf7ff,#ffffff_42%,#b7dcf4)]",
    heroOverlay: "bg-[radial-gradient(circle_at_84%_18%,rgba(47,156,151,0.22),transparent_12%),linear-gradient(100deg,rgba(255,255,255,0.7),transparent_38%)]",
    button: "bg-[#1769b3] text-white",
    accent: "bg-[#edf6ff] text-[#1769b3]",
    updateClass: "bg-[#fff4cf] text-[#684f00]"
  },
  {
    number: "03",
    label: "Brand sample - detailing",
    name: "Mirror Finish Detailing",
    tagline: "A showroom shine, in your driveway.",
    description: "Mobile interior and exterior details.",
    status: "Mobile appointments open",
    update: "Interior refresh package is $30 off this week.",
    image: "/assets/lovable-detailing.jpg",
    imageAlt: "Glossy black car paint with water beading",
    actions: ["Book Detail", "Packages", "Before/After"],
    highlights: ["Interior refresh", "Exterior wash", "Ceramic coating"],
    shell: "border-[#263241] bg-[#171d25] text-white",
    labelClass: "border-[#104e87] bg-[#082d52] text-[#38aaf5]",
    hero: "bg-[radial-gradient(circle_at_72%_25%,rgba(56,170,245,0.55),transparent_16%),linear-gradient(135deg,#101820,#263241_45%,#05070a)]",
    heroOverlay: "bg-[linear-gradient(120deg,transparent_0_35%,rgba(255,255,255,0.22)_36%,transparent_38%_100%)]",
    button: "bg-[#22a8f2] text-white",
    accent: "bg-[#27303c] text-[#6ec9ff]",
    updateClass: "bg-[#174866] text-[#8fddff]"
  }
];

const planCards = [
  {
    name: "Resonate Local Starter",
    tag: "$49/mo + $199 setup",
    text: "For local businesses that need one clean, customer-ready page with services, photos, contact details, and next steps.",
    cta: "Start your local page",
    href: "/pricing",
    featured: false,
    items: [
      "Custom branded local business page",
      "Services, hours, location, pricing notes, and photos",
      "Booking, quote, call, map, or order link",
      "QR code",
      "Mobile-first page",
      "Business-type language and layout",
      "Email support"
    ]
  },
  {
    name: "Resonate Local Plus",
    tag: "$99/mo + $299 setup",
    text: "The main offer for businesses that want the page plus quick update tools for openings, delays, specials, and availability.",
    cta: "Choose Plus",
    href: "/pricing",
    featured: true,
    items: [
      "Everything in Starter",
      "Business-specific update controls",
      "Availability, weather, special, policy, and promotion messages",
      "Featured services or offers",
      "Monthly polish/checkup",
      "Booking, maps, phone, social, and review links placed clearly"
    ]
  },
  {
    name: "Custom Design Buildout",
    tag: "$499 one-time",
    text: "For businesses that want a deeper design pass before the monthly page starts.",
    cta: "Ask about buildout",
    href: `mailto:${questionsEmail}`,
    featured: false,
    items: [
      "Brand direction",
      "Page layout and launch structure",
      "Photo and copy cleanup",
      "QR and link placement",
      "Phone and desktop launch check"
    ]
  }
];

function CheckLine({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className={dark ? "font-bold text-gold" : "font-bold text-coral"}>{"\u2713"}</span>
      <span>{children}</span>
    </li>
  );
}

function MiniIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (name) {
    case "warning":
      return <svg {...common}><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5" /><path d="M12 18h.01" /></svg>;
    case "menu":
      return <svg {...common}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>;
    case "leaf":
      return <svg {...common}><path d="M5 21c8-1 14-7 16-18-9 2-15 8-16 16Z" /><path d="M9 15c2-3 5-6 9-9" /></svg>;
    case "cloud":
      return <svg {...common}><path d="M17.5 18H7a4 4 0 1 1 .8-7.9A6 6 0 0 1 19 12.5 3 3 0 0 1 17.5 18Z" /></svg>;
    case "check":
      return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    case "car":
      return <svg {...common}><path d="M5 17h14" /><path d="M6 17l1-6 2-4h6l2 4 1 6" /><circle cx="8" cy="17" r="2" /><circle cx="16" cy="17" r="2" /><path d="M8 11h8" /></svg>;
    case "calendar":
      return <svg {...common}><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /></svg>;
    case "door":
      return <svg {...common}><path d="M5 21V5a2 2 0 0 1 2-2h10v18" /><path d="M9 12h.01" /><path d="M3 21h18" /></svg>;
    case "spark":
      return <svg {...common}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "box":
      return <svg {...common}><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>;
    case "truck":
      return <svg {...common}><path d="M3 7h11v10H3z" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
    case "tag":
      return <svg {...common}><path d="M20 12 12 20 4 12V4h8l8 8Z" /><path d="M7.5 7.5h.01" /></svg>;
    case "flame":
      return <svg {...common}><path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 .2 2-.6 3.4-2 4-1-4-4-6-4-6 .5 3-1 5-2.5 6.5A6.4 6.4 0 0 0 5 15c0 4 3 7 7 7Z" /></svg>;
    case "message":
      return <svg {...common}><path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>;
    case "pin":
      return <svg {...common}><path d="M12 21s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12Z" /><circle cx="12" cy="9" r="2" /></svg>;
    case "external":
      return <svg {...common}><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></svg>;
    case "camera":
      return <svg {...common}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3" /></svg>;
    case "star":
      return <svg {...common}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
    case "bolt":
      return <svg {...common}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
    case "palette":
      return <svg {...common}><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.3-3h1.2A3.5 3.5 0 0 0 21 11.2 9 9 0 0 0 12 3Z" /><circle cx="7.5" cy="10" r=".5" /><circle cx="10" cy="7.5" r=".5" /><circle cx="14" cy="7.5" r=".5" /></svg>;
    case "book":
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function PhonePreview({ theme }: { theme: BusinessTheme }) {
  return (
    <div className="relative mx-auto max-w-[360px] rounded-[2.35rem] border-[7px] border-[#3a2418] bg-white shadow-soft">
      <div className="absolute -right-5 -top-4 rotate-3 rounded-full bg-gold px-4 py-2 text-sm font-black text-ink shadow-sm">
        Live preview
      </div>
      <div className="flex items-center justify-between rounded-t-[1.85rem] bg-[#3a2418] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">
        <span>9:41</span>
        <span>Local page</span>
        <span>...</span>
      </div>
      <div className="bg-[linear-gradient(135deg,#ff5a1f,#f8b737)] px-6 py-7 text-ink">
        <span className="rounded-full bg-[#3a2418] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
          {theme.status}
        </span>
        <h2 className="mt-4 text-3xl font-black leading-none">{theme.sampleName}</h2>
        <p className="mt-2 text-sm font-semibold">{theme.sampleMeta}</p>
        <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs font-black">
          {theme.actions.map((action) => (
            <span key={action} className="rounded-2xl bg-white/95 px-2 py-3 shadow-sm">
              {action}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-b-[1.85rem] bg-cream px-5 py-5">
        <div className="flex items-end justify-between">
          <h3 className="text-lg font-black text-ink">What customers see</h3>
          <span className="text-xs font-black uppercase tracking-[0.12em] text-brandDark">Live</span>
        </div>
        <div className="mt-4 grid gap-3">
          {theme.highlights.map((item, index) => (
            <div key={item} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e9] text-coral">
                <MiniIcon name={index === 0 ? theme.icon : index === 1 ? "camera" : "star"} />
              </span>
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-gold px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-ink">
                  {theme.label}
                </span>
                <p className="mt-1 truncate font-black text-ink">{item}</p>
              </div>
              <span className="rounded-full bg-ink px-3 py-2 text-xs font-black text-white">View</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandedExampleCard({ example }: { example: (typeof brandedExamples)[number] }) {
  return (
    <article className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${example.labelClass}`}>
          {example.label}
        </span>
        <span className="text-xs font-bold text-white/45">{example.number}</span>
      </div>
      <div className={`overflow-hidden rounded-[1.75rem] border shadow-soft ${example.shell}`}>
        <div className="py-3 text-center text-[10px] font-black tracking-[0.12em] opacity-45">resonate.page</div>
        <div className={`relative min-h-[150px] overflow-hidden ${example.hero}`}>
          <img
            src={example.image}
            alt={example.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className={`absolute inset-0 ${example.heroOverlay}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="relative flex h-full min-h-[150px] flex-col justify-end p-5">
            <span className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-[10px] font-black text-white shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <MiniIcon name={example.name.includes("Lawn") ? "leaf" : example.name.includes("Cleaning") ? "spark" : "car"} />
              </span>
              {example.name}
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/80">{example.label.split(" - ").pop()}</p>
            <h3 className="mt-1 text-2xl font-black leading-tight text-white">{example.tagline}</h3>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${example.accent}`}>{example.status}</span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${example.accent}`}>Trusted local</span>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-80">{example.description}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {example.actions.map((action, index) => (
              <span key={action} className={`rounded-xl border px-2 py-3 text-center text-[11px] font-black ${index === 0 ? example.button : "border-current/15 bg-white/10"}`}>
                {action}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {example.highlights.map((highlight, index) => (
              <span key={highlight} className="rounded-xl border border-current/10 bg-white/10 p-3 text-[11px] font-bold leading-tight">
                <span className="mb-2 block opacity-80">
                  <MiniIcon name={index === 0 ? "star" : index === 1 ? "calendar" : "check"} />
                </span>
                {highlight}
              </span>
            ))}
          </div>
          <div className={`mt-4 rounded-xl px-4 py-3 text-xs font-black ${example.updateClass}`}>
            <span className="block text-[10px] uppercase tracking-[0.16em] opacity-75">Premium update</span>
            {example.update}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MenuPilotPage() {
  const [selectedThemeId, setSelectedThemeId] = useState(businessThemes[0].id);
  const selectedTheme = businessThemes.find((theme) => theme.id === selectedThemeId) ?? businessThemes[0];
  const [activeUpdates, setActiveUpdates] = useState<Record<string, boolean>>(
    Object.fromEntries(businessThemes.flatMap((theme) => theme.updates.map((update) => [update.id, update.active])))
  );

  const photoEmailLink = mailtoLink(
    "Resonate Local business details",
    "Send your services, photos, pricing, hours, location, booking link, and anything customers ask before they buy."
  );

  function toggleUpdate(id: string) {
    setActiveUpdates((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <main className="bg-cream">
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral text-lg font-bold text-white">R</span>
            <span>
              <span className="block text-lg font-bold leading-none text-ink">Resonate Local</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">by Resonate Solutions</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
            <a href="#business-types" className="hover:text-ink">Business types</a>
            <a href="#daily-updates" className="hover:text-ink">Premium updates</a>
            <a href="#why" className="hover:text-ink">Why it matters</a>
            <a href="#plans" className="hover:text-ink">Plans</a>
          </nav>
          <Link href="/pricing" className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-ink">
            Start your page
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#202320,#f17855,#f6a15e,#202320)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_0.85fr] lg:py-24">
          <div>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.01em] text-ink md:text-7xl">
              Customer-ready pages for <span className="text-coral drop-shadow-[0_10px_28px_rgba(217,120,86,0.22)]">local service</span> businesses.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Resonate Local is the umbrella for simple, customer-ready pages. MenuPilot, LawnPilot, CleanPilot, DetailPilot, BeautyPilot, and WellnessPilot each use language that fits the kind of business you run.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/m/mellow-moose-burgers" className="group relative overflow-hidden rounded-full bg-ink px-7 py-4 text-center font-black text-white shadow-[0_20px_55px_rgba(32,35,32,0.28)] ring-4 ring-gold/35 transition hover:-translate-y-0.5 hover:bg-coral hover:shadow-[0_24px_65px_rgba(217,120,86,0.34)]">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] transition group-hover:translate-x-[220%]" />
                <span className="relative">See a live example page</span>
              </Link>
              <Link href="/pricing" className="rounded-full border border-line bg-white px-7 py-4 text-center font-bold text-ink shadow-sm transition hover:border-coral">
                View Resonate Local plans
              </Link>
            </div>
            <p className="mt-3 text-sm font-bold text-coral">Built from a real food business sample so you can see the finished page, not just the pitch.</p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-muted">
              {["Mobile-first", "Custom branded", "Built around your trade"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="text-coral">{"\u2713"}</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <PhonePreview theme={selectedTheme} />
        </div>
      </section>

      <section id="business-types" className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Choose your business type</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
                One Resonate Local system. Different Pilot for each trade.
              </h2>
              <p className="mt-5 leading-7 text-muted">
                MenuPilot handles food. LawnPilot handles landscaping. CleanPilot handles cleaning. DetailPilot, BeautyPilot, and WellnessPilot each shape the page around what customers need to see before they reach out.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {businessThemes.map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  aria-pressed={selectedTheme.id === theme.id}
                  className={`flex items-start gap-4 rounded-2xl border-2 p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${
                    selectedTheme.id === theme.id ? "border-coral bg-[#fff0e9]" : "border-line bg-cream hover:border-coral"
                  }`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    selectedTheme.id === theme.id ? "bg-coral text-white" : "bg-white text-coral"
                  }`}>
                    <MiniIcon name={theme.icon} />
                  </span>
                  <span>
                    <span className="block text-base font-extrabold text-ink">{theme.name}</span>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-muted">{theme.eyebrow}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 rounded-[2rem] bg-ink p-7 text-white shadow-soft">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">{selectedTheme.name}</p>
                <h3 className="mt-3 text-3xl font-extrabold leading-tight">{selectedTheme.title}</h3>
                <p className="mt-4 leading-7 text-white/80">{selectedTheme.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {selectedTheme.highlights.map((highlight) => (
                  <span key={highlight} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center font-bold">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">How it works</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
              One polished page customers can use. Clear setup behind it.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-line bg-cream p-7 shadow-sm">
              <span className="inline-flex rounded-full bg-[#fff0e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-coral">
                What customers see
              </span>
              <h3 className="mt-5 text-3xl font-extrabold text-ink">A branded local page</h3>
              <ul className="mt-6 grid gap-4 text-muted">
                {customerView.map((item) => (
                  <CheckLine key={item}>{item}</CheckLine>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.75rem] bg-ink p-7 text-white shadow-soft">
              <span className="inline-flex rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ink">
                What owners can update
              </span>
              <h3 className="mt-5 text-3xl font-extrabold">Simple now. More powerful when needed.</h3>
              <ul className="mt-6 grid gap-4 text-white/90">
                {ownerView.map((item) => (
                  <CheckLine key={item} dark>{item}</CheckLine>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="daily-updates" className="border-y border-line bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Premium updates</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
                Add quick updates when the business needs them.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                The starter page can stay steady. The higher monthly plan adds business-specific messages for openings, delays, specials, policies, and availability.
              </p>
            </div>
            <div className="rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-muted shadow-sm">
              Pick a business type above, then turn on the updates its customers would actually care about.
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {selectedTheme.updates.map((control) => (
              <button
                type="button"
                key={control.id}
                onClick={() => toggleUpdate(control.id)}
                className={`group rounded-[1.5rem] border-2 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${
                  activeUpdates[control.id] ? "border-coral" : "border-line hover:border-coral"
                }`}
                aria-pressed={activeUpdates[control.id]}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-left">
                    <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${
                      activeUpdates[control.id] ? "bg-[#ffe0d2] text-coral" : "bg-sage text-brandDark"
                    }`}>
                      <MiniIcon name={control.icon} />
                    </span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
                      activeUpdates[control.id] ? "bg-coral text-white" : "bg-[#fff0e9] text-coral"
                    }`}>
                      {control.label}
                    </span>
                    <h3 className="mt-4 text-xl font-extrabold leading-tight text-ink">{control.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-muted">{control.text}</p>
                  </div>
                  <span className={`mt-1 h-7 w-12 rounded-full p-1 transition ${
                    activeUpdates[control.id] ? "bg-coral" : "bg-line group-hover:bg-coral"
                  }`}>
                    <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      activeUpdates[control.id] ? "translate-x-5" : "group-hover:translate-x-5"
                    }`} />
                  </span>
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-line bg-cream p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Customer sees</p>
                  <p className="mt-2 text-sm font-bold leading-5 text-ink">{control.customerSees}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Why Resonate Local</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
              Customers should not have to dig to know what you do.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted">
              Local business owners need something simpler than a full website and more useful than a scattered social profile. This gives customers one clean place to understand, trust, and contact you.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title} className="rounded-[1.5rem] border border-line bg-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e9] text-coral">
                  <MiniIcon name={reason.icon} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-ink">{reason.title}</h3>
                <p className="mt-3 leading-7 text-muted" dangerouslySetInnerHTML={{ __html: reason.text }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="custom-branding" className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Custom branding</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] md:text-5xl">
              Custom branded pages for the business <span className="italic text-white/70">you actually run.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/75">
              Each Resonate Local page is shaped around the trade, not forced into one generic template. LawnPilot needs quotes and service areas. CleanPilot needs packages and trust. DetailPilot needs galleries, packages, and booking.
            </p>
            <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-4">
              {brandItems.map((item) => (
                <span key={item.label} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white">
                  <span className="text-gold"><MiniIcon name={item.icon} /></span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {brandedExamples.map((example) => (
              <BrandedExampleCard key={example.name} example={example} />
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-white/65">
            Every page is hand-tuned to the trade: colors, language, actions, proof, and the updates customers actually want to see.
          </p>
        </div>
      </section>

      <section id="plans" className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Plans</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
              Two ways to run your local page.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Starter gives you the customer-ready page. Plus adds fast update tools when the business needs availability, weather, specials, policy notes, or promotions to change without a rebuild.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {planCards.map((plan) => (
              <article key={plan.name} className={`rounded-[1.75rem] border-2 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${
                plan.featured ? "border-coral" : "border-line"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-3xl font-extrabold text-ink">{plan.name}</h3>
                  <span className="rounded-full bg-[#fff0e9] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-coral">{plan.tag}</span>
                </div>
                <p className="mt-4 leading-7 text-muted">{plan.text}</p>
                <ul className="mt-7 grid gap-3 text-muted">
                  {plan.items.map((item) => (
                    <CheckLine key={item}>{item}</CheckLine>
                  ))}
                </ul>
                <div className="mt-8">
                  <p className="text-3xl font-extrabold text-ink">{plan.tag.split(" + ")[0]}</p>
                  <p className="mt-1 text-sm text-muted">{plan.tag.includes("+") ? plan.tag.split(" + ")[1] : plan.tag}</p>
                </div>
                <Link href={plan.href} className={`mt-7 block rounded-full px-6 py-4 text-center font-bold shadow-sm transition ${
                  plan.featured ? "bg-ink text-white hover:bg-coral" : "bg-coral text-white hover:bg-ink"
                }`}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="rounded-[2rem] bg-[linear-gradient(135deg,#202320,#f17855,#f6a15e)] p-8 shadow-soft md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.01em] text-white md:text-5xl">Let&apos;s build the page customers need.</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
                  Send your services, photos, hours, and booking link. We will shape it into a local page customers can understand fast.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/pricing" className="rounded-full bg-white px-7 py-4 text-center font-bold text-ink shadow-sm transition hover:bg-cream">
                  Start your local page
                </Link>
                <a href={photoEmailLink} className="rounded-full border border-white/50 bg-ink px-7 py-4 text-center font-bold text-white shadow-sm transition hover:bg-coral">
                  Send business details
                </a>
              </div>
            </div>
          </div>
          <footer className="mt-12 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <p className="font-bold text-ink">Resonate Local <span className="font-normal text-muted">by Resonate Solutions</span></p>
            <p>Customer-ready pages for local service businesses. Built in Northwest Arkansas.</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
