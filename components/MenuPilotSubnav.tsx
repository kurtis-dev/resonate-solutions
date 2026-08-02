"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationLinkCurrent, menuPilotNavigationLinks } from "@/lib/site-navigation";

export function MenuPilotSubnav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-line bg-[#f7f0e8]" aria-label="MenuPilot navigation">
      <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 py-3">
        <Link href="/menupilot" className="shrink-0 text-sm font-black text-ink" aria-label="MenuPilot overview">
          MenuPilot
        </Link>
        <div className="flex min-w-max items-center gap-1 text-sm font-bold text-muted">
          {menuPilotNavigationLinks.map((item) => {
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
          })}
        </div>
      </div>
    </nav>
  );
}
