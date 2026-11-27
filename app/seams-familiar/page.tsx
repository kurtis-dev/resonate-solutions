import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { FreshCatalog } from "@/components/fieldwear/listing-workbench";
import { LocalPickup } from "@/components/seams/local-pickup";
import { SeamsActivity } from "@/components/seams/activity";
import { ScoutSubmit } from "@/components/fieldwear/scout-submit";
import { vintageSignals } from "@/lib/fieldwear/vintage-signals";
import { pageMetadata } from "@/lib/seo";
import { toListingView } from "@/lib/fieldwear/listing-view";
import { goodwillShelf, interestLabels, matchSeamsCatalog, previewSeamsCatalog, readSeamsCatalog } from "@/lib/seams/catalog";
import { firstDibsPickLimit, firstDibsReady } from "@/lib/seams/digest";
import { defaultMemberSettings, readMember, seamsPath, type Member, type MemberSettings } from "@/lib/seams/members";
import { continueSeams, requestMemberLink, saveMemberDibs, saveMemberFit, searchMemberCatalog, signOutSeams, stopFirstDibs } from "./actions";
import "../fieldwear/scout.css";

const fraunces = localFont({
  src: "./fonts/fraunces-semibold.woff2",
  weight: "600",
  display: "swap",
  variable: "--seams-wordmark-font",
});

export const dynamic = "force-dynamic";
type CatalogShelf = "" | "tour-shirts" | "goodwill" | "goodwill-pants";
type CatalogQuery = { access?: string; status?: string; q?: string; unsubscribe?: string; department?: string; collection?: string; decade?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<CatalogQuery> }): Promise<Metadata> {
  const params = await searchParams;
  const privateLink = Boolean(params.access || params.unsubscribe);
  return {
    ...pageMetadata({
      title: "Seams Familiar | Vintage Clothing Finder",
      description: "Browse vintage clothing, workwear and band tour shirts from independent shops. Explore the 80s and 90s, filter by size and budget, and shop the original listings.",
      path: seamsPath,
      robots: privateLink ? { index: false, follow: false } : undefined,
    }),
    referrer: "no-referrer",
  };
}

const field = "scout-control mt-1 block w-full text-base";
const button = "scout-primary px-4 text-sm";
const notice = "mt-3 text-sm text-[var(--muted-ink)]";

function FirstDibsDetails() {
  return (
    <>
      <p className="mt-1 text-sm">An optional morning email with up to {firstDibsPickLimit} finds that match your saved sizes, budget, and styles.</p>
      <p className="mt-2 text-sm text-[var(--muted-ink)]">Each pick includes the listed size when available, the price or current bid, and a link to the seller, where anyone can still buy the item. You get an email only when there’s a match we haven’t sent you in the last 60 days.</p>
    </>
  );
}

function Welcome({ access, status }: { access?: string; status?: string }) {
  const valid = access && /^[a-f0-9]{64}$/.test(access);
  return (
    <section id="join" className="my-6 max-w-xl scroll-mt-5 rounded border border-[var(--line)] p-5 sm:p-7" aria-labelledby="welcome-title">
      <h2 id="welcome-title" className="text-2xl font-bold tracking-tight">{valid ? "Finish signing in" : "Join Seams Familiar"}</h2>
      {valid ? (
        <form action={continueSeams}>
          <input type="hidden" name="access" value={access} />
          <p className={notice}>Continue on this device to open your catalog.</p>
          <ScoutSubmit label="Continue to Seams Familiar" pendingLabel="Signing in…" className={`mt-4 ${button}`} />
        </form>
      ) : (
        <>
          <p className={notice}>Save your sizes, budget, and favorite styles. Use one email link to create an account or sign in.</p>
          <form action={requestMemberLink} className="mt-4" noValidate>
            <label htmlFor="seams-email" className="text-sm font-semibold">Email</label>
            <input id="seams-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} required className={field}
              aria-invalid={status === "invalid" || undefined} aria-describedby={status ? "email-status" : undefined} />
            <ScoutSubmit label="Email me a sign-in link" pendingLabel="Sending…" className={`mt-3 w-full sm:w-auto ${button}`} />
            {status ? <p id="email-status" role="status" className={notice}>
              {status === "sent" ? "Check your inbox. If you recently requested a link, use the one already sent."
                : status === "invalid" ? "Enter a complete email address."
                : status === "expired" ? "This link has expired or was used. Request a new one."
                : status === "unsubscribed" ? "You’re unsubscribed from First Dibs."
                : "We couldn’t send a sign-in link. Try again in a few minutes."}
            </p> : null}
          </form>
          <section id="first-dibs" aria-labelledby="first-dibs-title" className="mt-5 scroll-mt-6 border-t border-[var(--line)] pt-4">
            <h3 id="first-dibs-title" className="font-bold">What you get with First Dibs</h3>
            <FirstDibsDetails />
            {!firstDibsReady() ? <p className="mt-2 text-xs text-[var(--muted-ink)]">First Dibs delivery is being set up.</p> : null}
          </section>
        </>
      )}
    </section>
  );
}

