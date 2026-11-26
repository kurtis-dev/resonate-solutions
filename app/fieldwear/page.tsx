import type { Metadata } from "next";
import { Archive, Search } from "lucide-react";
import { DailyScout } from "@/components/fieldwear/daily-scout";
import { ListingChecker } from "@/components/fieldwear/listing-checker";
import { FreshCatalog, ListingShelf, ListingWorkbench, type ListingView } from "@/components/fieldwear/listing-workbench";
import { ScoutPreferencesForm } from "@/components/fieldwear/scout-preferences";
import { ScoutSubmit } from "@/components/fieldwear/scout-submit";
import { curatedListings, type CuratedListing } from "@/lib/fieldwear/curated-listings";
import { classifyGarment, scoreListing, type ListingInput } from "@/lib/fieldwear/listing-model";
import { listingColors } from "@/lib/fieldwear/listing-colors";
import { listingMeasurements, vintageSignals } from "@/lib/fieldwear/vintage-signals";
import { beanReferenceId, matchLook } from "@/lib/fieldwear/look-search";
import { readScoutEdition } from "@/lib/fieldwear/editions";
import { isScoutOwner, readScoutPreferences, scoutDatabase } from "@/lib/fieldwear/owner-access";
import { departmentLabels, fitPriority, matchesScoutFit, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { freshListingDays, readLiveSearch } from "@/lib/fieldwear/live-search";
import { marketplaceName, matchesMarketplace } from "@/lib/fieldwear/marketplace-directory";
import { redeemOwnerLink, requestOwnerLink, searchScoutLook, searchScoutNow, signOutScout } from "./actions";
import "./scout.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Fieldwear Scout | Resonate Solutions",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const inputClass = "scout-control mt-2 w-full";
const buttonClass = "scout-primary mt-4";

function OwnerSignIn({ token, status }: { token?: string; status?: string }) {
  const validToken = token && /^[a-f0-9]{64}$/.test(token);
  return (
    <main className="fieldwear-scout px-4 py-14 sm:px-7">
      <section className="mx-auto max-w-md rounded border border-[var(--line)] p-6 sm:p-8">
        <h1 className="text-2xl font-semibold">Fieldwear Scout</h1>
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
  run, preferences, items, source,
}: { run: Awaited<ReturnType<typeof readLiveSearch>>; preferences: ScoutPreferences; items: ListingView[]; source?: string }) {
  const coverage = run?.coverage;
  const initialSource = source && items.some((item) => matchesMarketplace(item.source, source)) ? source : undefined;
  const days = run?.days ?? freshListingDays;
  const checked = coverage?.filter((entry) => entry.status === "searched" || entry.status === "partial").length;
  const summary = run ? `Searched ${searchDate.format(new Date(run.searchedAt))} CT` : "";
  const message = !run ? "Run a search to see what’s new."
    : run.expired ? "Your last search is over six hours old. Run it again for current results."
    : run.status === "unconfigured" || run.status === "unavailable" ? "The connected sources couldn’t complete this search. Try again."
    : items.length === 0 ? "No matches in this window. Try fewer keywords or a wider date range."
    : `${items.length} matches · ${checked === undefined ? "" : `${checked} sources checked · `}${summary}`;
  return (
    <section id="fresh" aria-labelledby="fresh-title" className="scroll-mt-4">
      <div className="pt-5 md:pt-7">
        <h1 id="fresh-title" className="text-2xl font-semibold tracking-tight md:text-[28px]">Fresh finds</h1>
        <p className="mt-1 text-xs leading-5 text-[var(--muted-ink)]" aria-label="Saved search sizes">
          {departmentLabels[preferences.department]} · Shirts {preferences.shirtSizes.join(", ") || "any size"} · Bottoms {preferences.pantsSizes.join(", ") || "any size"}
        </p>
        <form action={searchScoutNow} className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:max-w-2xl sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <label className="relative col-span-2 min-w-0 sm:col-span-1">
            <span className="sr-only">Keywords (optional)</span>
            <Search aria-hidden="true" size={16} strokeWidth={1.6} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-ink)]" />
            <input key={run?.searchedAt} name="keywords" type="search" defaultValue={run?.keywords ?? ""} placeholder="Chamois, L.L.Bean, carpenter jeans…" maxLength={80} className="scout-control scout-keywords w-full text-base sm:text-sm" />
          </label>
          <label className="min-w-0">
            <span className="sr-only">Marketplace listing age</span>
            <select name="days" key={run?.searchedAt} defaultValue={String(days)} className="scout-control w-full text-base sm:text-sm">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </label>
          <ScoutSubmit label="Search now" className="scout-primary w-[9.5rem] whitespace-nowrap text-sm" />
        </form>
      </div>
      <p className="pb-3 pt-2 text-xs leading-5 text-[var(--muted-ink)]" role="status">{message}</p>
      {items.length > 0 ? <FreshCatalog key={`${run?.searchedAt}:${initialSource ?? ""}`} items={items} initialSource={initialSource} /> : null}
      {coverage && run && !run.expired ? (
        <details className="mt-5 border-y border-[var(--line)]">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-[var(--accent)]">Source coverage{run.status === "partial" ? " · Some checks failed" : ""}</summary>
          <p className="border-t border-[var(--line)] pt-3 text-xs text-[var(--muted-ink)]">The listing date filter applies to marketplaces. Vintage shops are checked for items in stock.</p>
          <ul className="grid gap-x-5 py-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {coverage.map(({ source, status }) => {
              const count = items.filter((item) => item.source === source).length;
              return <li key={source} className="flex items-baseline justify-between gap-2 py-2"><strong>{marketplaceName(source)}</strong><span className="text-right text-[var(--muted-ink)]">{sourceStatus[status]}{status === "searched" || status === "partial" ? ` · ${count} matches` : ""}</span></li>;
            })}
          </ul>
        </details>
      ) : null}
      {coverage?.some(({ source, status }) => source === "etsy" && (status === "searched" || status === "partial")) ? (
        <p className="mt-2 text-xs leading-5 text-[var(--muted-ink)]">The term &apos;Etsy&apos; is a trademark of Etsy, Inc. This Application uses Etsy&apos;s API, but is not endorsed or certified by Etsy.</p>
      ) : null}
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

