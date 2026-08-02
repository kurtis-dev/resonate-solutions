"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { questionsEmail } from "@/lib/contact";
import { footerNavigationGroups, isGlobalNavigationExcluded } from "@/lib/site-navigation";

export function Footer() {
  const pathname = usePathname();

  if (isGlobalNavigationExcluded(pathname)) {
    return null;
  }

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" aria-label="Resonate Solutions home" className="inline-flex">
            <img
              src="/assets/resonate-logo-transparent.png"
              alt="Resonate Solutions"
              className="h-12 w-auto max-w-[230px] object-contain"
            />
          </Link>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Practical digital systems for small businesses: customer-ready pages, guided intake, business information tools, hosting, and managed support.
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">Based in Northwest Arkansas. Supporting small businesses anywhere.</p>
          <a className="mt-3 inline-flex text-sm font-black text-coral hover:text-ink" href={`mailto:${questionsEmail}`}>
            {questionsEmail}
          </a>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-7 text-sm md:grid-cols-4" aria-label="Footer navigation">
          {footerNavigationGroups.map((group) => (
            <div key={group.label}>
              <p className="font-black text-ink">{group.label}</p>
              <div className="mt-3 grid gap-2 font-medium text-muted">
                {group.links.map((item) => (
                  <Link key={item.href} className="hover:text-ink" href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