function FitForm({ settings, status }: { settings: MemberSettings; status?: string }) {
  return (
    <section id="fit" className="my-5 scroll-mt-6 border-b border-[var(--line)] pb-6" aria-labelledby="fit-title">
      <h2 id="fit-title" className="text-xl font-bold tracking-tight">Your fit</h2>
      <form action={saveMemberFit} className="mt-3 space-y-3" noValidate>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">Shop
            <select name="department" defaultValue={settings.department} className={field}>
              <option value="any">Men’s and women’s</option><option value="men">Men’s</option><option value="women">Women’s</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Tops, dresses & jackets
            <input name="topSizes" defaultValue={settings.topSizes.join(", ")} placeholder="M, 12, XL Tall" maxLength={120} className={field} aria-describedby="size-format" />
          </label>
          <label className="text-sm font-semibold">Pants & skirts
            <input name="bottomSizes" defaultValue={settings.bottomSizes.join(", ")} placeholder="8, 16W, 32x30" maxLength={120} className={field} aria-describedby="size-format" />
          </label>
          <label className="text-sm font-semibold">Max price per item ($)
            <input name="budget" type="number" inputMode="decimal" min="0.01" max="9999.99" step="0.01" defaultValue={settings.budget ?? ""} placeholder="Any price" className={field} />
          </label>
        </div>
        <p id="size-format" className="text-sm text-[var(--muted-ink)]">Separate sizes with commas. Leave a field blank for any size. Budget includes shipping when listed.</p>
        <fieldset>
          <legend className="text-sm font-semibold">Styles you like</legend>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0">
            {Object.entries(interestLabels).map(([id, label]) => (
              <label key={id} className="inline-flex min-h-11 items-center gap-2 text-sm"><input name="interests" type="checkbox" value={id} defaultChecked={settings.interests.includes(id)} className="h-4 w-4 accent-[var(--accent)]" />{label}</label>
            ))}
          </div>
        </fieldset>
        <ScoutSubmit label="Save my fit" pendingLabel="Saving…" className={button} />
        {status === "saved" || status === "bad-fit" ? <p role="status" className={notice}>{status === "saved" ? "Your fit is saved." : "Check the size format and enter a budget above $0, or leave it blank."}</p> : null}
      </form>
    </section>
  );
}

function FirstDibs({ member, status }: { member: Member; status?: string }) {
  const available = firstDibsReady();
  return (
    <section id="first-dibs" className="scout-first-dibs" aria-labelledby="first-dibs-title">
      <span className="scout-90s-graphic" aria-hidden="true"><i /><i /><i /></span>
      <div>
        <h2 id="first-dibs-title" className="text-xl font-bold tracking-tight">Get first dibs</h2>
        <FirstDibsDetails />
        <p className="mt-2 text-xs">{available ? member.first_dibs ? "First Dibs is on." : "First Dibs is off." : "First Dibs delivery is being set up."}</p>
      </div>
      {available || member.first_dibs ? <form action={saveMemberDibs} className="scout-first-dibs-form">
        <input type="hidden" name="enabled" value={member.first_dibs ? "off" : "on"} />
        <ScoutSubmit label={member.first_dibs ? "Turn off emails" : "Turn on First Dibs"} pendingLabel="Saving…" className={button} />
        {status === "email-saved" ? <p role="status" className="text-sm">Email preference saved.</p> : null}
        {status === "email-unavailable" ? <p role="status" className="text-sm">First Dibs isn’t ready yet.</p> : null}
      </form> : null}
    </section>
  );
}

