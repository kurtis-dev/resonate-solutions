"use client";

import { useEffect } from "react";

type Activity = "view" | "visible-time" | "listing-open" | "seller-click";
const sections = ["fresh", "fit", "join", "first-dibs"] as const;
type Section = "masthead" | (typeof sections)[number];

export function recordSeamsActivity(event: Activity, kind = "", source = "", seconds = 0) {
  if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
  const payload = JSON.stringify({ event, kind, source, seconds });
  navigator.sendBeacon?.("/api/seams-familiar/activity", new Blob([payload], { type: "application/json" }));
}

export function SeamsActivity({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const visible = () => document.visibilityState === "visible";
    const regions = sections.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });
    const activeSection = (): Section => {
      const line = window.innerHeight * .45;
      return regions.find(({ element }) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top <= line && bounds.bottom > line;
      })?.id ?? "masthead";
    };
    const milliseconds = new Map<Section, number>();
    let viewed = false;
    let start: number | null = null;
    let section = activeSection();
    let frame = 0;

    const capture = () => {
      if (start !== null) milliseconds.set(section, (milliseconds.get(section) ?? 0) + performance.now() - start);
      start = null;
    };
    const flush = () => {
      capture();
      for (const [area, ms] of Array.from(milliseconds)) {
        const seconds = Math.min(1800, Math.floor(ms / 1000));
        if (seconds >= 1) recordSeamsActivity("visible-time", area, "", seconds);
      }
      milliseconds.clear();
    };
    const applyVisibility = () => {
      if (!visible()) { flush(); return; }
      if (!viewed) { recordSeamsActivity("view"); viewed = true; }
      section = activeSection();
      start ??= performance.now();
    };
    const updateSection = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!visible()) return;
        const next = activeSection();
        if (next === section) return;
        capture();
        section = next;
        start = performance.now();
      });
    };

    applyVisibility();
    document.addEventListener("visibilitychange", applyVisibility);
    window.addEventListener("pagehide", flush);
    window.addEventListener("pageshow", applyVisibility);
    window.addEventListener("scroll", updateSection, { passive: true });
    return () => {
      flush();
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", applyVisibility);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("pageshow", applyVisibility);
      window.removeEventListener("scroll", updateSection);
    };
  }, [pageKey]);
  return null;
}
