"use client";

import Link from "next/link";
import { IntakeForm } from "@/components/IntakeForm";
import { PricingCards } from "@/components/PricingCards";
import { customerPortalUrl } from "@/lib/portal";

type BusinessTheme = {
  label: string;
  icon: string;
  sampleName: string;
  sampleMeta: string;
  status: string;
  previewImage?: string;
  previewImageAlt?: string;
  heroClass: string;
  heroOverlayClass: string;
  accentClass: string;
  buttonClass: string;
  chipClass: string;
  actions: string[];
  highlights: string[];
};

const heroTheme: BusinessTheme = {
  label: "Food",
  icon: "menu",
  sampleName: "Mellow Moose Burgers",
  sampleMeta: "Smash burgers - Siloam Springs, AR",
  status: "Open today - 11a-8p",
  previewImage: "/assets/mellow-moose-og-smashburger.jpg",
  previewImageAlt: "Mellow Moose smash burger with melted cheese",
  heroClass: "bg-[linear-gradient(135deg,#ff5a1f,#f8b737)]",
  heroOverlayClass: "bg-[linear-gradient(180deg,rgba(58,36,24,0.18),rgba(58,36,24,0.72)),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_28%)]",
  accentClass: "bg-[#fff0e9] text-[#ff5a1f]",
  buttonClass: "bg-[#ff5a1f] text-white",
  chipClass: "bg-[#3a2418] text-white",
  actions: ["Order", "Map", "Call", "Share"],
  highlights: ["Menu", "Specials", "Photos"]
};

const controlWorkflowSteps = [
  {
    number: "01",
    title: "Send the change",
    text: "Use the portal, text, or email. One clear request is enough: closed early today, new special, changed menu price, or updated photo.",
    icon: "message"
  },
  {
    number: "02",
    title: "We review it",
    text: "We check the wording, timing, access, and details before the change is sent out.",
    icon: "check"
  },
  {
    number: "03",
    title: "We route it",
    text: "Your MenuPilot page is updated first. Then we handle connected places like Google, Facebook, Instagram, and ordering links.",
    icon: "external"
  },
  {
    number: "04",
    title: "You get confirmation",
    text: "You get a short confirmation showing what changed, where it changed, and what still needs review.",
    icon: "star"
  }
];

const managedChannels = [
  {
    name: "MenuPilot page",
    status: "Always on",
    text: "Your branded customer page, updated first every time.",
    icon: "menu",
    badgeClass: "bg-[#244235] text-[#bce8ce]",
    iconClass: "bg-[#402014] text-coral"
  },
  {
    name: "Google profile",
    status: "Auto when connected",
    text: "Hours, posts, offers, and key details when profile access is confirmed.",
    icon: "pin",
    badgeClass: "bg-[#173f3b] text-[#9de7dc]",
    iconClass: "bg-[#123d3a] text-[#87d9d0]"
  },
  {
    name: "Facebook + Instagram",
    status: "Auto when connected",
    text: "Matching posts, stories, photos, and captions after public copy is approved.",
    icon: "camera",
    badgeClass: "bg-[#1d3c2a] text-[#afe3bf]",
    iconClass: "bg-[#173927] text-[#a7dfb9]"
  },
  {
    name: "Ordering + delivery",
    status: "Managed support",
    text: "Ordering links and delivery platforms handled carefully where the platform allows.",
    icon: "truck",
    badgeClass: "bg-[#5a3b12] text-[#f7ce67]",
    iconClass: "bg-[#4a3318] text-gold"
  }
];

const ownerPortalActions = [
  {
    title: "Change hours",
    text: "Early close, holiday hours, weather delay",
    icon: "clock"
  },
  {
    title: "Spotlight item",
    text: "Feature a special, popup item, or seasonal offer",
    icon: "flame"
  },
  {
    title: "Menu or price edit",
    text: "Send the exact item and price to review",
    icon: "menu"
  },
  {
    title: "Photo update",
    text: "Add or swap the images customers see first",
    icon: "camera"
  },
  {
    title: "Google post",
    text: "Queue a reviewed update for connected profiles",
    icon: "pin"
  },
  {
    title: "Ask for reviews",
    text: "Get the right review link or request copy",
    icon: "star"
  }
];

const reviewQueue = [
  ["Needs review", "Saturday hours change", "Google + MenuPilot"],
  ["Ready to send", "Brisket burger spotlight", "MenuPilot + Facebook"],
  ["Done", "New loaded fries photo", "Customer page"]
];

const brandItems = [
  { label: "Your colors", icon: "palette" },
  { label: "Your photos", icon: "camera" },
  { label: "Your menu", icon: "menu" },
  { label: "Your buttons", icon: "external" }
];

