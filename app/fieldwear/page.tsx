import type { Metadata } from "next";
import { Archive, Bookmark, Search, ShieldQuestion } from "lucide-react";
import { DailyScout } from "@/components/fieldwear/daily-scout";
import { ListingChecker } from "@/components/fieldwear/listing-checker";
import { FreshCatalog, ListingShelf, ListingWorkbench, type ListingView } from "@/components/fieldwear/listing-workbench";
import { ScoutPreferencesForm } from "@/components/fieldwear/scout-preferences";
import { ScoutSubmit } from "@/components/fieldwear/scout-submit";
import { curatedListings, type CuratedListing } from "@/lib/fieldwear/curated-listings";
import { classifyGarment, scoreListing, type ListingInput } from "@/lib/fieldwear/listing-model";
import { listingMeasurements, vintageSignals } from "@/lib/fieldwear/vintage-signals";
import { readScoutEdition } from "@/lib/fieldwear/editions";
import { isScoutOwner, readScoutPreferences, scoutDatabase } from "@/lib/fieldwear/owner-access";
import { departmentLabels, fitPriority, matchesScoutFit, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { freshListingDays, readLiveSearch } from "@/lib/fieldwear/live-search";
import { marketplaceName } from "@/lib/fieldwear/marketplace-directory";
import { redeemOwnerLink, requestOwnerLink, searchScoutNow, signOutScout } from "./actions";
import "./scout.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Fieldwear Scout | Resonate Solutions",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-black/20 bg-white px-4";
const buttonClass = "mt-4 min-h-12 rounded-xl bg-[var(--pine)] px-5 font-bold text-white hover:opacity-90";

function OwnerSignIn({ token, status }: { token?: string; status?: string }) {
  const validToken = token && /^[a-f0-9]{64}$/.test(token);
  return (
    <main className="fieldwear-scout bg-[var(--paper)] px-4 py-14 text-[var(--ink)] sm:px-7">
      <section className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
        <h1 className="font-display text-4xl">Fieldwear Scout</h1>
        {validToken ? (
          <form action={redeemOwnerLink} noValidate>
            <p className="mt-3">Use your one-time link to sign in on this device.</p>
            <input type="hidden" name="access" value={token} />
            <button className={buttonClass}>Continue to Fieldwear</button>
          </form>
        ) : (
          <form action={requestOwnerLink} noValidate>
            <p className="mt-3">Enter your email to get a private sign-in link.</p>
            <label htmlFor="fieldwear-email" className="mt-5 block font-bold">Email</label>
            <input id="fieldwear-email" name="email" type="email" autoComplete="email" maxLength={254} className={inputClass} />
            <button className={buttonClass}>Send sign-in link</button>
            {status === "requested" ? <p className="mt-4" role="status">If this is the owner email, check your inbox for the link.</p> : null}
            {status === "expired" || (token && !validToken) ? <p className="mt-4" role="status">This link is invalid, expired, or already used. Request a new one.</p> : null}
            {status === "unavailable" ? <p className="mt-4" role="status">Sign-in is unavailable right now.</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

type Decision = { source: string; external_id: string; verdict: string; listing: (ListingInput & { listedAt?: string; checkedAt?: string; linkOnly?: boolean }) | null };

const searchDate = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" });
const sourceStatus = { searched: "Checked", partial: "Partially checked", unavailable: "Check failed", "needs-access": "API access needed", "no-feed": "Live feed unavailable" } as const;

function FreshScout({
  run, preferences, items,
}: { run: Awaited<ReturnType<typeof readLiveSearch>>; preferences: ScoutPreferences; items: ListingView[] }) {
  const coverage = run?.coverage;
  const days = run?.days ?? freshListingDays;
  const checked = coverage?.filter((entry) => entry.status === "searched" || entry.status === "partial").length;
  const summary = run ? `Searched ${searchDate.format(new Date(run.searchedAt))} CT` : "";
  const message = !run ? "Run a search to see what’s new."
    : run.expired ? "Your last search is over six hours old. Run it again for current results."
    : run.status === "unconfigured" || run.status === "unavailable" ? "The connected sources couldn’t complete this search. Try again."
    : items.length === 0 ? "No matches in this window. Try fewer keywords or a wider date range."
    : `${items.length} matches · ${checked === undefined ? "" : `${checked} sources checked · `}${summary}`;
  return (
    <section id="fresh" aria-labelledby="fresh-title" className="scroll-mt-24">
      <div className="mb-5 rounded-[24px] bg-[var(--pine)] px-5 py-6 text-[var(--paper)] sm:px-8">
        <h1 id="fresh-title" className="font-display text-4xl leading-none sm:text-5xl">Fresh finds</h1>
        <form action={searchScoutNow} className="mt-4 flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-bold">
            Keywords <span className="font-normal text-[var(--sand)]">(optional)</span>
            <input key={run?.searchedAt} name="keywords" defaultValue={run?.keywords ?? ""} placeholder="Chamois, L.L.Bean, carpenter jeans…" maxLength={80} className="mt-1 block min-h-12 w-full rounded-xl border border-white/25 bg-white px-3 text-base font-normal text-[var(--ink)]" />
          </label>
          <label className="text-sm font-bold">
            Listed in
            <select name="days" key={run?.searchedAt} defaultValue={String(days)} className="mt-1 block min-h-12 w-full rounded-xl bg-white px-3 text-base font-normal text-[var(--ink)]">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </label>
          <ScoutSubmit label="Search now" className="min-h-12 shrink-0 rounded-xl bg-[var(--sand)] px-5 font-bold text-[var(--pine)]" />
        </form>
        <p className="mt-3 text-sm text-[var(--sand)]">
          {departmentLabels[preferences.department]} · Shirts {preferences.shirtSizes.join(", ") || "any size"} · Bottoms {preferences.pantsSizes.join(", ") || "any size"}
        </p>
      </div>
      <p className="mb-5 text-sm text-[var(--muted-ink)]" role="status">{message}</p>
      {coverage && run && !run.expired ? (
        <details className="mb-5 rounded-2xl border border-black/10 bg-[var(--card)] px-4">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-bold text-[var(--pine)]">Source coverage{run.status === "partial" ? " · Some checks failed" : ""}</summary>
          <ul className="grid gap-x-5 border-t border-black/10 py-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {coverage.map(({ source, status }) => {
              const count = items.filter((item) => item.source === source).length;
              return <li key={source} className="flex items-baseline justify-between gap-2 py-2"><strong>{marketplaceName(source)}</strong><span className="text-right text-[var(--muted-ink)]">{sourceStatus[status]}{status === "searched" || status === "partial" ? ` · ${count} matches` : ""}</span></li>;
            })}
          </ul>
        </details>
      ) : null}
      {coverage?.some(({ source, status }) => source === "etsy" && (status === "searched" || status === "partial")) ? (
        <p className="mb-5 text-sm text-[var(--muted-ink)]">The term &apos;Etsy&apos; is a trademark of Etsy, Inc. This Application uses Etsy&apos;s API, but is not endorsed or certified by Etsy.</p>
      ) : null}
      {items.length > 0 ? <FreshCatalog key={run?.searchedAt} items={items} /> : null}
    </section>
  );
}

function readLegacyScout() {
  try {
    return JSON.parse(process.env.FIELDWEAR_LEGACY_SNAPSHOT ?? "[]") as Decision[];
  } catch {
    return [];
  }
}

export default async function FieldwearPage({ searchParams }: { searchParams: Promise<{ access?: string; signIn?: string; preferences?: string; view?: string }> }) {
  const params = await searchParams;
  if (!(await isScoutOwner())) {
    return <OwnerSignIn token={params.access} status={params.signIn} />;
  }

  const sql = await scoutDatabase();
  const [recorded, edition, preferences] = await Promise.all([
    sql`SELECT source, external_id, verdict, listing FROM fieldwear_decisions` as Promise<Decision[]>,
    params.view === "archive" ? readScoutEdition() : Promise.resolve(null),
    readScoutPreferences(),
  ]);
  const run = await readLiveSearch(preferences);
  const decisions = new Map(readLegacyScout().map((row) => [`${row.source}:${row.external_id}`, row]));
  for (const row of recorded) {
    const key = `${row.source}:${row.external_id}`;
    decisions.set(key, { ...row, listing: row.listing ?? decisions.get(key)?.listing ?? null });
  }

  const entries = new Map<string, ListingView>();
  for (const listing of curatedListings) {
    const updated = listing.provenance.capturedAt;
    const verdict = decisions.get(`${listing.source}:${listing.externalId}`)?.verdict ?? null;
    entries.set(canonicalListingKey(listing.url), toListingView(listing, updated, updated, verdict, preferences, listing));
  }
  for (const { listing, verdict } of Array.from(decisions.values())) {
    if (listing && !listing.linkOnly && !entries.has(canonicalListingKey(listing.url))) {
      const checkedAt = listing.checkedAt ?? listing.listedAt ?? "2026-10-15T00:00:00Z";
      entries.set(canonicalListingKey(listing.url), { ...toListingView(listing, checkedAt, checkedAt, verdict, preferences), listedAt: listing.listedAt });
    }
  }
  const daily: ListingView[] = [];
  if (edition) {
    for (const item of edition.finds) {
      const verdict = decisions.get(`${item.source}:${item.externalId}`)?.verdict ?? null;
      const key = canonicalListingKey(item.url);
      const view = toListingView(item, edition.checkedAt, edition.checkedAt, verdict, preferences);
      view.curatedCategory = entries.get(key)?.curatedCategory;
      view.evidence.sellerClaims.unshift(item.evidence);
      entries.set(key, view);
      if (verdict !== "pass" && (!preferences.matchingOnly || matchesScoutFit(view, preferences))) daily.push(view);
    }
  }
  const live = run ? run.listings.flatMap((item) => {
    const verdict = decisions.get(`${item.source}:${item.externalId}`)?.verdict ?? null;
    return verdict === "pass" ? [] : [{ ...toListingView(item, item.listedAt, run.searchedAt, verdict, preferences), listedAt: item.listedAt }];
  }) : [];
  const saved = Array.from(entries.values()).filter((item) => item.decision === "save");
  const savedLinks = Array.from(decisions.values()).flatMap(({ verdict, listing }) =>
    verdict === "save" && listing?.linkOnly && !entries.has(canonicalListingKey(listing.url)) ? [listing] : [],
  );
  const archived = params.view === "archive";

  return (
    <main className="fieldwear-scout bg-[var(--paper)] px-4 pb-28 pt-6 text-[var(--ink)] sm:px-7">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-lg font-bold">Fieldwear Scout</p>
          <form action={signOutScout} noValidate><button className="min-h-11 rounded-full border border-black/15 bg-white px-4 font-semibold">Sign out</button></form>
        </div>
        <ScoutPreferencesForm preferences={preferences} status={params.preferences} />
        {archived ? (
          <>
            <div id="archive" className="mb-5 scroll-mt-24 rounded-2xl border border-black/10 bg-[var(--card)] p-4">
              <p className="font-bold">Catalog archive</p>
              <p className="mt-1 text-sm text-[var(--muted-ink)]">Earlier marketplace checks and references. Open the original listing to confirm availability.</p>
              <a href="/fieldwear#fresh" className="mt-2 inline-flex min-h-11 items-center font-bold text-[var(--pine)] underline underline-offset-4">Back to fresh finds</a>
            </div>
            <DailyScout edition={edition} items={daily.sort((a, b) => fitPriority(b, preferences) - fitPriority(a, preferences))} preferences={preferences} />
            <ListingWorkbench listings={Array.from(entries.values())} preferences={preferences} />
          </>
        ) : (
          <>
            <FreshScout run={run} items={live} preferences={preferences} />
            {saved.length || savedLinks.length ? (
              <section id="saved" className="mt-8 scroll-mt-24" aria-label="Saved listings">
                {saved.length ? <ListingShelf id="saved-cards" label="Saved" description="Pieces you marked to revisit." items={saved} /> : null}
                {savedLinks.length ? <ul className="grid gap-2">{savedLinks.map((item, index) => (
                  <li key={item.externalId}><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-bold text-[var(--pine)] underline underline-offset-4">Open saved Etsy listing {index + 1}</a></li>
                ))}</ul> : null}
              </section>
            ) : null}
            <a href="/fieldwear?view=archive#archive" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-[var(--pine)] underline underline-offset-4"><Archive size={17} />Browse catalog archive</a>
          </>
        )}
        <div className="mt-12"><ListingChecker preferences={preferences} /></div>
      </div>
      <nav aria-label="Fieldwear" className="fixed bottom-[calc(.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 flex w-[min(390px,calc(100%-24px))] -translate-x-1/2 rounded-2xl bg-[var(--pine)] px-1 py-2 text-white shadow-lg sm:hidden">
        <a href="/fieldwear#fresh" className="grid min-h-12 flex-1 place-items-center text-xs"><Search size={18}/>Fresh</a>
        {saved.length || savedLinks.length ? <a href="/fieldwear#saved" className="grid min-h-12 flex-1 place-items-center text-xs"><Bookmark size={18}/>Saved</a> : null}
        <a href="/fieldwear?view=archive#archive" className="grid min-h-12 flex-1 place-items-center text-xs"><Archive size={18}/>Archive</a>
        <a href="#check" className="grid min-h-12 flex-1 place-items-center text-xs"><ShieldQuestion size={18}/>Check</a>
      </nav>
    </main>
  );
}

function toListingView(
  input:ListingInput,
  firstSeenAt:string,
  lastSeenAt:string,
  decision:string|null,
  preferences:ScoutPreferences,
  curated?:CuratedListing,
):ListingView {
  const rescored = scoreListing(input, preferences);
  const sellerClaims = [...rescored.evidence.sellerClaims];
  const confirmed = [...rescored.evidence.confirmed];
  const visualClues = [...rescored.evidence.visualClues];
  const missing = [...rescored.missing];

  if (curated) {
    sellerClaims.push(
      curated.curatedEvidence.fiberClaim,
      curated.curatedEvidence.eraClaim,
      curated.curatedEvidence.originClaim,
    );
    confirmed.push(`Marketplace snapshot captured ${new Date(curated.provenance.capturedAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric", timeZone:"UTC" })}`);
    visualClues.push(...(curated.curatedEvidence.corroboratingClues ?? []));
    missing.push("Recheck current availability and seller details on the original listing");
  }

  return {
    source:input.source,
    externalId:input.externalId,
    url:input.url,
    title:input.title,
    imageUrl:input.imageUrl ?? null,
    priceCents:input.priceCents ?? null,
    shippingCents:input.shippingCents ?? null,
    size:input.size ?? null,
    measurements:listingMeasurements(input.description),
    vintage:vintageSignals(input),
    condition:input.condition ?? null,
    firstSeenAt,
    lastSeenAt,
    totalScore:rescored.total,
    fitScore:rescored.fit,
    constructionScore:rescored.construction,
    ageScore:rescored.age,
    conditionScore:rescored.condition,
    valueScore:rescored.value,
    documentationScore:rescored.documentation,
    tasteMatch:rescored.tasteMatch,
    tasteReasons:curated ? [curated.curatedEvidence.curationNote, ...rescored.tasteReasons] : rescored.tasteReasons,
    eraConfidence:rescored.eraConfidence,
    eraReasons:rescored.eraReasons,
    qualityException:rescored.qualityException,
    garmentKind:classifyGarment(input),
    evidence:{ ...rescored.evidence, confirmed, sellerClaims:Array.from(new Set(sellerClaims)), visualClues:Array.from(new Set(visualClues)), hiddenBargain:rescored.hiddenBargain },
    concerns:rescored.concerns,
    missing:Array.from(new Set(missing)),
    decision,
    curatedCategory:curated?.category ?? null,
  };
}

function canonicalListingKey(rawUrl:string) {
  try {
    const url = new URL(rawUrl);
    url.hash = "";
    url.search = "";
    return `${url.hostname.replace(/^www\./, "").toLowerCase()}${url.pathname.replace(/\/$/, "").toLowerCase()}`;
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}
