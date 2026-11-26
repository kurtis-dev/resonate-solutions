import { ListingShelf, type ListingView } from "@/components/fieldwear/listing-workbench";
import { scoutDay, scoutSources, scoutTimeZone, type DailyEdition } from "@/lib/fieldwear/daily-scout";
import { marketplaceQuery, type ScoutPreferences } from "@/lib/fieldwear/preferences";

const coverageLabels = {
  searched: "Searched",
  limited: "Limited results",
  unavailable: "Unavailable",
  "not-checked": "Awaiting check",
};

const checkedDate = new Intl.DateTimeFormat("en-US", {
  timeZone: scoutTimeZone, weekday: "short", month: "short", day: "numeric",
  hour: "numeric", minute: "2-digit", timeZoneName: "short",
});

export function DailyScout({ edition, items, preferences }: { edition: DailyEdition | null; items: ListingView[]; preferences: ScoutPreferences }) {
  const coverage = new Map(edition?.coverage.map((entry) => [entry.source, entry.status]));
  const searchedCount = edition?.coverage.filter(({ status }) => status === "searched").length ?? 0;
  const limitedCount = edition?.coverage.filter(({ status }) => status === "limited").length ?? 0;
  const isToday = edition?.day === scoutDay();

  return (
    <section id="daily" aria-labelledby="daily-title" className="mb-10 scroll-mt-24 border-b border-black/10 pb-7 sm:mb-12">
      <div className="mb-5 rounded-[24px] bg-[var(--pine)] px-5 py-6 text-[var(--paper)] sm:px-8 sm:py-7">
        <h1 id="daily-title" className="font-display text-[clamp(2.25rem,8vw,4rem)] leading-none">Daily scout</h1>
        <p className="mt-3 text-base leading-6">
          {edition ? `${isToday ? "Checked" : "Last checked"} ${checkedDate.format(new Date(edition.checkedAt))}` : "Waiting for the first daily check."}
          {edition ? <span className="block text-sm text-[var(--sand)] sm:ml-3 sm:inline">{searchedCount} searched · {limitedCount} limited · {scoutSources.length - searchedCount - limitedCount} unavailable or unchecked</span> : null}
        </p>
      </div>
      {items.length > 0
        ? <ListingShelf id="daily-finds" label="New finds" description="Open the original listing to confirm availability and measurements." items={items} />
        : <p className="mb-5 text-base text-[var(--muted-ink)]">{edition ? "No new matches to show from this check. Try the marketplace searches below." : "New matches will appear here. Browse the catalog or search individual marketplaces below."}</p>}
      <details className="rounded-2xl border border-black/10 bg-[var(--card)] px-4">
        <summary className="min-h-12 cursor-pointer py-3 text-base font-semibold text-[var(--pine)]">Marketplace coverage and searches</summary>
        <ul className="grid gap-x-5 gap-y-1 border-t border-black/10 py-2 sm:grid-cols-2 lg:grid-cols-4">
          {scoutSources.map(([id, label, search]) => (
            <li key={id} className="min-w-0 py-2">
              <p className="text-sm"><strong>{label}</strong> <span className="text-[var(--muted-ink)]">· {coverageLabels[coverage.get(id) ?? "not-checked"]}</span></p>
              {([["Shirts", preferences.shirtSizes], ["Bottoms", preferences.pantsSizes]] as const).map(([garment, sizes]) => (
                <div key={garment} className="mt-2">
                  <p className="text-xs font-semibold text-[var(--muted-ink)]">{garment}</p>
                  <div className="flex flex-wrap gap-x-3 text-sm font-semibold text-[var(--pine)]">
                    {(sizes.length ? sizes : [""]).map((size) => (
                      <a key={size} href={search + encodeURIComponent(marketplaceQuery(preferences, garment === "Bottoms", size))} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">{size || "Any size"}<span className="sr-only"> {garment.toLowerCase()} on {label}</span></a>
                    ))}
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
