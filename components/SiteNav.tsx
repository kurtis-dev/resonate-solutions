"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/m/")) {
    return null;
  }

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
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          <Link className="hover:text-ink" href="/menupilot">Resonate Local</Link>
          <Link className="hover:text-ink" href="/pricing">Pricing</Link>
        </nav>
        <Link href="/menupilot" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-coral">
          Free Local Review
        </Link>
      </div>
    </header>
  );
}
