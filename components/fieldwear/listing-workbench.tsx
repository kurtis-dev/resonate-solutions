"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  ImageOff,
  Search,
  ShieldQuestion,
  ThumbsDown,
  X,
} from "lucide-react";
import { decideListing } from "@/app/fieldwear/actions";
import type { GarmentKind } from "@/lib/fieldwear/listing-model";
import { departmentLabels, fitPriority, matchesScoutFit, type ScoutPreferences } from "@/lib/fieldwear/preferences";
import { marketplaceName } from "@/lib/fieldwear/marketplace-directory";
import type { vintageSignals } from "@/lib/fieldwear/vintage-signals";

export type ListingView = {
  source:string; externalId:string; url:string; title:string; imageUrl:string|null;
  priceCents:number|null; shippingCents:number|null; size:string|null; condition:string|null;
  measurements:string[]; vintage:ReturnType<typeof vintageSignals>;
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

export function ListingShelf({ id, label, description, items }:{ id:string; label:string; description:string; items:ListingView[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
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
          <div className="hidden shrink-0 gap-2 sm:flex" aria-label={`${label} carousel controls`}>
            <button type="button" onClick={() => scroll(-1)} className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-[var(--pine)] transition hover:border-[var(--pine)] hover:bg-[var(--sand)] active:scale-95" aria-label={`Scroll ${label} left`}><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => scroll(1)} className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-[var(--pine)] transition hover:border-[var(--pine)] hover:bg-[var(--sand)] active:scale-95" aria-label={`Scroll ${label} right`}><ChevronRight size={18} /></button>
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
          <p className="sr-only">Scroll horizontally to browse. Each image and View link opens the original marketplace page.</p>
          {items.map((item) => <ListingCard key={`${id}:${item.source}:${item.externalId}`} item={item} />)}
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

export function FreshCatalog({ items }: { items: ListingView[] }) {
  const [kind, setKind] = useState<"shirt" | "pants">(() => items.some((item) => item.garmentKind === "shirt") ? "shirt" : "pants");
  const [order, setOrder] = useState("relevance");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [era, setEra] = useState("");
  const [fabric, setFabric] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const invalidRange = min !== "" && max !== "" && Number(min) > Number(max);
  const results = useMemo(() => {
    const filtered = items.filter((item) => {
      if (item.garmentKind !== kind || invalidRange || !matchesFreshType(item, garmentType) || !matchesFreshEvidence(item, era, fabric)) return false;
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
  }, [items, kind, garmentType, era, fabric, invalidRange, min, max, order]);
  const lastPage = Math.max(1, Math.ceil(results.length / freshPageSize));
  const currentPage = Math.min(page, lastPage);
  const from = (currentPage - 1) * freshPageSize;
  const visible = results.slice(from, from + freshPageSize);
  const control = "mt-1 min-h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-base font-normal text-[var(--ink)]";
  const hasFilters = Boolean(garmentType || era || fabric || min || max);
  const clearFilters = () => {
    setGarmentType("");
    setEra("");
    setFabric("");
    setMin("");
    setMax("");
    setPage(1);
  };
  const go = (nextPage: number) => {
    setPage(nextPage);
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Garment type" role="group">
        {([["shirt", "Shirts"], ["pants", "Bottoms"]] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={kind === value} onClick={() => { if (kind !== value) { setKind(value); setGarmentType(""); } setPage(1); }} className={`min-h-11 rounded-full border px-4 text-sm font-bold ${kind === value ? "border-[var(--pine)] bg-[var(--pine)] text-white" : "border-black/15 bg-white text-[var(--pine)]"}`}>
            {label} <span className="ml-1 tabular-nums">{items.filter((item) => item.garmentKind === value).length}</span>
          </button>
        ))}
      </div>
      <div className="my-4 grid grid-cols-2 items-end gap-3 rounded-2xl border border-black/10 bg-[var(--card)] p-3 sm:grid-cols-3">
        <label className="min-w-0 text-xs font-bold">Garment type
          <select value={garmentType} onChange={(event) => { setGarmentType(event.target.value); setPage(1); }} className={control}>
            <option value="">All {kind === "shirt" ? "shirts" : "bottoms"}</option>
            {garmentOptions[kind].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-xs font-bold">Era
          <select value={era} onChange={(event) => { setEra(event.target.value); setPage(1); }} className={control}>
            <option value="">Any era</option>
            <option value="pre-1999">Pre-1999 clues</option>
            <option value="1990s">1990s, year open</option>
            <option value="undated">Undated</option>
          </select>
        </label>
        <label className="min-w-0 text-xs font-bold">Fabric
          <select value={fabric} onChange={(event) => { setFabric(event.target.value); setPage(1); }} className={control}>
            <option value="">Any fabric</option>
            <option value="either">Cotton or wool</option>
            <option value="cotton">Cotton</option>
            <option value="wool">Wool</option>
            <option value="pure">100% cotton or wool</option>
            <option value="blend">Sturdy blends</option>
          </select>
        </label>
        <label className="min-w-0 text-xs font-bold">Sort by
          <select value={order} onChange={(event) => { setOrder(event.target.value); setPage(1); }} className={control}>
            <option value="relevance">Best match</option>
            <option value="newest">Recently listed</option>
            <option value="oldest-garment">Older garment clues</option>
            <option value="low">Price low to high</option>
            <option value="high">Price high to low</option>
          </select>
        </label>
        <label className="text-xs font-bold">Min price ($)<input type="number" min="0" step="0.01" inputMode="decimal" value={min} onChange={(event) => { setMin(event.target.value); setPage(1); }} className={control} /></label>
        <label className="text-xs font-bold">Max price ($)<input type="number" min="0" step="0.01" inputMode="decimal" value={max} onChange={(event) => { setMax(event.target.value); setPage(1); }} className={control} /></label>
        {hasFilters ? <button type="button" onClick={clearFilters} className="col-span-full min-h-11 justify-self-start px-2 text-sm font-bold text-[var(--pine)] underline underline-offset-4">Clear filters</button> : null}
      </div>
      <div ref={resultsRef} tabIndex={-1} className="scroll-mt-24 pb-3 text-sm text-[var(--muted-ink)]" role="status">
        {invalidRange ? "Minimum price must be at or below the maximum." : results.length ? `Showing ${from + 1}–${from + visible.length} of ${results.length}` : "No listings match these filters."}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((item) => <ListingCard key={`${item.source}:${item.externalId}`} item={item} grid />)}
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

function ListingCard({ item, grid = false }: { item:ListingView; grid?:boolean }) {
  const total = item.priceCents == null ? null : item.priceCents + (item.shippingCents ?? 0);
  const sourceLabel = marketplaceName(item.source);

  return (
    <article className={`${grid ? "min-w-0" : "w-[82vw] min-w-[278px] max-w-[348px] shrink-0 snap-start sm:w-[326px]"} overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_14px_38px_rgba(44,38,27,.08)]`}>
      <a href={item.url} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] overflow-hidden bg-[#e5e0d6]" aria-label={`View ${item.title} on ${sourceLabel}`}>
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- marketplace hosts are dynamic, so a fixed Image allowlist would reject valid imports.
          <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.015]" />
        ) : (
          <span className="grid h-full place-items-center text-[var(--muted-ink)]"><ImageOff size={30} /><span className="sr-only">No marketplace photo supplied</span></span>
        )}
        <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--pine)]">{item.garmentKind === "pants" ? "Pants · " : item.garmentKind === "shirt" ? "Shirt · " : ""}{sourceLabel}</span>
      </a>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[.11em] text-[var(--rust)]">
          <span className="max-w-[58%] truncate" title={item.size ?? "Size unconfirmed"}>{item.size ?? "Size unconfirmed"}</span>
          <span className="flex shrink-0 items-center gap-1 text-[var(--muted-ink)]"><Clock3 size={12} />{item.listedAt ? "Listed" : "Checked"} {relativeTime(item.listedAt ?? item.lastSeenAt)}</span>
        </div>
        <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 block rounded-sm hover:text-[var(--rust)]">
          <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6">{item.title}</h3>
        </a>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-black tabular-nums">{total == null ? "Price unlisted" : money(total)}</p>
            <p className="text-[10px] text-[var(--muted-ink)]">{item.shippingCents == null ? "Shipping not confirmed" : item.shippingCents === 0 ? "Free shipping listed" : "Item + shipping"}</p>
          </div>
          <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--pine)] px-3.5 text-xs font-bold text-white transition hover:bg-[#2b4432] active:scale-[.98]" aria-label={`View ${item.title} on ${sourceLabel}`}>View <ArrowRight size={14} /></a>
        </div>

        <details className="mt-4 rounded-xl bg-[var(--paper)] px-3 py-2">
          <summary className="min-h-10 cursor-pointer py-2 text-xs font-bold">Listing details</summary>
          {item.measurements.length > 0 ? <Evidence title="Seller measurements" items={item.measurements} /> : null}
          <Evidence title="Age and construction" items={[item.vintage.eraNote, ...(item.vintage.fabricNote ? [item.vintage.fabricNote] : [])]} />
          {item.evidence.visualClues.length > 0 ? <Evidence title="Corroborating clues" items={item.evidence.visualClues} /> : null}
          {item.evidence.sellerClaims.length > 0 ? <Evidence title="Seller claims" items={item.evidence.sellerClaims} /> : null}
          {item.condition ? <Evidence title="Listed condition" items={[item.condition]} /> : null}
        </details>

        <form action={decideListing} className="mt-3 grid grid-cols-3 gap-2">
          <input type="hidden" name="source" value={item.source} /><input type="hidden" name="externalId" value={item.externalId} />
          <Decision active={item.decision === "save"} value="save" icon={<Bookmark size={15} />} label="Save" />
          <Decision active={item.decision === "proof"} value="proof" icon={<ShieldQuestion size={15} />} label="Proof" />
          <Decision active={item.decision === "pass"} value="pass" icon={<ThumbsDown size={15} />} label="Pass" />
        </form>
      </div>
    </article>
  );
}

function Decision({ active, value, icon, label }:{ active:boolean; value:string; icon:React.ReactNode; label:string }) {
  return <button name="verdict" value={value} aria-pressed={active} className={`flex min-h-11 cursor-pointer items-center justify-center gap-1 rounded-xl border text-xs font-bold transition active:scale-[.98] ${active ? "border-[var(--pine)] bg-[var(--pine)] text-white" : "border-black/10 bg-white text-[var(--muted-ink)] hover:border-[var(--pine)] hover:text-[var(--pine)]"}`}>{active ? <Check size={14} /> : icon}{label}</button>;
}
function Evidence({ title, items, warning=false }:{ title:string; items:string[]; warning?:boolean }) { return <div className="border-t border-black/8 py-2"><p className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.1em] ${warning ? "text-[var(--rust)]" : "text-[var(--pine)]"}`}>{warning ? <AlertCircle size={12} /> : null}{title}</p><ul className="mt-1 space-y-1 text-[11px] leading-4 text-[var(--muted-ink)]">{items.slice(0,4).map((item) => <li key={item}>• {item}</li>)}</ul></div>; }
function money(cents:number) { return new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(cents / 100); }
function relativeTime(value:string) { const hours = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 3600000)); return hours < 1 ? "now" : hours < 24 ? `${hours}h ago` : `${Math.round(hours/24)}d ago`; }
