"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isNavigationLinkCurrent, menuPilotNavigationLinks } from "@/lib/site-navigation";

export function MenuPilotSubnav() {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const updateScrollHint = () => {
      const remainingScroll = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
      setCanScrollRight(remainingScroll > 2);
    };

    const revealActiveDestination = () => {
      const activeLink = scroller.querySelector<HTMLElement>('[aria-current="page"]');

      if (!activeLink) {
        updateScrollHint();
        return;
      }

      const scrollerBounds = scroller.getBoundingClientRect();
      const activeBounds = activeLink.getBoundingClientRect();

      if (activeBounds.left < scrollerBounds.left || activeBounds.right > scrollerBounds.right) {
        scroller.scrollTo({
          left:
            scroller.scrollLeft +
            activeBounds.left -
            scrollerBounds.left -
            (scroller.clientWidth - activeBounds.width) / 2,
          behavior: "auto"
        });
      }

      updateScrollHint();
    };

    const animationFrame = window.requestAnimationFrame(revealActiveDestination);
    const resizeObserver = new ResizeObserver(updateScrollHint);

    resizeObserver.observe(scroller);
    if (scroller.firstElementChild) {
      resizeObserver.observe(scroller.firstElementChild);
    }
    scroller.addEventListener("scroll", updateScrollHint, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateScrollHint);
    };
  }, [pathname]);

  const revealFocusedDestination = (target: HTMLElement) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const scrollerBounds = scroller.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();

    if (targetBounds.left < scrollerBounds.left || targetBounds.right > scrollerBounds.right) {
      scroller.scrollBy({
        left: targetBounds.left - scrollerBounds.left - 24,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="border-b border-line bg-[#f7f0e8]/95 backdrop-blur" aria-label="MenuPilot navigation">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="container-page flex touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onFocusCapture={(event) => revealFocusedDestination(event.target as HTMLElement)}
        >
          <Link href="/menupilot" className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-black text-white" aria-label="MenuPilot overview">
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
                  className={`rounded-full px-3.5 py-2 transition hover:bg-white hover:text-ink ${active ? "bg-white text-ink shadow-sm" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#f7f0e8] via-[#f7f0e8]/90 to-transparent transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </nav>
  );
}
