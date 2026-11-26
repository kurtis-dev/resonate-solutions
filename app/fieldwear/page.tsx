import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { catalogHref, catalogProfile, departmentLabels, fitPriority, matchesScoutFit, type CatalogProfile, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { readLiveSearch } from "@/lib/fieldwear/live-search";
import { searchShopifyCatalog } from "@/lib/fieldwear/shopify-catalog";
import { marketplaceBrowse, marketplaceName, matchesMarketplace } from "@/lib/fieldwear/marketplace-directory";
import { firstDibsEnabled } from "@/lib/fieldwear/first-dibs";
import { setFirstDibs, redeemOwnerLink, requestOwnerLink, searchScoutLook, searchScoutNow, signOutScout } from "./actions";
import "./scout.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Seams Familiar | Resonate Solutions",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const inputClass = "scout-control mt-2 w-full";
const buttonClass = "scout-primary mt-4";

function ResonateLogo() {
  return <Link href="/" className="scout-brand-link"><Image src="/assets/resonate-logo-transparent.png" alt="Resonate Solutions" width={148} height={41} className="scout-brand-logo" /></Link>;
}

function OwnerSignIn({ token, status }: { token?: string; status?: string }) {
  const validToken = token && /^[a-f0-9]{64}$/.test(token);
  return (
    <main className="fieldwear-scout px-4 py-14 sm:px-7">
      <section className="mx-auto max-w-md rounded border border-[var(--line)] p-6 sm:p-8">
        <ResonateLogo />
        <h1 className="mt-4 text-2xl font-semibold">Seams Familiar</h1>
        {validToken ? (
          <form action={redeemOwnerLink} noValidate>
            <p className="mt-3">Use your one-time link to sign in on this device.</p>
            <input type="hidden" name="access" value={token} />
            <button className={buttonClass}>Continue to Seams Familiar</button>
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

const sourceStatus = { searched: "Checked", partial: "Partially checked", unavailable: "Check failed", "needs-access": "API access needed", "no-feed": "Live feed unavailable" } as const;

function FreshScout({
  run, preferences, profile, items, source, catalog, daily,
}: { run: Awaited<ReturnType<typeof readLiveSearch>>; preferences: ScoutPreferences; profile: CatalogProfile; daily: boolean; items: ListingView[]; source?: string; catalog?: Awaited<ReturnType<typeof searchShopifyCatalog>> }) {
  const coverage = run?.coverage;
  const sources: { source: string; status: keyof typeof sourceStatus }[] = [...(coverage ?? []), ...(catalog ? [{ source: "shopifycatalog", status: catalog.status }] : [])];
  const initialSource = source && items.some((item) => matchesMarketplace(item.source, source)) ? source : undefined;
  const sourceCount = sources.filter((entry) => entry.status === "searched" || entry.status === "partial").length;
  const message = items.length ? `${daily ? "Daily catalog · " : ""}${items.length} matches · ${sourceCount} sources checked`
    : !run || run.expired ? "Search connected shops and marketplaces for available clothing."
    : run.status === "unconfigured" || run.status === "unavailable" ? "The connected marketplaces couldn’t complete this search. Try again."
    : "No available listings matched. Try fewer keywords.";
  return (
    <section id="fresh" aria-labelledby="fresh-title" className="scroll-mt-4">
      <div className="pt-5 md:pt-7">
        <div className="scout-brand-hero">
          <span className="scout-film-stripe" aria-hidden="true" />
          <span className="scout-90s-graphic" aria-hidden="true"><i /><i /><i /></span>
          <h1 id="fresh-title">Seams<br className="sm:hidden" /> Familiar</h1>
          <p>Vintage clothing · Good clothes come around again.</p>
        </div>
        <nav className="scout-departments" aria-label="Catalog departments">
          <Link href={catalogHref("owner")} aria-current={profile === "owner" ? "page" : undefined}>Men’s</Link>
          <Link href={catalogHref("women")} aria-current={profile === "women" ? "page" : undefined}>Women’s</Link>
          <a href="#first-dibs" className="scout-dibs-shortcut">First dibs</a>
        </nav>
        <p className="mt-1 text-xs leading-5 text-[var(--muted-ink)]" aria-label="Saved search sizes">
          {departmentLabels[preferences.department]} · {profile === "women" ? "Tops & dresses" : "Shirts"} {preferences.shirtSizes.join(", ") || "any size"} · Bottoms {preferences.pantsSizes.join(", ") || "any size"}{preferences.pantsBudget != null ? ` · Up to $${preferences.pantsBudget}` : ""}
        </p>
        <form action={searchScoutNow} className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:max-w-2xl">
          <input type="hidden" name="profile" value={profile} />
          <label className="relative min-w-0">
            <span className="sr-only">Keywords (optional)</span>
            <Search aria-hidden="true" size={16} strokeWidth={1.6} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-ink)]" />
            <input key={run?.searchedAt} name="keywords" type="search" defaultValue={run?.keywords ?? ""} placeholder={profile === "women" ? "Wool skirts, denim, cotton blouses…" : "Chamois, L.L.Bean, carpenter jeans…"} maxLength={80} className="scout-control scout-keywords w-full text-base sm:text-sm" />
          </label>
          <ScoutSubmit label="Search now" className="scout-primary whitespace-nowrap px-4 text-sm" />
        </form>
      </div>
      <p className="pb-3 pt-2 text-xs leading-5 text-[var(--muted-ink)]" role="status">{message}</p>
      {items.length > 0 ? <FreshCatalog key={`${run?.searchedAt}:${initialSource ?? ""}`} items={items} initialSource={initialSource} womenswear={profile === "women"} catalogExpiresAt={catalog?.expiresAt} /> : null}
      {catalog && !catalog.listings.length ? (
        <p role="status" className="mt-3 text-xs text-[var(--muted-ink)]">{catalog.status === "unavailable"
          ? "Shopify Global Catalog couldn’t finish this search. The other sources are still shown."
          : "Shopify Global Catalog found no available items that matched this search."}</p>
      ) : null}
      {coverage && run && !run.expired ? (
        <details className="mt-5 border-y border-[var(--line)]">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-[var(--accent)]">Source coverage{run.status === "partial" || catalog?.status === "partial" || catalog?.status === "unavailable" ? " · Some checks failed" : ""}</summary>
          <p className="border-t border-[var(--line)] pt-3 text-xs text-[var(--muted-ink)]">“Browse on site” opens a separate marketplace search.</p>
          <ul className="grid gap-x-5 py-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {sources.map(({ source, status }) => {
              const count = items.filter((item) => item.source === source).length;
              return (
                <li key={source} className="flex items-baseline justify-between gap-2 py-2">
                  <strong>{marketplaceName(source)}</strong>
                  {(status === "no-feed" || status === "needs-access") && marketplaceBrowse[source] ? (
                    <a href={marketplaceBrowse[source].url} target="_blank" rel="noreferrer" className="text-right text-[var(--accent)] underline underline-offset-4" aria-label={`Browse ${marketplaceName(source)} on its website`}>
                      Browse on site
                    </a>
                  ) : (
                    <span className="text-right text-[var(--muted-ink)]">{sourceStatus[status]}{status === "searched" || status === "partial" ? ` · ${count} ${count === 1 ? "match" : "matches"}` : ""}</span>
                  )}
                </li>
              );
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

export default async function FieldwearPage({ searchParams }: { searchParams: Promise<{ access?: string; signIn?: string; preferences?: string; view?: string; source?: string; catalog?: string; alerts?: string; department?: string }> }) {
  const params = await searchParams;
  const profile = catalogProfile(params.department);
  if (!(await isScoutOwner())) {
    return <OwnerSignIn token={params.access} status={params.signIn} />;
  }

  const sql = await scoutDatabase();
  const [recorded, edition, preferences, alertsEnabled] = await Promise.all([
    sql`SELECT source, external_id, verdict, listing FROM fieldwear_decisions` as Promise<Decision[]>,
    params.view === "archive" ? readScoutEdition() : Promise.resolve(null),
    readScoutPreferences(profile),
    firstDibsEnabled(),
  ]);
  const [manual, dailyRun, similar, browning] = await Promise.all([
    readLiveSearch(preferences, "owner", profile), readLiveSearch(preferences, "daily", profile),
    profile === "owner" ? readLiveSearch(preferences, "similar") : null,
    profile === "owner" ? readLiveSearch(preferences, "browning") : null,
  ]);
  const availableManual = manual && !manual.expired && manual.status !== "unavailable" ? manual : null;
  const availableDaily = dailyRun && !dailyRun.expired ? dailyRun : null;
  const run = params.catalog === "1" ? availableManual ?? availableDaily ?? manual : availableDaily ?? availableManual ?? manual;
  const catalog = (params.catalog === "1" || (!run && profile === "women")) && params.view !== "archive"
    ? await searchShopifyCatalog(preferences, run?.keywords ?? "")
    : undefined;
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
  const passedUrls = new Set(Array.from(decisions.values()).flatMap(({ verdict, listing }) => verdict === "pass" && listing ? [canonicalListingKey(listing.url)] : []));
  const catalogItems = catalog?.listings.flatMap((item) => {
    if (passedUrls.has(canonicalListingKey(item.url))) return [];
    const checkedAt = new Date(catalog.checkedAt).toISOString();
    return toListingView(item, checkedAt, checkedAt, null, preferences);
  }) ?? [];
  const freshItems = Array.from(new Map([...catalogItems, ...live].map((item) => [canonicalListingKey(item.url), item])).values());
  const saved = Array.from(entries.values()).filter((item) => item.decision === "save");
  const savedLinks = Array.from(decisions.values()).flatMap(({ verdict, listing }) =>
    verdict === "save" && listing?.linkOnly && !entries.has(canonicalListingKey(listing.url)) ? [listing] : [],
  );
  const archived = params.view === "archive";

  return (
    <main className="fieldwear-scout pb-12">
      <header className="border-b border-[var(--line)]">
        <div className="scout-container flex min-h-16 items-center justify-between gap-2">
          <div className="scout-brand-lockup">
            <ResonateLogo />
            <a href="/fieldwear" className="scout-app-name">Seams Familiar</a>
          </div>
          <nav className="flex items-center text-sm" aria-label="Fieldwear">
            {profile === "owner" ? <a href={archived ? "/fieldwear#find-similar" : "#find-similar"} className="inline-flex min-h-11 items-center rounded px-2 hover:bg-[var(--matte)]" aria-label="Find similar listings">Similar</a> : null}
            <a href="#first-dibs" className="hidden min-h-11 items-center rounded px-2 hover:bg-[var(--matte)] sm:inline-flex">First dibs</a>
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
              <a href={catalogHref(profile)} className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline underline-offset-4">Back to catalog</a>
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
            <FreshScout run={run} items={freshItems} preferences={preferences} profile={profile} daily={run != null && run === availableDaily} source={params.source} catalog={catalog} />
            {profile === "owner" ? <LookFinds similar={similar} browning={browning} preferences={preferences} decisions={decisions} /> : null}
            <section id="saved" className="mt-8 scroll-mt-6 border-t border-[var(--line)] pt-5" aria-label="Saved listings">
              {saved.length ? <ListingShelf id="saved-cards" label="Saved" description="" items={saved} /> : <h2 className="text-xl font-semibold">Saved</h2>}
              {savedLinks.length ? <ul className="grid gap-2">{savedLinks.map((item, index) => (
                <li key={item.externalId}><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--accent)] underline underline-offset-4">Open saved Etsy listing {index + 1}</a></li>
              ))}</ul> : null}
              {!saved.length && !savedLinks.length ? <p className="mt-1 text-sm text-[var(--muted-ink)]">Nothing saved yet.</p> : null}
            </section>
            <a href={catalogHref(profile, {view: "archive"}, "archive")} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--accent)] underline underline-offset-4"><Archive aria-hidden="true" size={16} />Browse catalog archive</a>
          </>
        )}
        <section id="first-dibs" aria-labelledby="first-dibs-title" className="scout-first-dibs">
          <span className="scout-90s-graphic" aria-hidden="true"><i /><i /><i /></span>
          <div>
            <h2 id="first-dibs-title" className="text-xl font-semibold tracking-tight">Get first dibs</h2>
            <p id="first-dibs-description" className="mt-1 text-sm">Get a daily email when Scout finds more workwear in your saved sizes and budget.</p>
          </div>
          <form action={setFirstDibs} aria-describedby="first-dibs-description" className="scout-first-dibs-form">
            <input type="hidden" name="profile" value={profile} />
            <input type="hidden" name="enabled" value={alertsEnabled ? "off" : "on"} />
            <ScoutSubmit className={alertsEnabled ? "scout-control" : "scout-primary"} label={alertsEnabled ? "Turn off emails" : "Sign me up"} pendingLabel="Saving…" />
            <p className="text-xs" role="status">{params.alerts === "enabled" ? "You’re signed up. Scout uses your sign-in email."
              : params.alerts === "disabled" ? "First dibs emails are off."
              : params.alerts === "unavailable" ? "Scout couldn’t update your email settings. Try again."
              : alertsEnabled ? "Emails are on." : "Sent to your Scout sign-in email."}</p>
          </form>
        </section>
        <ScoutPreferencesForm preferences={preferences} profile={profile} status={params.preferences} />
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
    sellerName: input.source === "shopifycatalog" ? input.seller ?? null : null,
    externalId:input.externalId,
    url:input.url,
    title:input.title,
    imageUrl:input.imageUrl ?? null,
    imageUrls:input.imageUrls,
    priceCents:input.priceCents ?? null,
    priceKind:input.priceKind,
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
