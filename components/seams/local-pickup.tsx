"use client";

import { useState, type FormEvent } from "react";
import { FreshCatalog, type ListingView } from "@/components/fieldwear/listing-workbench";

export function LocalPickup({ department }: { department: "any" | "men" | "women" }) {
  const [searched, setSearched] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [partial, setPartial] = useState(false);
  const [items, setItems] = useState<ListingView[]>([]);
  const [searchId, setSearchId] = useState(0);

  async function findPickup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const zip = String(new FormData(event.currentTarget).get("zip") ?? "").trim();
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a five-digit US ZIP code.");
      return;
    }

    setPending(true);
    setSearched(false);
    setError("");
    try {
      const response = await fetch("/api/seams-familiar/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip, department }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json() as { items?: ListingView[]; error?: string; partial?: boolean };
      if (!response.ok) throw new Error(result.error ?? "Pickup search is temporarily unavailable. Try again later.");
      setItems(result.items ?? []);
      setPartial(Boolean(result.partial));
      setSearchId((id) => id + 1);
      setSearched(true);
    } catch (failure) {
      setError(failure instanceof Error && failure.name === "Error" ? failure.message : "Pickup search was interrupted. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <details className="mb-4 rounded border border-[var(--line)]">
      <summary className="min-h-11 cursor-pointer px-3 py-3 text-sm font-semibold">Local pickup</summary>
      <div className="px-3 pb-3">
        <p id="pickup-help" className="text-sm text-[var(--muted-ink)]">Find Goodwill pickup options within about 50 miles. Seams Familiar sends your ZIP to eBay for this search only.</p>
        <form noValidate onSubmit={findPickup} className="my-3 flex flex-wrap items-end gap-2">
          <label className="text-sm font-medium">US ZIP code
            <input name="zip" inputMode="numeric" maxLength={5} autoComplete="postal-code" className="scout-control mt-1 block w-32 text-base"
              aria-describedby="pickup-help" />
          </label>
          <button type="submit" disabled={pending} className="scout-primary min-w-32 text-sm">{pending ? "Searching…" : "Find pickup"}</button>
        </form>
        {error ? <p role="alert" className="mb-3 text-sm">{error}</p> : null}
        {searched ? <p role="status" className="mb-3 text-sm">{items.length
          ? `${items.length} pickup ${items.length === 1 ? "match" : "matches"} within about 50 miles.${partial ? " Some searches were unavailable." : ""}`
          : partial ? "No matches from the searches that finished. Try again later." : "No matching Goodwill clothing with pickup within 50 miles."}</p> : null}
        {searched && items.length ? <FreshCatalog key={searchId} items={items} womenswear={department !== "men"} compactFilters personalActions={false} showNinetiesCollection={false} /> : null}
        <a href="https://www.goodwill.org/locator/" target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm underline underline-offset-4">Find a Goodwill store</a>
      </div>
    </details>
  );
}
