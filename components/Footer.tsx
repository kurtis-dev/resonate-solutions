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
    <footer className="section-seam border-t border-line bg-white">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" aria-label="Resonate Solutions home" className="inline-flex">
            <img
              src="/assets/resonate-logo-transparent.png"
              alt="Resonate Solutions"
              className="h-12 w-auto max-w-[230px] object-contain"
            />
          </Link>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Give customers one clear place to find the right answer and give yourself an easier way to keep it current.
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">Clear business information. Less repetitive upkeep.</p>
          <a className="mt-5 inline-flex rounded-full bg-coral-tint px-4 py-2 text-sm font-black text-coral transition hover:bg-coral hover:text-white" href={`mailto:${questionsEmail}`}>
            {questionsEmail}
          </a>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-7 text-sm md:grid-cols-4" aria-label="Footer navigation">
          {footerNavigationGroups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow text-ink">{group.label}</p>
              <div className="mt-3 grid gap-2 font-medium text-muted">
                {group.links.map((item) => (
                  <Link key={item.href} className="transition hover:translate-x-0.5 hover:text-coral" href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