type LiveRun = Awaited<ReturnType<typeof readLiveSearch>>;

function LookFinds({ similar, browning, preferences, decisions }: {
  similar: LiveRun; browning: LiveRun; preferences: ScoutPreferences; decisions: Map<string, Decision>;
}) {
  const reference = curatedListings.find((item) => item.source === "grailed" && item.externalId === beanReferenceId);
  const button = "scout-control text-sm font-medium hover:bg-[var(--matte)]";
  const listings = (run: LiveRun) => run?.listings.flatMap((item) => {
    const decision = decisions.get(`${item.source}:${item.externalId}`)?.verdict ?? null;
    const match = run.hunt && matchLook(item, run.hunt);
    if (decision === "pass" || !match) return [];
    return [{ ...toListingView(item, item.listedAt, run.searchedAt, decision, preferences),
      garmentKind: run.hunt?.kind ?? classifyGarment(item), listedAt: item.listedAt, lookNote: match.note, group: match.group }];
  }) ?? [];
  const related = listings(similar);
  const field = listings(browning);
  const patched = field.filter((item) => item.group === "browning-patched");
  const substitutes = field.filter((item) => item.group === "other-patched");
  const otherBrowning = field.filter((item) => item.group === "browning-field");
  const error = (run: LiveRun) => run?.status === "unavailable" ? "The listing sources couldn’t finish. Try running this search again."
    : run?.expired ? "Run this search again for current listings." : null;
  return (
    <section id="find-similar" aria-labelledby="find-similar-title" className="mt-8 scroll-mt-6 border-t border-[var(--line)] pt-5">
      <h2 id="find-similar-title" className="text-xl font-semibold">Find me more like this</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {reference ? (
          <div className="flex min-w-0 gap-4 rounded border border-[var(--line)] p-4">
            <a href={reference.url} target="_blank" rel="noreferrer" className="shrink-0" aria-label="Open the L.L.Bean reference on Grailed">
              {/* eslint-disable-next-line @next/next/no-img-element -- marketplace reference photo */}
              <img src={reference.imageUrl ?? ""} alt="L.L.Bean lined denim reference" className="h-28 w-24 rounded bg-[var(--matte)] object-contain p-1" />
            </a>
            <div className="min-w-0">
              <h3 className="font-bold">L.L.Bean lined denim shirt</h3>
              <p className="mb-3 text-sm text-[var(--muted-ink)]">Your Grailed reference</p>
              <form action={searchScoutLook}>
                <input type="hidden" name="source" value={reference.source} /><input type="hidden" name="externalId" value={reference.externalId} />
                <ScoutSubmit label="Find lined denim shirts" className={button} />
              </form>
            </div>
          </div>
        ) : null}
        <div className="rounded border border-[var(--line)] p-4">
          <h3 className="font-bold">Browning with leather elbows</h3>
          <p className="mb-3 mt-1 text-sm text-[var(--muted-ink)]">Field shirts with leather or suede elbow patches.</p>
          <form action={searchScoutLook}>
            <input type="hidden" name="hunt" value="browning" />
            <ScoutSubmit label="Find Browning shirts" className={button} />
          </form>
        </div>
      </div>
      {similar ? (
        <div id="similar-results" className="mt-6 scroll-mt-24">
          {related.length ? <ListingShelf id="similar-listings" label="Similar finds" description={similar.hunt?.title ?? ""} items={related} comparePrices />
            : <p role="status" className="text-sm text-[var(--muted-ink)]">{error(similar) ?? "No similar listings in your saved sizes and budget this time."}</p>}
        </div>
      ) : null}
      {browning ? (
        <div id="browning-results" className="mt-6 space-y-5 scroll-mt-24">
          {patched.length ? <ListingShelf id="browning-patched" label="Browning with leather or suede elbows" description="Elbow patches described in the listing." items={patched} comparePrices />
            : <p role="status" className="text-sm text-[var(--muted-ink)]">{error(browning) ?? "No Browning with described leather or suede elbow patches in your sizes and budget on this search."}</p>}
          {substitutes.length ? <ListingShelf id="patched-alternatives" label="Leather elbow patches from other makers" description="Similar shirts in your sizes." items={substitutes} comparePrices /> : null}
          {otherBrowning.length ? <ListingShelf id="browning-field" label="Browning field shirts" description="Leather elbow patches unconfirmed." items={otherBrowning} comparePrices /> : null}
        </div>
      ) : null}
    </section>
  );
}

