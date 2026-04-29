"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { questionsEmail } from "@/lib/contact";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/m/")) {
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
            Mobile presence kits for local businesses: menu pages, QR codes, public links, photos, and Google profile cleanup.
          </p>
          <a className="mt-3 inline-flex text-sm font-black text-brandDark hover:text-ink" href={`mailto:${questionsEmail}`}>
            {questionsEmail}
          </a>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm font-medium text-muted">
          <Link className="hover:text-ink" href="/privacy">Privacy</Link>
          <Link className="hover:text-ink" href="/terms">Terms</Link>
          <Link className="hover:text-ink" href="/disclaimer">Disclaimer</Link>
          <Link className="hover:text-ink" href="/pricing">Pricing</Link>
        </nav>
      </div>
    </footer>
  );
}
