import type { Metadata } from "next";
import { Bell, Bookmark, Ruler, Search, Shirt } from "lucide-react";
import { DailyScout } from "@/components/fieldwear/daily-scout";
import { ListingChecker } from "@/components/fieldwear/listing-checker";
import { ListingWorkbench, type ListingView } from "@/components/fieldwear/listing-workbench";
import { curatedListings, type CuratedListing } from "@/lib/fieldwear/curated-listings";
import { classifyGarment, scoreListing, type ListingInput } from "@/lib/fieldwear/listing-model";
import { readScoutEdition } from "@/lib/fieldwear/editions";
import { isScoutOwner, scoutDatabase } from "@/lib/fieldwear/owner-access";
import { redeemOwnerLink, requestOwnerLink, signOutScout } from "./actions";
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

type Decision = { source: string; external_id: string; verdict: string; listing: ListingInput | null };

function readLegacyScout() {
  try {
    return JSON.parse(process.env.FIELDWEAR_LEGACY_SNAPSHOT ?? "[]") as Decision[];
  } catch {
    return [];
  }
}

export default async function FieldwearPage({ searchParams }: { searchParams: Promise<{ access?: string; signIn?: string }> }) {
  if (!(await isScoutOwner())) {
    const { access, signIn } = await searchParams;
    return <OwnerSignIn token={access} status={signIn} />;
  }

  const sql = await scoutDatabase();
  const [recorded, edition] = await Promise.all([
    sql`SELECT source, external_id, verdict, listing FROM fieldwear_decisions` as Promise<Decision[]>,
    readScoutEdition(),
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
    entries.set(canonicalListingKey(listing.url), toListingView(listing, updated, updated, verdict, listing));
  }
  for (const { listing, verdict } of Array.from(decisions.values())) {
    if (listing && !entries.has(canonicalListingKey(listing.url))) {
      const checkedAt = (listing as ListingInput & { checkedAt?: string }).checkedAt ?? "2026-10-15T00:00:00Z";
      entries.set(canonicalListingKey(listing.url), toListingView(listing, checkedAt, checkedAt, verdict));
    }
  }
  const daily: ListingView[] = [];
  if (edition) {
    for (const item of edition.finds) {
      const verdict = decisions.get(`${item.source}:${item.externalId}`)?.verdict ?? null;
      const view = toListingView(item, edition.checkedAt, edition.checkedAt, verdict);
      view.evidence.sellerClaims.unshift(item.evidence);
      entries.set(canonicalListingKey(item.url), view);
      if (verdict !== "pass") daily.push(view);
    }
  }
  const saved = Array.from(decisions.values()).some(({ verdict }) => verdict === "save");

  return (
    <main className="fieldwear-scout bg-[var(--paper)] px-4 pb-28 pt-6 text-[var(--ink)] sm:px-7">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-lg font-bold">Fieldwear Scout</p>
          <form action={signOutScout} noValidate><button className="min-h-11 rounded-full border border-black/15 bg-white px-4 font-semibold">Sign out</button></form>
        </div>
        <DailyScout edition={edition} items={daily} />
        <ListingWorkbench listings={Array.from(entries.values())} />
        <div className="mt-12"><ListingChecker /></div>
      </div>
      <nav aria-label="Fieldwear" className="fixed bottom-[calc(.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 flex w-[min(390px,calc(100%-24px))] -translate-x-1/2 rounded-2xl bg-[var(--pine)] px-1 py-2 text-white shadow-lg sm:hidden">
        <a href="#daily" className="grid min-h-12 flex-1 place-items-center text-xs"><Bell size={18}/>Daily</a>
        <a href="#shirts" className="grid min-h-12 flex-1 place-items-center text-xs"><Shirt size={18}/>Shirts</a>
        <a href="#bottoms" className="grid min-h-12 flex-1 place-items-center text-xs"><Ruler size={18}/>Bottoms</a>
        <a href={saved ? "#saved" : "#finds"} className="grid min-h-12 flex-1 place-items-center text-xs"><Bookmark size={18}/>Saved</a>
        <a href="#check" className="grid min-h-12 flex-1 place-items-center text-xs"><Search size={18}/>Check</a>
      </nav>
    </main>
  );
}

function toListingView(
  input:ListingInput,
  firstSeenAt:string,
  lastSeenAt:string,
  decision:string|null,
  curated?:CuratedListing,
):ListingView {
  const rescored = scoreListing(input);
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