const brandKitImages = [
  {
    src: "/assets/mellow-moose-og-smashburger.jpg",
    alt: "Mellow Moose cheeseburger brand photo",
    label: "Hero item"
  },
  {
    src: "/assets/mellow-moose-blazing-fries.jpg",
    alt: "Loaded fries brand photo",
    label: "Menu photo"
  },
  {
    src: "/assets/mellow-moose-jalapeno-ranch-bacon.jpg",
    alt: "Mellow Moose burger with jalapeno and bacon",
    label: "Spotlight"
  }
];

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

function MenuPilotMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3a2418] text-lg font-black text-white shadow-[0_12px_30px_rgba(58,36,24,0.22)] ring-4 ring-[#ff5a1f]/10">
        M
      </span>
      {compact ? null : (
        <span className="leading-none">
          <span className="block text-base font-black text-ink">MenuPilot</span>
          <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.18em] text-muted">By Resonate Solutions</span>
        </span>
      )}
    </span>
  );
}

function PhonePreview({ theme }: { theme: BusinessTheme }) {
  return (
    <div className="relative mx-auto max-w-[360px] rounded-[2.35rem] border-[7px] border-[#3a2418] bg-white shadow-soft">
      <div className="absolute -right-5 -top-4 rotate-3 rounded-full bg-gold px-4 py-2 text-sm font-black text-ink shadow-sm">
        Live preview
      </div>
      <div className="flex items-center justify-between rounded-t-[1.85rem] bg-[#3a2418] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">
        <span>9:41</span>
        <span>MenuPilot page</span>
        <span>...</span>
      </div>
      <div className={`relative overflow-hidden px-6 py-7 text-white ${theme.heroClass}`}>
        {theme.previewImage ? (
          <img
            src={theme.previewImage}
            alt={theme.previewImageAlt ?? theme.sampleName}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className={`absolute inset-0 ${theme.heroOverlayClass}`} />
        <div className="relative">
          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] shadow-sm ${theme.chipClass}`}>
            {theme.status}
          </span>
          <h2 className="mt-4 text-3xl font-black leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.22)]">{theme.sampleName}</h2>
          <p className="mt-2 text-sm font-semibold text-white/90">{theme.sampleMeta}</p>
          <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs font-black">
            {theme.actions.map((action, index) => (
              <span key={action} className={`rounded-2xl px-2 py-3 shadow-sm ${index === 0 ? theme.buttonClass : "bg-white/95 text-ink"}`}>
                {action}
              </span>
            ))}
          </div>
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
                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${theme.accentClass}`}>
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

export default function MenuPilotPage() {
  return (
    <main className="bg-cream">
      <section className="sticky top-0 z-30 border-b border-line bg-[#f7f0e8]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3">
          <Link href="/menupilot" className="shrink-0">
            <MenuPilotMark />
          </Link>
          <div className="ml-auto flex min-w-0 items-center gap-5 overflow-x-auto text-sm font-bold text-muted">
            <a href="#owner-portal" className="shrink-0 hover:text-ink">Owner portal</a>
            <a href="#managed-channels" className="shrink-0 hover:text-ink">Where updates go</a>
            <a href="#custom-branding" className="shrink-0 hover:text-ink">Branding</a>
            <a href="#plans" className="shrink-0 hover:text-ink">Plans</a>
          </div>
          <Link href="#fit-check" className="hidden shrink-0 rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-black text-white shadow-[0_14px_35px_rgba(255,90,31,0.28)] transition hover:-translate-y-0.5 hover:bg-[#3a2418] sm:inline-flex">
            Free preview
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#202320,#ff5a1f,#f8b737,#202320)]" />
        <div className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-[#ff5a1f]/12 blur-3xl" />
        <div className="absolute left-1/3 top-12 h-52 w-52 rounded-full bg-[#f8b737]/12 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_0.85fr] lg:py-24">
          <div>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.01em] text-ink md:text-7xl">
              MenuPilot pages for <span className="text-[#ff5a1f] drop-shadow-[0_16px_34px_rgba(255,90,31,0.28)]">service</span> businesses.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              MenuPilot by Resonate Solutions gives customers one simple page they can open from a QR code, text, Google profile, or social link. Built around your services, photos, hours, booking info, and the questions people ask before they call or visit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/m/mellow-moose-burgers" className="group relative overflow-hidden rounded-full border-2 border-[#ffcf7a] bg-[#ff5a1f] px-7 py-4 text-center font-black text-white shadow-[0_18px_45px_rgba(255,90,31,0.32)] ring-4 ring-[#ff5a1f]/12 transition hover:-translate-y-0.5 hover:border-[#ff5a1f] hover:bg-[#3a2418] hover:shadow-[0_24px_65px_rgba(255,90,31,0.38)]">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] transition group-hover:translate-x-[220%]" />
                <span className="relative">See a live example page</span>
              </Link>
              <Link href="/pricing" className="rounded-full border border-line bg-white px-7 py-4 text-center font-bold text-ink shadow-sm transition hover:border-coral">
                View Plans
              </Link>
            </div>
            <p className="mt-3 text-sm font-bold text-coral">See the kind of simple, polished page your customers can open from a QR code, text, or link.</p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-muted">
              {["Mobile-first", "Custom branded", "Built around your trade"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="text-coral">{"\u2713"}</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <PhonePreview theme={heroTheme} />
        </div>
      </section>

      <section id="owner-portal" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Owner portal</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
                A simple review dashboard before anything goes live.
              </h2>
              <p className="mt-5 leading-7 text-muted">
                Customers sign in to the MenuPilot portal, choose the kind of change they need, and send the details once. Resonate reviews the request before it reaches the public page or connected channels.
              </p>
              <a href={customerPortalUrl} className="mt-7 inline-flex rounded-full border border-line px-5 py-3 font-black text-ink shadow-sm transition hover:border-coral hover:text-coral">
                Open app.resonate.solutions
              </a>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-line bg-[#fffaf4] shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white px-5 py-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">Signed in</p>
                  <h3 className="mt-1 text-xl font-black text-ink">Mellow Moose dashboard</h3>
                </div>
                <span className="rounded-full bg-[#e7f4f1] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#2f7d72]">
                  Review first
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_0.72fr]">
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  {ownerPortalActions.map((action) => (
                    <button key={action.title} type="button" className="group rounded-[1.15rem] border border-line bg-white p-4 text-left shadow-sm transition hover:border-coral hover:bg-[#fff7f2]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff0e9] text-coral transition group-hover:bg-coral group-hover:text-white">
                        <MiniIcon name={action.icon} />
                      </span>
                      <span className="mt-4 block font-black text-ink">{action.title}</span>
                      <span className="mt-1 block text-sm leading-5 text-muted">{action.text}</span>
                    </button>
                  ))}
                </div>

                <aside className="border-t border-line bg-[#2d1b12] p-5 text-white lg:border-l lg:border-t-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Review queue</p>
                  <div className="mt-4 grid gap-3">
                    {reviewQueue.map(([status, title, channel]) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-gold">
                          {status}
                        </span>
                        <p className="mt-3 font-black leading-5">{title}</p>
                        <p className="mt-1 text-sm text-white/62">{channel}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="managed-channels" className="relative overflow-hidden bg-[#2d1b12] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#2f7d72]/25 blur-3xl" />
        <div className="absolute -top-28 left-1/4 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold">
                Where updates go
              </p>
              <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.01em]">
                Reviewed push-button updates for the places customers check first.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/75">
              Customers get one simple place to request the change. Resonate checks the details, then updates the MenuPilot page and the approved channels connected to that business.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.82fr_1fr]">
            <div className="relative grid gap-3">
              <div className="absolute bottom-10 left-5 top-10 hidden w-px bg-[linear-gradient(#dba63a,rgba(219,166,58,0.08))] sm:block" />
              {controlWorkflowSteps.map((step) => (
                <article key={step.number} className="relative grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur sm:grid-cols-[auto_1fr]">
                  <span className="z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-gold/50 bg-[#3d281b] text-gold">
                    <MiniIcon name={step.icon} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-gold">{step.number}</span>
                      <h3 className="text-lg font-extrabold">{step.title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-white/72">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-[1.5rem] border border-gold/25 bg-[#24160f]/85 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur">
              <div className="rounded-[1.1rem] border border-gold/35 bg-[linear-gradient(135deg,rgba(219,166,58,0.12),rgba(255,255,255,0.045))] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold">Owner request</p>
                <p className="mt-2 text-lg font-extrabold leading-7">
                  "Closing two hours early for the storm. Back tomorrow at 11."
                </p>
                <p className="mt-2 text-xs font-bold text-white/55">Received 3:42 PM - reviewed by Resonate</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/12" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Routed to</span>
                <span className="h-px flex-1 bg-white/12" />
              </div>

              <div className="mt-4 grid gap-2">
                {managedChannels.map((channel) => (
                  <article key={channel.name} className="grid gap-3 rounded-2xl border border-white/8 bg-black/16 p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${channel.iconClass}`}>
                      <MiniIcon name={channel.icon} />
                    </span>
                    <span>
                      <span className="block font-extrabold">{channel.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-white/62">{channel.text}</span>
                    </span>
                    <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${channel.badgeClass}`}>
                      {channel.status}
                    </span>
                  </article>
                ))}
              </div>

              <div className="mt-4 rounded-[1.1rem] border border-[#2f7d72]/45 bg-[#163b35]/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9de7dc]">Confirmation sent - 3:47 PM</p>
                <p className="mt-2 text-sm font-bold leading-5 text-white/82">
                  MenuPilot page and Google updated. Facebook post queued. Ordering link marked for managed support.
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-white/50">
                Ordering and delivery channels stay marked as managed support until account access and platform behavior are confirmed.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section id="custom-branding" className="border-y border-line bg-[#fffaf4]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Custom branding</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
                This is not one menu template for everyone.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">
                Your page should use your colors, photos, menu structure, and ordering buttons. MenuPilot is shaped around your business, not around Resonate Solutions.
              </p>
              <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                {brandItems.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 text-sm font-black text-ink shadow-sm">
                    <span className="text-coral"><MiniIcon name={item.icon} /></span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-line bg-white p-5 text-ink shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3a2418]/70">Brand kit sample</p>
                  <h3 className="mt-3 text-2xl font-black">Mellow Moose Burgers</h3>
                </div>
                <span className="rounded-full bg-[#ffe5d8] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#ff5a1f]">Live customer</span>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  ["Orange", "bg-[#ff5a1f]"],
                  ["Cocoa", "bg-[#3a2418]"],
                  ["Gold", "bg-[#f8b737]"],
                  ["Teal", "bg-[#319a94]"]
                ].map(([label, color]) => (
                  <div key={label}>
                    <span className={`block aspect-square rounded-2xl ${color} shadow-[0_14px_35px_rgba(58,36,24,0.12)]`} />
                    <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.12em] text-[#3a2418]/75">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {brandKitImages.map((image) => (
                  <figure key={image.src} className="group relative aspect-square overflow-hidden rounded-2xl bg-[#3a2418]/10 shadow-[0_12px_35px_rgba(58,36,24,0.16)]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="eager"
                      decoding="async"
                    />
                    <figcaption className="absolute inset-x-2 bottom-2 rounded-full bg-[#3a2418]/82 px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm">
                      {image.label}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[#f1eadf] px-5 py-4 text-sm text-[#3a2418]">
                <span className="text-[#8b7463]">Headline:</span> <span className="font-black">Smashed fresh. Mellow vibes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="bg-[#fffaf4]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Plans</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
              Build once. Choose how much help you want after launch.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Start with a free page plan so everyone agrees on the work. The one-time Launch payment starts the custom build. After launch, Maintain covers occasional edits, while Managed gives active businesses unlimited standard updates with priority help.
            </p>
          </div>
          <div className="mt-10">
            <PricingCards />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div id="fit-check" className="mb-12 scroll-mt-28">
            <IntakeForm />
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-line bg-[#fffaf4] shadow-soft">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.74fr]">
              <div>
                <div className="p-8 md:p-12">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Clear next step</p>
                  <h2 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
                    Start with a MenuPilot plan. Build after payment.
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                    Send your business name, menu or services, photos, hours, and links. Resonate will recommend the right MenuPilot setup first. Custom design, preview, and hosting begin after the Launch payment.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="#fit-check" className="rounded-full bg-coral px-7 py-4 text-center font-bold text-white shadow-sm transition hover:bg-ink">
                      Request Free Page Plan
                    </Link>
                    <Link href="/pricing" className="rounded-full border border-line bg-white px-7 py-4 text-center font-bold text-ink shadow-sm transition hover:border-coral">
                      View Plans
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border-t border-line bg-white p-6 lg:border-l lg:border-t-0">
                <div className="rounded-[1.25rem] border border-line bg-cream p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">How it moves forward</p>
                  <ol className="mt-5 grid gap-4">
                    {[
                      ["01", "Free Page Plan", "We review the business details and recommend the right MenuPilot page, menu, or services setup."],
                      ["02", "Launch Payment", "$399 starts the custom build. This is when production work begins."],
                      ["03", "Private Preview", "The customer reviews the page before the public link is shared."],
                      ["04", "Go Live + Care", "Choose Launch only, Maintain, or Managed before the page becomes the customer-facing link."]
                    ].map(([number, title, text]) => (
                      <li key={number} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-line bg-white p-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0e9] text-xs font-black text-coral">{number}</span>
                        <span>
                          <span className="block font-extrabold text-ink">{title}</span>
                          <span className="mt-1 block text-sm leading-6 text-muted">{text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <footer className="mt-12 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <p className="font-bold text-ink">MenuPilot by Resonate Solutions</p>
            <p>Customer-ready pages for service businesses. Built in Northwest Arkansas.</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