export default async function SeamsFamiliar({ searchParams }: { searchParams: Promise<CatalogQuery> }) {
  const params = await searchParams;
  const unsubscribe = typeof params.unsubscribe === "string" && /^[a-f0-9]{64}$/.test(params.unsubscribe) ? params.unsubscribe : null;
  const member = unsubscribe ? null : await readMember();
  const guestDepartment = params.department === "men" || params.department === "women" ? params.department : "any";
  const settings = member?.settings ?? (member ? defaultMemberSettings : { ...defaultMemberSettings, department: guestDepartment });
  const collection: CatalogShelf = params.collection === "tour-shirts" || params.collection === "goodwill" || params.collection === "goodwill-pants" ? params.collection : "";
  const tour = collection === "tour-shirts";
  const goodwillPants = collection === "goodwill-pants";
  const goodwill = goodwillPants || collection === "goodwill";
  const decade = params.decade === "80s" || params.decade === "90s" ? params.decade : "";
  const decadeChoices = [["", "All decades"], ["80s", "80s"], ["90s", "90s"]] as const;
  const keywords = typeof params.q === "string" ? params.q.slice(0, 80) : "";
  const showCatalog = !unsubscribe && !params.access;
  const catalog = showCatalog ? await readSeamsCatalog().catch(() => []) : [];
  const matches = matchSeamsCatalog(catalog, settings, keywords, false, tour);
  const shelfItems = goodwill ? goodwillShelf(matches, goodwillPants) : matches;
  const items = decade ? shelfItems.filter((item) => vintageSignals(item).decade === decade) : shelfItems;
  const preferences = { department: settings.department, shirtSizes: settings.topSizes, pantsSizes: settings.bottomSizes, shirtBudget: settings.budget, pantsBudget: settings.budget, matchingOnly: true };
  const stamp = catalog.reduce((latest, row) => latest > (row.checked_at ?? "") ? latest : row.checked_at ?? "", "");
  const cards = (member ? items : previewSeamsCatalog(items, !decade && !collection)).map((item) => toListingView(item, item.listedAt, stamp || item.listedAt, null, preferences));
  const catalogHref = (filters: { decade: string; collection: CatalogShelf; department: string }) => {
    const query = new URLSearchParams();
    if (keywords) query.set("q", keywords);
    if (filters.decade) query.set("decade", filters.decade);
    if (filters.collection) query.set("collection", filters.collection);
    if (filters.collection !== "tour-shirts" && !member && filters.department !== "any") query.set("department", filters.department);
    return seamsPath + (query.size ? "?" + query.toString() : "") + "#fresh";
  };
  return (
    <main className={`fieldwear-scout seams-public pb-12 ${fraunces.variable}`} data-decade={showCatalog && decade || undefined}>
      {showCatalog ? <SeamsActivity pageKey={`${guestDepartment}:${collection}:${keywords}`} /> : null}
      <header className="border-b border-[var(--line)]">
        <div className="scout-container flex min-h-16 items-center justify-between">
          <Link href="/" aria-label="Resonate Solutions"><Image src="/assets/resonate-logo-transparent.png" alt="Resonate Solutions" width={122} height={34} /></Link>
          {member ? <nav aria-label="Your account" className="flex items-center gap-3 text-sm font-semibold text-[var(--accent)]"><a href="#fresh">Catalog</a><a href="#fit">Your fit</a><form action={signOutSeams}><button className="min-h-11">Sign out</button></form></nav> : (showCatalog ? <a href="#join" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] underline underline-offset-4">Save my fit</a> : null)}
        </div>
        <div className="scout-container">
          <div className="scout-brand-hero">
            <span className="scout-film-stripe" aria-hidden="true" />
            <span className="scout-90s-graphic" aria-hidden="true"><i /><i /><i /></span>
            <h1>Seams<br className="seams-wordmark-break" /> Familiar</h1>
            <p>Vintage clothing · Good clothes come around again.</p>
          </div>
        </div>
      </header>
      <div className="scout-container">
        {unsubscribe ? (
          <section className="my-6 max-w-xl" aria-labelledby="unsubscribe-title">
            <h2 id="unsubscribe-title" className="text-2xl font-bold">Unsubscribe from First Dibs</h2>
            <form action={stopFirstDibs} className="mt-4">
              <input type="hidden" name="token" value={unsubscribe} />
              <ScoutSubmit label="Unsubscribe" pendingLabel="Updating…" className={button} />
            </form>
          </section>
        ) : showCatalog ? (
          <>
            <section id="fresh" aria-labelledby="catalog-title" className="my-5 scroll-mt-6">
              <h2 id="catalog-title" className="text-xl font-bold tracking-tight">{tour ? "’80s & ’90s tour shirts" : goodwill ? (goodwillPants ? "Goodwill work pants" : "Goodwill clothing") : member?.settings ? "Your fresh finds" : "Fresh finds"}</h2>
              <div className="scout-departments" aria-label="Catalog shelves">
                <Link href={catalogHref({ decade, collection: "", department: guestDepartment })} aria-current={!collection ? "page" : undefined}>Daily catalog</Link>
                <Link href={catalogHref({ decade, collection: "tour-shirts", department: guestDepartment })} aria-current={tour ? "page" : undefined}>Tour shirts</Link>
                <Link href={catalogHref({ decade, collection: "goodwill-pants", department: guestDepartment })} aria-current={goodwill ? "page" : undefined}>Goodwill pants</Link>
              </div>
              {tour ? <p className="my-2 text-xs text-[var(--muted-ink)]">Tour and era are seller-described. Check the print and tag photos.</p> : null}
              {goodwill ? <div className="my-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted-ink)]">
                <span>Items that ship</span>
                <Link href={catalogHref({ decade, collection: goodwillPants ? "goodwill" : "goodwill-pants", department: guestDepartment })} className="inline-flex min-h-11 items-center text-[var(--accent)] underline underline-offset-4">{goodwillPants ? "All Goodwill clothing" : "Work pants only"}</Link>
                <a href="https://shopgoodwill.com/search/advancedsearch" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-[var(--accent)] underline underline-offset-4">Search on ShopGoodwill.com</a>
              </div> : null}
              {!member && !tour ? <nav className="scout-departments" aria-label="Shop departments">
                {([["any", "All"], ["men", "Men’s"], ["women", "Women’s"]] as const).map(([department, label]) => {
                  return <Link key={department} href={catalogHref({ decade, collection, department })} aria-current={guestDepartment === department ? "page" : undefined} scroll={false}>{label}</Link>;
                })}
              </nav> : null}
              {member ? (
                <form action={searchMemberCatalog} className="my-3 flex gap-2">
                  {collection ? <input type="hidden" name="collection" value={collection} /> : null}
                  {decade ? <input type="hidden" name="decade" value={decade} /> : null}
                  <label className="min-w-0 flex-1"><span className="sr-only">Search listings</span><input key={keywords} name="keywords" type="search" defaultValue={keywords} placeholder={goodwillPants ? "Canvas, carpenter, double knee…" : "Denim, wool, L.L.Bean…"} maxLength={80} className="scout-control w-full text-base" /></label>
                  <ScoutSubmit label="Search now" pendingLabel="Checking shops…" className={button} />
                </form>
              ) : (
                <form method="get" action={seamsPath + "#fresh"} className="my-3 flex gap-2">
                  {collection ? <input type="hidden" name="collection" value={collection} /> : null}
                  {decade ? <input type="hidden" name="decade" value={decade} /> : null}
                  {guestDepartment !== "any" ? <input type="hidden" name="department" value={guestDepartment} /> : null}
                  <label className="min-w-0 flex-1"><span className="sr-only">Search listings</span><input key={keywords} name="q" type="search" defaultValue={keywords} placeholder={goodwillPants ? "Canvas, carpenter, double knee…" : "Denim, wool, L.L.Bean…"} maxLength={80} className="scout-control w-full text-base" /></label>
                  <button type="submit" className={button}>Search</button>
                </form>
              )}
              <nav className="scout-collections scout-decades" aria-label="Shop by decade">
                {decadeChoices.map(([value, label]) => (
                  <Link key={value} className="scout-collection" href={catalogHref({ decade: value, collection, department: guestDepartment })} aria-current={decade === value ? "page" : undefined} scroll={false}>{label}</Link>
                ))}
              </nav>
              {!tour ? <LocalPickup key={settings.department} department={settings.department} /> : null}
              {!cards.length ? <p className="mb-2 text-sm text-[var(--muted-ink)]" role="status">{catalog.length ? "No matches. Try a different search or an open size or budget." : "The shop catalog is being refreshed."}</p> : null}
              {cards.length ? <FreshCatalog key={stamp + ":" + keywords + ":" + collection + ":" + decade + ":" + JSON.stringify(settings)} items={cards} womenswear={!tour && settings.department !== "men"} tourShelf={tour} fixedKind={goodwillPants ? "pants" : undefined} personalActions={false} showNinetiesCollection={false} /> : null}
            </section>
            {member ? <><FitForm settings={settings} status={params.status} /><FirstDibs member={member} status={params.status} /></>
              : <Welcome status={params.status} />}
          </>
        ) : <Welcome access={params.access} status={params.status} />}
        <footer className="mt-8 border-t border-[var(--line)] py-4 text-xs text-[var(--muted-ink)]">
          <p>Resonate Solutions uses your email to sign you in and your preferences to match listings. First Dibs is optional and has an unsubscribe link.</p>
          <Link href="/privacy" className="mt-2 inline-block underline underline-offset-4">Privacy policy</Link>
        </footer>
      </div>
    </main>
  );
}
