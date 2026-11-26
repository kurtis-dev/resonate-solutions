"use client";

import { useMemo, useRef, useState } from "react";
import {
  ExternalLink,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Filter,
  ImageOff,
  Search,
  ShieldQuestion,
  ThumbsDown,
  X,
} from "lucide-react";
import { decideListing, searchScoutLook } from "@/app/fieldwear/actions";
import { ScoutSubmit } from "@/components/fieldwear/scout-submit";
import type { GarmentKind } from "@/lib/fieldwear/listing-model";
import { departmentLabels, fitPriority, matchesScoutFit, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { marketplaceName } from "@/lib/fieldwear/marketplace-directory";
import type { vintageSignals } from "@/lib/fieldwear/vintage-signals";
import "@/app/fieldwear/catalog.css";

export type ListingView = {
  source:string; externalId:string; url:string; title:string; imageUrl:string|null;
  priceCents:number|null; shippingCents:number|null; size:string|null; condition:string|null;
  measurements:string[]; vintage:ReturnType<typeof vintageSignals>;
  lookNote?: string | null;
  firstSeenAt:string; lastSeenAt:string; totalScore:number; fitScore:number; constructionScore:number;
  listedAt?:string;
  ageScore:number; conditionScore:number; valueScore:number; documentationScore:number;
  evidence:{ confirmed:string[]; sellerClaims:string[]; visualClues:string[]; hiddenBargain?:boolean };
  concerns:string[]; missing:string[]; decision:string|null; tasteMatch:number; tasteReasons:string[];
  eraConfidence:number; eraReasons:string[]; qualityException:boolean;
  garmentKind:GarmentKind;
  curatedCategory?:"plain-work-shirts"|"heavy-cotton-chamois"|"lined-shirt-jackets"|"duck-canvas-pants"|"straight-denim-pants"|null;
};

type ShelfDefinition = {
  id:string;
  label:string;
  description:string;
  matches:(item:ListingView) => boolean;
  compare?:(a:ListingView, b:ListingView) => number;
};

type QuickFilter = "all"|"my-sizes"|"natural-fibers"|"pre-1999"|"under-budget";
type SortMode = "match"|"era"|"price"|"recent";
type CatalogScope = "all"|"shirts"|"pants";

const HEAVY_TERMS = /\b(chamois|heavy(?:weight)?|flannel|canvas|duck|overshirt|wool)\b/i;
const LINED_TERMS = /\b(?:blanket|flannel|fleece|quilt(?:ed)?|sherpa)[- ]lined\b|\blined\b|\binsulated\b|\bshirt[- ]?(?:jacket|jac)\b|\bshacket\b/i;
const PATTERN_TERMS = /\b(plaid|check(?:ed)?|tartan|buffalo)\b/i;
const PLAIN_WORK_TERMS = /\b(work|utility|chore|chambray|denim|canvas|duck|button[- ]?(?:down|front))\b/i;

function listingText(item:ListingView) {
  return [item.source, item.title, ...item.evidence.confirmed, ...item.evidence.sellerClaims, ...item.evidence.visualClues].join(" ");
}

function matchesQuickFilter(item:ListingView, filter:QuickFilter, preferences:ScoutPreferences) {
  const total = item.priceCents == null ? null : item.priceCents + (item.shippingCents ?? 0);
  if (filter === "my-sizes") return matchesScoutFit(item, preferences);
  if (filter === "natural-fibers") return item.vintage.natural;
  if (filter === "pre-1999") return item.vintage.period > 1;
  if (filter === "under-budget") {
    const budget = item.garmentKind === "pants" ? preferences.pantsBudget : preferences.shirtBudget;
    return budget == null || (total != null && total <= Math.round(budget * 100));
  }
  return true;
}

function compareListings(mode:SortMode) {
  return (a:ListingView, b:ListingView) => {
    if (mode === "era") return b.vintage.period-a.vintage.period || b.totalScore-a.totalScore;
    if (mode === "price") {
      const aPrice = a.priceCents == null ? Number.MAX_SAFE_INTEGER : a.priceCents + (a.shippingCents ?? 0);
      const bPrice = b.priceCents == null ? Number.MAX_SAFE_INTEGER : b.priceCents + (b.shippingCents ?? 0);
      return aPrice-bPrice || b.totalScore-a.totalScore;
    }
    if (mode === "recent") return new Date(b.lastSeenAt).getTime()-new Date(a.lastSeenAt).getTime() || b.totalScore-a.totalScore;
    return b.tasteMatch-a.tasteMatch || b.totalScore-a.totalScore || b.constructionScore-a.constructionScore;
  };
}

type GarmentShelf = "plain-work"|"heavy-cotton"|"lined-shirt-jackets"|null;

function garmentShelf(item:ListingView):GarmentShelf {
  const text = listingText(item);
  if (item.vintage.build < 0) return null;
  if (item.curatedCategory === "lined-shirt-jackets" || LINED_TERMS.test(text)) return "lined-shirt-jackets";
  if (item.curatedCategory === "heavy-cotton-chamois") return "heavy-cotton";
  if (item.curatedCategory === "plain-work-shirts") return "plain-work";
  if (HEAVY_TERMS.test(text)) return "heavy-cotton";
  if (PLAIN_WORK_TERMS.test(item.title) && !PATTERN_TERMS.test(item.title) && !/\b(?:tee|t-?shirt|graphic)\b/i.test(item.title)) return "plain-work";
  if (item.constructionScore >= 17) return "heavy-cotton";
  return null;
}

const shirtShelves:ShelfDefinition[] = [
  {
    id:"plain-work",
    label:"Plain work shirts",
    description:"Solid chambray, denim, canvas, and utility shirts.",
    matches:(item) => item.garmentKind === "shirt" && garmentShelf(item) === "plain-work",
    compare:(a,b) => b.tasteMatch-a.tasteMatch || b.constructionScore-a.constructionScore || b.totalScore-a.totalScore,
  },
  {
    id:"heavy-cotton",
    label:"Heavy cotton & chamois",
    description:"Substantial layers with fabric and construction evidence.",
    matches:(item) => item.garmentKind === "shirt" && garmentShelf(item) === "heavy-cotton",
    compare:(a,b) => b.constructionScore-a.constructionScore || b.tasteMatch-a.tasteMatch || b.totalScore-a.totalScore,
  },
  {
    id:"pre-1985",
    label:"Likely pre-1985",
    description:"Older manufacture signals, ranked by era confidence.",
    matches:(item) => item.garmentKind === "shirt" && item.eraConfidence >= 40,
    compare:(a,b) => b.eraConfidence-a.eraConfidence || b.documentationScore-a.documentationScore || b.totalScore-a.totalScore,
  },
  {
    id:"lined-shirt-jackets",
    label:"Lined shirt-jackets",
    description:"Denim, flannel, quilted, and blanket-lined layers.",
    matches:(item) => item.garmentKind === "shirt" && garmentShelf(item) === "lined-shirt-jackets",
    compare:(a,b) => b.constructionScore-a.constructionScore || b.tasteMatch-a.tasteMatch || b.totalScore-a.totalScore,
  },
  {
    id:"quality-exceptions",
    label:"Quality exceptions",
    description:"Later pieces that still clear the construction bar.",
    matches:(item) => item.garmentKind === "shirt" && item.qualityException,
    compare:(a,b) => b.constructionScore-a.constructionScore || b.tasteMatch-a.tasteMatch || b.totalScore-a.totalScore,
  },
];

const pantsShelves:ShelfDefinition[] = [
  {
    id:"duck-canvas-pants",
    label:"Duck, canvas & work pants",
    description:"Painter and carpenter shapes in durable fabrics.",
    matches:(item) => item.garmentKind === "pants" && item.curatedCategory === "duck-canvas-pants",
    compare:(a,b) => b.tasteMatch-a.tasteMatch || b.constructionScore-a.constructionScore || b.totalScore-a.totalScore,
  },
  {
    id:"straight-denim-pants",
    label:"Straight denim & trousers",
    description:"Restrained jeans, dungarees, and wool trousers with useful material or origin claims.",
    matches:(item) => item.garmentKind === "pants" && item.curatedCategory === "straight-denim-pants",
    compare:(a,b) => b.tasteMatch-a.tasteMatch || b.valueScore-a.valueScore || b.totalScore-a.totalScore,
  },
  {
    id:"pre-1985-pants",
    label:"Likely pre-1985 pants",
    description:"Only candidates with corroborating period signals; seller dates remain unverified.",
    matches:(item) => item.garmentKind === "pants" && item.eraConfidence >= 40,
    compare:(a,b) => b.eraConfidence-a.eraConfidence || b.documentationScore-a.documentationScore || b.totalScore-a.totalScore,
  },
  {
    id:"quality-pants",
    label:"Quality construction exceptions",
    description:"Later or undated pants worth considering for fabric, build, fit, or value.",
    matches:(item) => item.garmentKind === "pants" && (item.qualityException || item.constructionScore >= 15),
    compare:(a,b) => b.constructionScore-a.constructionScore || b.tasteMatch-a.tasteMatch || b.totalScore-a.totalScore,
  },
];

export function ListingWorkbench({ listings, preferences }: { listings:ListingView[]; preferences:ScoutPreferences }) {
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("match");
  const [scope, setScope] = useState<CatalogScope>("all");
  const [source, setSource] = useState("all");
  const activeListings = useMemo(() => listings.filter((item) =>
    item.decision !== "pass" && (!preferences.matchingOnly || matchesScoutFit(item, preferences))
  ), [listings, preferences]);
  const marketplaceFacets = useMemo(() => {
    const counts = new Map<string,number>();
    activeListings.forEach((item) => counts.set(item.source, (counts.get(item.source) ?? 0) + 1));
    const order = ["ebay", "etsy", "grailed"];
    return Array.from(counts.entries()).toSorted((a,b) => {
      const aIndex = order.indexOf(a[0]);
      const bIndex = order.indexOf(b[0]);
      return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex) || a[0].localeCompare(b[0]);
    });
  }, [activeListings]);
  const saved = useMemo(
    () => listings.filter((item) => item.decision === "save").toSorted((a,b) => b.totalScore-a.totalScore),
    [listings],
  );
  const shirtShelfResults = useMemo(
    () => shirtShelves.map((shelf) => ({
      ...shelf,
      items:activeListings.filter(shelf.matches).toSorted((a,b) => fitPriority(b, preferences) - fitPriority(a, preferences) || (shelf.compare?.(a,b) ?? b.totalScore-a.totalScore)),
    })),
    [activeListings, preferences],
  );
  const pantsShelfResults = useMemo(
    () => pantsShelves.map((shelf) => ({
      ...shelf,
      items:activeListings.filter(shelf.matches).toSorted((a,b) => fitPriority(b, preferences) - fitPriority(a, preferences) || (shelf.compare?.(a,b) ?? b.totalScore-a.totalScore)),
    })),
    [activeListings, preferences],
  );
  const normalizedQuery = query.trim().toLowerCase();
  const filterActive = normalizedQuery.length > 0 || quickFilter !== "all" || sortMode !== "match" || scope !== "all" || source !== "all";
  const filteredListings = useMemo(() => activeListings.filter((item) => {
    const matchesScope = scope === "all" || (scope === "shirts" ? item.garmentKind === "shirt" : item.garmentKind === "pants");
    const matchesSource = source === "all" || item.source === source;
    const matchesQuery = !normalizedQuery || listingText(item).toLowerCase().includes(normalizedQuery);
    return matchesScope && matchesSource && matchesQuery && matchesQuickFilter(item, quickFilter, preferences);
  }).toSorted((a,b) => (sortMode === "match" ? fitPriority(b, preferences) - fitPriority(a, preferences) : 0) || compareListings(sortMode)(a,b)), [activeListings, normalizedQuery, quickFilter, scope, sortMode, source, preferences]);

  const clearFilters = () => {
    setQuery("");
    setQuickFilter("all");
    setSortMode("match");
    setScope("all");
    setSource("all");
  };

  return (
    <section id="finds" className="scroll-mt-20" aria-labelledby="catalog-title">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--rust)]">Workwear catalog</p>
          <h2 id="catalog-title" className="mt-1 font-display text-[clamp(2rem,7vw,3.75rem)] leading-[.96] tracking-[-.035em]">Older workwear worth a closer look</h2>
        </div>
        <p className="max-w-sm text-sm leading-5 text-[var(--muted-ink)]">{departmentLabels[preferences.department]} · {preferences.matchingOnly ? "Matching sizes only" : "Preferred sizes first"}</p>
      </div>

      <div className="mt-5 rounded-[22px] border border-black/8 bg-white/75 p-3 shadow-[0_10px_30px_rgba(44,38,27,.05)] sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search all listings</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-ink)]" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search brand, fabric, style, or size"
              className="min-h-12 w-full rounded-2xl border border-black/10 bg-[var(--paper)] pl-11 pr-11 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-black/40 focus:border-[var(--pine)] focus:ring-2 focus:ring-[rgba(48,71,53,.12)]"
            />
            {query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-[var(--muted-ink)] hover:bg-black/5 hover:text-[var(--ink)]" aria-label="Clear search"><X size={16} /></button> : null}
          </label>
          <label className="relative shrink-0">
            <span className="sr-only">Sort listings</span>
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-ink)]" size={15} />
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="min-h-12 cursor-pointer appearance-none rounded-2xl border border-black/10 bg-white pl-9 pr-9 text-sm font-bold outline-none focus:border-[var(--pine)]">
              <option value="match">Best match</option>
              <option value="era">Oldest evidence</option>
              <option value="price">Lowest price</option>
              <option value="recent">Recently checked</option>
            </select>
          </label>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-[var(--paper)] p-1" role="group" aria-label="Garment type">
          {([ ["all", "All"], ["shirts", "Shirts"], ["pants", "Bottoms"] ] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)} className={`min-h-11 cursor-pointer rounded-xl px-3 text-sm font-bold transition ${scope === value ? "bg-white text-[var(--pine)] shadow-sm" : "text-[var(--muted-ink)] hover:text-[var(--pine)]"}`}>{label}</button>
          ))}
        </div>

        <div className="mt-3" role="group" aria-label="Marketplace source">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted-ink)]">Marketplace</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button type="button" aria-pressed={source === "all"} onClick={() => setSource("all")} className={`min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-xs font-bold transition ${source === "all" ? "border-[var(--rust)] bg-[var(--rust)] text-white" : "border-black/10 bg-white text-[var(--muted-ink)] hover:border-[var(--rust)] hover:text-[var(--rust)]"}`}>All <span className="ml-1 opacity-75">{activeListings.length}</span></button>
            {marketplaceFacets.map(([marketplace, count]) => (
              <button key={marketplace} type="button" aria-pressed={source === marketplace} onClick={() => setSource(marketplace)} className={`min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-xs font-bold transition ${source === marketplace ? "border-[var(--rust)] bg-[var(--rust)] text-white" : "border-black/10 bg-white text-[var(--muted-ink)] hover:border-[var(--rust)] hover:text-[var(--rust)]"}`}>{marketplaceName(marketplace)} <span className="ml-1 opacity-75">{count}</span></button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Quick filters">
          {([
            ["all", "Everything"],
            ["my-sizes", "My sizes"],
            ["natural-fibers", "Natural fibers"],
            ["pre-1999", "Pre-1999 clues"],
            ["under-budget", "Under budget"],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={quickFilter === value} onClick={() => setQuickFilter(value)} className={`min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-xs font-bold transition active:scale-[.98] ${quickFilter === value ? "border-[var(--pine)] bg-[var(--pine)] text-white" : "border-black/10 bg-white text-[var(--muted-ink)] hover:border-[var(--pine)] hover:text-[var(--pine)]"}`}>{label}</button>
          ))}
        </div>

        <div className="mt-2 flex min-h-6 items-center justify-between gap-3 text-xs text-[var(--muted-ink)]">
          <p><strong className="text-[var(--ink)]">{filteredListings.length}</strong> of {activeListings.length} pieces match</p>
          {filterActive ? <button type="button" onClick={clearFilters} className="cursor-pointer font-bold text-[var(--rust)] hover:underline">Clear filters</button> : <p>Use one filter at a time to keep good outliers visible.</p>}
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="mt-6 min-h-72 rounded-[26px] border border-dashed border-black/15 bg-white/50 p-6">
          <div className="grid h-full min-h-60 place-items-center text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--sand)] text-[var(--pine)]"><ImageOff size={22} /></span>
              <h2 className="mt-4 font-display text-2xl">No current listings</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">Marketplace results will appear here with their original photos and direct links.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 space-y-10 sm:space-y-12">
          {filterActive ? (
            <>
              {(scope !== "pants") ? <ListingShelf id="matching-shirts" label="Matching shirts" description="Shirt results stay separate so fit and construction remain easy to compare." items={filteredListings.filter((item) => item.garmentKind === "shirt")} /> : null}
              {(scope !== "shirts") ? <ListingShelf id="matching-bottoms" label="Matching bottoms" description="Jeans, work pants, and trousers." items={filteredListings.filter((item) => item.garmentKind === "pants")} /> : null}
            </>
          ) : (
            <>
              {saved.length > 0 ? <ListingShelf id="saved" label="Saved" description="Pieces you marked to revisit." items={saved} /> : null}
              <section id="shirts" className="scroll-mt-24 space-y-10 sm:space-y-12" aria-labelledby="shirts-title">
                <div className="border-b border-black/10 pb-3"><h2 id="shirts-title" className="font-display text-3xl tracking-tight sm:text-4xl">Shirts</h2><p className="mt-1 text-sm text-[var(--muted-ink)]">{preferences.shirtSizes.join(", ") || "Any size"}</p></div>
                {shirtShelfResults.map((shelf) => <ListingShelf key={shelf.id} {...shelf} />)}
              </section>
              <section id="bottoms" className="scroll-mt-24 space-y-10 border-t border-black/10 pt-10 sm:space-y-12 sm:pt-12" aria-labelledby="bottoms-title">
                <div className="border-b border-black/10 pb-3"><h2 id="bottoms-title" className="font-display text-3xl tracking-tight sm:text-4xl">Bottoms</h2><p className="mt-1 text-sm text-[var(--muted-ink)]">{preferences.pantsSizes.join(", ") || "Any size"}</p></div>
                {pantsShelfResults.map((shelf) => <ListingShelf key={shelf.id} {...shelf} />)}
              </section>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export function ListingShelf({ id, label, description, items, comparePrices = false }:{
  id:string; label:string; description:string; items:ListingView[]; comparePrices?:boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [cheapest, setCheapest] = useState(false);
  const displayed = cheapest ? items.toSorted((a, b) => (priceForSort(a) ?? Infinity) - (priceForSort(b) ?? Infinity)) : items;
  const scroll = (direction:-1|1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left:direction * Math.min(track.clientWidth * 0.82, 760), behavior:"smooth" });
  };

  return (
    <section id={id} className="scroll-mt-24" aria-labelledby={`${id}-title`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2.5">
            <h2 id={`${id}-title`} className="font-display text-2xl tracking-tight sm:text-3xl">{label}</h2>
            <span className="text-xs font-bold tabular-nums text-[var(--rust)]" aria-label={`${items.length} results`}>{items.length}</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-[var(--muted-ink)] sm:text-sm">{description}</p>
        </div>
        {items.length > 1 ? (
          <div className="flex shrink-0 gap-2" aria-label={`${label} carousel controls`}>
            {comparePrices ? <button type="button" aria-pressed={cheapest} onClick={() => { setCheapest(!cheapest); trackRef.current?.scrollTo(0, 0); }}
              className="min-h-11 rounded-full border border-black/10 bg-white px-3 text-xs font-bold text-[var(--pine)] aria-pressed:border-[var(--pine)] aria-pressed:bg-[var(--sand)]">Lowest price</button> : null}
            <button type="button" onClick={() => scroll(-1)} className="hidden h-11 w-11 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-[var(--pine)] transition hover:border-[var(--pine)] hover:bg-[var(--sand)] active:scale-95 sm:grid" aria-label={`Scroll ${label} left`}><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => scroll(1)} className="hidden h-11 w-11 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-[var(--pine)] transition hover:border-[var(--pine)] hover:bg-[var(--sand)] active:scale-95 sm:grid" aria-label={`Scroll ${label} right`}><ChevronRight size={18} /></button>
          </div>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="grid min-h-36 place-items-center rounded-[22px] border border-dashed border-black/15 bg-white/35 px-5 text-center">
          <p className="text-sm font-semibold text-[var(--muted-ink)]">No current matches in this group.</p>
        </div>
      ) : (
        <div
          ref={trackRef}
          role="region"
          aria-label={`${label}, ${items.length} results`}
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-5 sm:-mx-2 sm:px-2"
          style={{ scrollbarGutter:"stable" }}
        >
          <p className="sr-only">Scroll horizontally to browse. Open a piece for its details and original marketplace link.</p>
          {displayed.map((item) => <ListingCard key={`${id}:${item.source}:${item.externalId}`} item={item} />)}
          <span aria-hidden="true" className="w-px shrink-0" />
        </div>
      )}
    </section>
  );
}

const freshPageSize = 12;
const priceForSort = (item: ListingView) => item.priceCents == null ? null : item.priceCents + (item.shippingCents ?? 0);
const garmentOptions = {
  shirt: [["work", "Work shirts"], ["chamois", "Chamois shirts"], ["lined", "Shirt-jackets"]],
  pants: [["canvas", "Canvas & duck pants"], ["denim", "Jeans & denim pants"], ["trousers", "Trousers"]],
} as const;

function matchesFreshType(item: ListingView, type: string) {
  if (!type) return true;
  if (type === "canvas") return item.vintage.canvas;
  if (type === "denim") return /\b(?:jeans?|denim)\b/i.test(item.title);
  if (type === "trousers") return /\b(?:trousers?|dress pants|slacks)\b/i.test(item.title);
  if (type === "chamois") return /\bchamois\b/i.test(item.title);
  if (type === "lined") return LINED_TERMS.test(item.title);
  return !LINED_TERMS.test(item.title) && (PLAIN_WORK_TERMS.test(item.title) || /\b(?:flannel|chamois)\b/i.test(item.title));
}

function matchesFreshEvidence(item: ListingView, era: string, fabric: string) {
  const { period, cotton, wool, natural, sturdyBlend } = item.vintage;
  if (era && (era === "pre-1999" ? period !== 2 : era === "1990s" ? period !== 1 : period !== 0)) return false;
  if (fabric === "cotton") return cotton;
  if (fabric === "wool") return wool;
  if (fabric === "pure") return natural && (cotton || wool);
  if (fabric === "blend") return sturdyBlend;
  return !fabric || cotton || wool;
}

export function FreshCatalog({ items, initialSource = "" }: { items: ListingView[]; initialSource?: string }) {
  const [kind, setKind] = useState<"all" | "shirt" | "pants">("all");
  const filterDialog = useRef<HTMLDialogElement>(null);
  const [marketplace, setMarketplace] = useState(initialSource);
  const [order, setOrder] = useState("relevance");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [era, setEra] = useState("");
  const [fabric, setFabric] = useState("");
  const [tagSize, setTagSize] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const invalidRange = min !== "" && max !== "" && Number(min) > Number(max);
  const marketplaces = Array.from(new Set(items.map((item) => item.source))).sort((a, b) => marketplaceName(a).localeCompare(marketplaceName(b)));
  const tagSizes = Array.from(new Set(items.flatMap(({ size }) => size ? [size] : []))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const results = useMemo(() => {
    const filtered = items.filter((item) => {
      if ((kind !== "all" && item.garmentKind !== kind) || (marketplace && item.source !== marketplace) || (tagSize && item.size !== tagSize) || invalidRange || !matchesFreshType(item, garmentType) || !matchesFreshEvidence(item, era, fabric)) return false;
      if (min === "" && max === "") return true;
      const cents = priceForSort(item);
      return cents != null && (min === "" || cents >= Number(min) * 100) && (max === "" || cents <= Number(max) * 100);
    });
    if (order === "newest") filtered.sort((a, b) => (b.listedAt ?? "").localeCompare(a.listedAt ?? ""));
    if (order === "oldest-garment") filtered.sort((a, b) => b.vintage.period - a.vintage.period);
    if (order === "low" || order === "high") filtered.sort((a, b) => {
      const left = priceForSort(a);
      const right = priceForSort(b);
      if (left == null) return right == null ? 0 : 1;
      if (right == null) return -1;
      return order === "high" ? right - left : left - right;
    });
    return filtered;
  }, [items, kind, marketplace, garmentType, era, fabric, tagSize, invalidRange, min, max, order]);
  const lastPage = Math.max(1, Math.ceil(results.length / freshPageSize));
  const currentPage = Math.min(page, lastPage);
  const from = (currentPage - 1) * freshPageSize;
  const visible = results.slice(from, from + freshPageSize);
  const control = "mt-1 min-h-11 w-full rounded-[4px] border border-[var(--line)] bg-white px-3 text-base font-normal text-[var(--ink)]";
  const hasFilters = Boolean(marketplace || garmentType || era || fabric || tagSize || min || max);
  const clearFilters = () => {
    setGarmentType("");
    setMarketplace("");
    setEra("");
    setFabric("");
    setTagSize("");
    setMin("");
    setMax("");
    setPage(1);
  };
  const go = (nextPage: number) => {
    setPage(nextPage);
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: "start" });
  };

  const tabs = [["all", "All"], ["shirt", "Shirts"], ["pants", "Bottoms"]] as const;

  return (
    <div>
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-2 border-y border-[var(--line)]">
        <div className="flex items-center gap-1 sm:gap-3" role="group" aria-label="Garment category">
          {tabs.map(([value, label]) => (
            <button key={value} type="button" aria-pressed={kind === value}
              onClick={() => { if (kind !== value) { setKind(value); setGarmentType(""); setTagSize(""); } setPage(1); }}
              className="scout-tab">{label}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button type="button" className="scout-toolbar-button" aria-haspopup="dialog" onClick={() => filterDialog.current?.showModal()}>
            <SlidersHorizontal size={16} aria-hidden="true" />Filters{hasFilters ? " •" : ""}
          </button>
          <label className="scout-sort">
            <span>Sort</span>
            <select aria-label="Sort listings" value={order} onChange={(event) => { setOrder(event.target.value); setPage(1); }}>
              <option value="relevance">Best match</option>
              <option value="newest">Recently listed</option>
              <option value="oldest-garment">Older garment clues</option>
              <option value="low">Price + shipping, low to high</option>
              <option value="high">Price + shipping, high to low</option>
            </select>
            <ChevronRight size={13} className="rotate-90" aria-hidden="true" />
          </label>
        </div>
      </div>
      <dialog ref={filterDialog} className="scout-dialog scout-filter-dialog" aria-labelledby="scout-filter-title">
        <div className="scout-dialog-header">
          <h2 id="scout-filter-title" className="text-base font-semibold">Filters</h2>
          <form method="dialog"><button className="scout-icon" aria-label="Close filters"><X size={19} /></button></form>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 sm:px-6">
        <label className="min-w-0 text-xs font-medium">Garment type
          <select value={garmentType} onChange={(event) => { setGarmentType(event.target.value); setPage(1); }} className={control}>
            <option value="">Any type</option>
            {(kind === "all" ? [...garmentOptions.shirt, ...garmentOptions.pants] : garmentOptions[kind]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium">Marketplace
          <select value={marketplace} onChange={(event) => { setMarketplace(event.target.value); setPage(1); }} className={control}>
            <option value="">All marketplaces</option>
            {marketplaces.map((source) => <option key={source} value={source}>{marketplaceName(source)}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium">Era
          <select value={era} onChange={(event) => { setEra(event.target.value); setPage(1); }} className={control}>
            <option value="">Any era</option>
            <option value="pre-1999">Pre-1999 clues</option>
            <option value="1990s">1990s, year open</option>
            <option value="undated">Undated</option>
          </select>
        </label>
        <label className="min-w-0 text-xs font-medium">Fabric
          <select value={fabric} onChange={(event) => { setFabric(event.target.value); setPage(1); }} className={control}>
            <option value="">Any fabric</option>
            <option value="either">Cotton or wool</option>
            <option value="cotton">Cotton</option>
            <option value="wool">Wool</option>
            <option value="pure">100% cotton or wool</option>
            <option value="blend">Sturdy blends</option>
          </select>
        </label>
          <label className="col-span-2 min-w-0 text-xs font-medium">Tag size
            <select value={tagSize} onChange={(event) => { setTagSize(event.target.value); setPage(1); }} className={control}>
              <option value="">Any tag size</option>
              {tagSizes.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium">Min price + shipping ($)<input type="number" min="0" step="0.01" inputMode="decimal" value={min} onChange={(event) => { setMin(event.target.value); setPage(1); }} className={control} /></label>
          <label className="text-xs font-medium">Max price + shipping ($)<input type="number" min="0" step="0.01" inputMode="decimal" value={max} onChange={(event) => { setMax(event.target.value); setPage(1); }} className={control} /></label>
          {invalidRange ? <p className="col-span-full text-sm" role="alert">Minimum price must be at or below the maximum.</p> : null}
        </div>
        <div className="scout-dialog-footer">
          <button type="button" onClick={clearFilters} disabled={!hasFilters} className="scout-toolbar-button disabled:opacity-40">Clear filters</button>
          <form method="dialog"><button className="scout-primary">Show {results.length} {results.length === 1 ? "piece" : "pieces"}</button></form>
        </div>
      </dialog>
      <div ref={resultsRef} tabIndex={-1} className="scroll-mt-24 py-3 text-sm text-[var(--muted-ink)]" role="status">
        {invalidRange ? "Minimum price must be at or below the maximum." : results.length ? `Showing ${from + 1}–${from + visible.length} of ${results.length}` : "No listings match these filters."}
      </div>
      <div className="scout-photo-grid">
        {visible.map((item, index) => <ListingCard key={`${item.source}:${item.externalId}`} item={item} grid priority={index < 4} />)}
      </div>
      {lastPage > 1 ? (
        <nav className="mt-5 flex items-center justify-between gap-4" aria-label="Fresh finds pages">
          <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => go(currentPage - 1)} className="min-h-11 rounded-full border border-black/15 bg-white px-4 text-sm font-bold disabled:opacity-40">Previous</button>
          <span className="text-sm tabular-nums">Page {currentPage} of {lastPage}</span>
          <button type="button" aria-label="Next page" disabled={currentPage === lastPage} onClick={() => go(currentPage + 1)} className="min-h-11 rounded-full border border-black/15 bg-white px-4 text-sm font-bold disabled:opacity-40">Next</button>
        </nav>
      ) : null}
    </div>
  );
}

function ListingPhoto({ imageUrl, title, priority = false }: Pick<ListingView, "imageUrl" | "title"> & { priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return imageUrl && !failed ? (
    // eslint-disable-next-line @next/next/no-img-element -- seller image hosts vary by connected source.
    <img src={imageUrl} alt={title} loading={priority ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
  ) : (
    <span className="scout-photo-fallback"><ImageOff size={20} aria-hidden="true" />Photo unavailable</span>
  );
}

function ListingCard({ item, grid = false, priority = false }: { item: ListingView; grid?: boolean; priority?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const displayPrice = item.priceCents == null ? "Price unlisted" : money(item.priceCents);
  const total = item.priceCents != null && item.shippingCents != null ? money(item.priceCents + item.shippingCents) : null;
  const sourceLabel = marketplaceName(item.source);
  const openDetails = () => {
    setDetailsOpen(true);
    dialog.current?.showModal();
  };
  const details = [
    { label: "Tag size", value: item.size },
    { label: "Measurements", value: item.measurements.join(" · ") },
    { label: "Condition", value: item.condition },
    { label: "Fabric", value: item.vintage.fabricNote },
    { label: "Era", value: item.vintage.eraNote },
    { label: "Listed", value: item.listedAt ? new Date(item.listedAt).toLocaleDateString("en-US", { timeZone: "America/Chicago", dateStyle: "medium" }) : null },
    { label: "Shipping", value: item.shippingCents == null ? "Unknown" : money(item.shippingCents) },
    { label: "Item + shipping", value: total },
  ];

  return (
    <article className={grid ? "min-w-0" : "w-[66vw] min-w-[200px] max-w-[290px] shrink-0 snap-start sm:w-[255px]"}>
      <button type="button" className="scout-photo-well" onClick={openDetails} aria-label={`Open ${item.title}`} aria-haspopup="dialog">
        <ListingPhoto key={item.imageUrl} imageUrl={item.imageUrl} title={item.title} priority={priority} />
      </button>
      <div className="scout-card-copy">
        <div className="flex items-start justify-between gap-1">
          <h3 className="min-w-0 flex-1 text-sm font-semibold leading-[1.35]">
            <button type="button" className="line-clamp-2 min-h-10 text-left hover:underline" onClick={openDetails} aria-haspopup="dialog">{item.title}</button>
          </h3>
          <form action={decideListing}>
            <input type="hidden" name="source" value={item.source} /><input type="hidden" name="externalId" value={item.externalId} />
            <button name="verdict" value="save" className="scout-icon -mr-1" aria-label={`Save ${item.title}`} aria-pressed={item.decision === "save"} title={item.decision === "save" ? "Saved" : "Save"}>
              <Bookmark size={17} fill={item.decision === "save" ? "currentColor" : "none"} aria-hidden="true" />
            </button>
          </form>
        </div>
        <p className="text-sm tabular-nums"><span className="font-semibold">{displayPrice}</span>{item.size ? <span className="text-[var(--muted-ink)]"> · {item.size}</span> : null}</p>
        <p className="mt-1 text-xs text-[var(--muted-ink)]">{sourceLabel}</p>
      </div>

      <dialog ref={dialog} onClose={() => setDetailsOpen(false)} className="scout-dialog scout-item-dialog" aria-label={item.title}>
        <div className="scout-dialog-header">
          <span className="text-sm text-[var(--muted-ink)]">{sourceLabel}</span>
          <form method="dialog"><button className="scout-icon" aria-label="Close listing"><X size={21} /></button></form>
        </div>
        {detailsOpen ? (
          <div className="scout-item-layout">
            <div className="scout-photo-well">
              <ListingPhoto key={item.imageUrl} imageUrl={item.imageUrl} title={item.title} priority />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold leading-tight">{item.title}</h2>
              <p className="mt-2 text-xl font-semibold tabular-nums">{displayPrice}</p>
              <dl className="mt-4">
                {details.filter(({ value }) => value).map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-2 border-t border-[var(--line)] py-2 text-sm">
                    <dt className="text-[var(--muted-ink)]">{label}</dt><dd>{value}</dd>
                  </div>
                ))}
              </dl>
              {item.lookNote ? <p className="mt-2 text-sm text-[var(--muted-ink)]">{item.lookNote}</p> : null}
              <a href={item.url} target="_blank" rel="noreferrer" className="scout-primary mt-4 inline-flex items-center gap-2">View original listing <ExternalLink size={15} aria-hidden="true" /></a>
              {(item.garmentKind === "shirt" || item.garmentKind === "pants") && item.decision !== "pass" ? (
                <form action={searchScoutLook} className="mt-2">
                  <input type="hidden" name="source" value={item.source} /><input type="hidden" name="externalId" value={item.externalId} />
                  <ScoutSubmit label="Find me more like this" className="scout-toolbar-button" />
                </form>
              ) : null}
              {item.evidence.visualClues.length || item.evidence.sellerClaims.length ? (
                <details className="mt-3 border-t border-[var(--line)] text-sm">
                  <summary className="cursor-pointer py-3">Listing notes</summary>
                  {item.evidence.sellerClaims.length ? <Evidence title="Seller claims" items={item.evidence.sellerClaims} /> : null}
                  {item.evidence.visualClues.length ? <Evidence title="Corroborating clues" items={item.evidence.visualClues} /> : null}
                </details>
              ) : null}
              <form action={decideListing} className="mt-3 grid grid-cols-3 gap-2">
                <input type="hidden" name="source" value={item.source} /><input type="hidden" name="externalId" value={item.externalId} />
                <Decision active={item.decision === "save"} value="save" icon={<Bookmark size={15} />} label="Save" />
                <Decision active={item.decision === "proof"} value="proof" icon={<ShieldQuestion size={15} />} label="Proof" />
                <Decision active={item.decision === "pass"} value="pass" icon={<ThumbsDown size={15} />} label="Pass" />
              </form>
            </div>
          </div>
        ) : null}
      </dialog>
    </article>
  );
}

function Decision({ active, value, icon, label }: { active: boolean; value: string; icon: React.ReactNode; label: string }) {
  return <button name="verdict" value={value} aria-pressed={active} className="scout-decision">{active ? <Check size={14} /> : icon}{label}</button>;
}

function Evidence({ title, items }: { title: string; items: string[] }) {
  return <div className="py-2"><p className="text-xs font-semibold">{title}</p><ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-[var(--muted-ink)]">{items.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
