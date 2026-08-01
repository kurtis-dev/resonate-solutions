"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { questionsEmail } from "@/lib/contact";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/m/") || pathname.startsWith("/excellent-pins")) {
    return null;
  }

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <img
            src="/assets/resonate-logo-transparent.png"
            alt="Resonate Solutions"
            className="h-12 w-auto max-w-[230px] object-contain"
          />
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Practical digital systems for small businesses: customer-ready pages, guided intake, business information tools, hosting, and managed support.
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">Built in Northwest Arkansas</p>
          <a className="mt-3 inline-flex text-sm font-black text-coral hover:text-ink" href={`mailto:${questionsEmail}`}>
            {questionsEmail}
          </a>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm font-medium text-muted" aria-label="Footer navigation">
          <Link className="hover:text-ink" href="/#solutions">Solutions</Link>
          <Link className="hover:text-ink" href="/#work">Our Work</Link>
          <Link className="hover:text-ink" href="/menupilot">MenuPilot</Link>
          <Link className="hover:text-ink" href="/privacy">Privacy</Link>
          <Link className="hover:text-ink" href="/terms">Terms</Link>
          <Link className="hover:text-ink" href="/disclaimer">Disclaimer</Link>
          <Link className="hover:text-ink" href="/pricing">Pricing</Link>
          <Link className="hover:text-ink" href="/billing">Billing</Link>
        </nav>
      </div>
    </footer>
  );
}
