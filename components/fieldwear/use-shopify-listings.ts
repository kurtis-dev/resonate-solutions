import { useEffect, useState } from "react";
import type { ListingView } from "./listing-workbench";

const empty: ListingView[] = [];

export function useShopifyListings(url?: string) {
  const [result, setResult] = useState<{ url: string; items: ListingView[] }>();
  useEffect(() => {
    if (!url) return;
    let expiresAt = 0;
    let deadline: number | undefined;
    let request: AbortController | undefined;

    async function load() {
      if (request || document.hidden || !url) return;
      const controller = new AbortController();
      request = controller;
      try {
        const response = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const payload = await response.json() as { items: ListingView[]; expiresAt: number };
        if (controller.signal.aborted || !Array.isArray(payload.items) || !Number.isFinite(payload.expiresAt) || payload.expiresAt <= Date.now()) return;
        expiresAt = payload.expiresAt;
        setResult({ url, items: payload.items });
        deadline = window.setTimeout(check, expiresAt - Date.now());
      } catch {
        // The rest of the catalog can still be browsed during a feed outage.
      } finally {
        request = undefined;
      }
    }

    function check() {
      if (Date.now() < expiresAt) return;
      if (expiresAt) {
        expiresAt = 0;
        setResult((current) => current?.url === url ? undefined : current);
      }
      void load();
    }

    void load();
    document.addEventListener("visibilitychange", check);
    return () => {
      request?.abort();
      window.clearTimeout(deadline);
      document.removeEventListener("visibilitychange", check);
    };
  }, [url]);

  return url && result?.url === url ? result.items : empty;
}
