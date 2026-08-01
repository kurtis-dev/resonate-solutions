"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (
    pathname.startsWith("/m/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/excellent-pins")
  ) {
    return null;
  }

  const homeLinks = [
    { label: "Solutions", href: "/#solutions" },
    { label: "Our Work", href: "/#work" },
    { label: "MenuPilot", href: "/menupilot" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/#about" }
  ];

  const standardLinks = [
    { label: "Services", href: "/menupilot" },
    { label: "Examples", href: "/menupilot/examples" },
    { label: "Pricing", href: "/pricing" }
  ];

  const links = pathname === "/" ? homeLinks : standardLinks;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Resonate Solutions home">
          <img
            src="/assets/resonate-logo-transparent.png"
            alt="Resonate Solutions"
            className="h-10 w-auto max-w-[150px] object-contain sm:max-w-[190px]"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted lg:flex" aria-label="Primary navigation">
          {links.map((item) => (
            <Link key={item.href} className="transition hover:text-ink" href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/checkout?plan=review" className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral sm:inline-flex">Free Page Plan</Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-site-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink lg:hidden"
          >
            <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-site-nav" className="border-t border-line bg-cream px-5 py-4 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((item) => (
              <Link key={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-ink hover:bg-white" href={item.href}>{item.label}</Link>
            ))}
            <Link onClick={() => setOpen(false)} href="/checkout?plan=review" className="mt-2 rounded-full bg-coral px-5 py-3 text-center font-black text-white sm:hidden">Free Page Plan</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