export default async function FieldwearPage({ searchParams }: { searchParams: Promise<{ access?: string; signIn?: string; preferences?: string; view?: string; source?: string }> }) {
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
  const [run, similar, browning] = await Promise.all([
    readLiveSearch(preferences), readLiveSearch(preferences, "similar"), readLiveSearch(preferences, "browning"),
  ]);
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
    <main className="fieldwear-scout pb-12">
      <header className="border-b border-[var(--line)]">
        <div className="scout-container flex min-h-14 items-center justify-between gap-2">
          <a href="/fieldwear" aria-label="Fieldwear Scout" className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap text-[15px] font-semibold tracking-tight">Fieldwear<span className="ml-1 font-normal text-[var(--muted-ink)]">Scout</span></a>
          <nav className="flex items-center text-sm" aria-label="Fieldwear">
            <a href={archived ? "/fieldwear#find-similar" : "#find-similar"} className="inline-flex min-h-11 items-center rounded px-2 hover:bg-[var(--matte)]" aria-label="Find similar listings">Similar</a>
            <a href="#preferences" className="inline-flex min-h-11 items-center rounded px-2 hover:bg-[var(--matte)]" aria-label="Size and search preferences">Sizes</a>
            <a href={archived ? "/fieldwear#saved" : "#saved"} className="inline-flex min-h-11 items-center rounded px-2 hover:bg-[var(--matte)]">Saved</a>
          </nav>
        </div>
      </header>
      <div className="scout-container">
        {archived ? (
          <>
            <div id="archive" className="mb-5 scroll-mt-6 border-b border-[var(--line)] pb-3 pt-5">
              <h1 className="text-2xl font-semibold tracking-tight">Catalog archive</h1>
              <p className="mt-1 text-sm text-[var(--muted-ink)]">Earlier marketplace checks and references. Open the original listing to confirm availability.</p>
              <a href="/fieldwear#fresh" className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline underline-offset-4">Back to fresh finds</a>
            </div>
            <DailyScout edition={edition} items={daily.sort((a, b) => fitPriority(b, preferences) - fitPriority(a, preferences))} preferences={preferences} />
            <ListingWorkbench listings={Array.from(entries.values())} preferences={preferences} />
            <details className="mt-8 border-t border-[var(--line)]">
              <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-[var(--accent)]">Check a listing</summary>
              <ListingChecker preferences={preferences} />
            </details>
          </>
        ) : (
          <>
            <FreshScout run={run} items={live} preferences={preferences} source={params.source} />
            <LookFinds similar={similar} browning={browning} preferences={preferences} decisions={decisions} />
            <section id="saved" className="mt-8 scroll-mt-6 border-t border-[var(--line)] pt-5" aria-label="Saved listings">
              {saved.length ? <ListingShelf id="saved-cards" label="Saved" description="" items={saved} /> : <h2 className="text-xl font-semibold">Saved</h2>}
              {savedLinks.length ? <ul className="grid gap-2">{savedLinks.map((item, index) => (
                <li key={item.externalId}><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline underline-offset-4">Open saved Etsy listing {index + 1}</a></li>
              ))}</ul> : null}
              {!saved.length && !savedLinks.length ? <p className="mt-1 text-sm text-[var(--muted-ink)]">Nothing saved yet.</p> : null}
            </section>
            <a href="/fieldwear?view=archive#archive" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--accent)] underline underline-offset-4"><Archive aria-hidden="true" size={16} />Browse catalog archive</a>
          </>
        )}
        <ScoutPreferencesForm preferences={preferences} status={params.preferences} />
        <form action={signOutScout} noValidate><button className="min-h-11 rounded text-sm font-medium text-[var(--accent)] hover:underline">Sign out</button></form>
      </div>
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
    sizeBasis:input.sizeBasis,
    colors:listingColors(input.title, input.color),
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
