"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  isGlobalNavigationExcluded,
  isNavigationLinkActive,
  isNavigationLinkCurrent,
  primaryNavigationLinks,
  productNavigationLinks,
  secondaryNavigationLinks,
  startProjectLink
} from "@/lib/site-navigation";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (isGlobalNavigationExcluded(pathname)) {
    return null;
  }

  const productsActive = productNavigationLinks.some((item) => isNavigationLinkActive(pathname, item.href));

  const renderDesktopLink = (item: { label: string; href: string }) => {
    const active = isNavigationLinkCurrent(pathname, item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`rounded-full px-3 py-2 transition hover:bg-white hover:text-ink ${active ? "bg-white text-ink shadow-sm" : ""}`}
      >
        {item.label}
      </Link>
    );
  };

  const renderMobileLink = (item: { label: string; href: string }, nested = false) => {
    const active = isNavigationLinkCurrent(pathname, item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        aria-current={active ? "page" : undefined}
        className={`rounded-xl px-4 py-3 font-semibold text-ink hover:bg-white ${nested ? "pl-7" : ""} ${active ? "bg-white shadow-sm" : ""}`}
      >
        {item.label}
      </Link>
    );
  };

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
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted lg:flex" aria-label="Primary navigation">
          {primaryNavigationLinks.map(renderDesktopLink)}
          <details className="group relative">
            <summary
              className={`flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2 transition hover:bg-white hover:text-ink [&::-webkit-details-marker]:hidden ${productsActive ? "bg-white text-ink shadow-sm" : ""}`}
            >
              Products
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current transition group-open:rotate-180">
                <path d="m4 6 4 4 4-4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="absolute left-0 top-full z-40 mt-2 grid min-w-52 gap-1 rounded-2xl border border-line bg-white p-2 shadow-soft">
              {productNavigationLinks.map(renderDesktopLink)}
            </div>
          </details>
          {secondaryNavigationLinks.map(renderDesktopLink)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={startProjectLink.href} className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral sm:inline-flex">{startProjectLink.label}</Link>
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
      <nav
        id="mobile-site-nav"
        hidden={!open}
        className="border-t border-line bg-cream px-5 py-4 lg:hidden"
        aria-label="Mobile navigation"
      >
          <div className="mx-auto grid max-w-7xl gap-1">
            {primaryNavigationLinks.map((item) => renderMobileLink(item))}
            <p className="px-4 pb-1 pt-3 text-xs font-black uppercase tracking-[0.16em] text-muted">Products</p>
            {productNavigationLinks.map((item) => renderMobileLink(item, true))}
            {secondaryNavigationLinks.map((item) => renderMobileLink(item))}
            <Link onClick={() => setOpen(false)} href={startProjectLink.href} className="mt-2 rounded-full bg-coral px-5 py-3 text-center font-black text-white sm:hidden">{startProjectLink.label}</Link>
          </div>
      </nav>
    </header>
  );
}
