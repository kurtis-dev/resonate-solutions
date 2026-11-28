import Link from "next/link";
import { FreshCatalog } from "@/components/fieldwear/listing-workbench";
import { toListingView } from "@/lib/fieldwear/listing-view";
import { marketplaceName } from "@/lib/fieldwear/marketplace-directory";
import { readDailyCatalogReport } from "@/lib/seams/daily-catalog-report";
import { seamsPath } from "@/lib/seams/paths";
import "../../fieldwear/scout.css";
import "../storefront.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daily refresh | Seams Familiar", robots: { index: false, follow: false } };

const centralTime = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "America/Chicago" });
const statuses = {
  searched: "Checked", partial: "Partially checked", unavailable: "Unavailable", "needs-access": "Access needed", "no-feed": "Feed unavailable",
};

export default async function DailyFinds({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  const first = (await searchParams).run === "first";
  const report = await readDailyCatalogReport(first).catch((error: unknown) => {
    console.error("Seams daily report read failed", error);
    return undefined;
  });
  const cards = report?.examples.map((item) => toListingView(item, item.catalogFirstSeenAt ?? item.listedAt, item.catalogCheckedAt ?? report.completedAt, null,
    { department: "any", shirtSizes: [], pantsSizes: [], shirtBudget: null, pantsBudget: null, matchingOnly: false })) ?? [];
  const reportUrl = `${seamsPath}/daily-finds`;
  return (
    <main className="fieldwear-scout seams-public min-h-screen pb-12">
      <div className="scout-container">
        <nav className="seams-shelves" aria-label="Daily refresh navigation">
          <Link href={seamsPath}>Browse the full catalog</Link>
          <Link href={reportUrl} aria-current={!first ? "page" : undefined}>Latest run</Link>
          <Link href={reportUrl + "?run=first"} aria-current={first ? "page" : undefined}>First run</Link>
        </nav>
        <h1 className="my-5 text-2xl font-bold">Daily refresh</h1>
        {report === undefined ? <p>The refresh report is temporarily unavailable.</p> : report === null ? (
          <p>The first scheduled run is pending. The catalog refreshes daily during the 6 a.m. Central hour in standard time and the 7 a.m. hour in daylight time.</p>
        ) : (
          <>
            <p className="mb-1 font-semibold">{report.total} {report.total === 1 ? "listing" : "listings"} added</p>
            <p className="mb-4 text-sm text-[var(--muted-ink)]">{centralTime.format(new Date(report.completedAt))} Central{report.ok ? "" : " · Incomplete run"}</p>
            <ul aria-label="New listings by source" className="mb-6 grid max-w-2xl gap-x-6 sm:grid-cols-2">
              {report.sources.map(({ source, added, status }) => (
                <li key={source} className="flex justify-between gap-3 border-b border-[var(--line)] py-2 text-sm">
                  <span>{source === "ebay-brands" ? "eBay" : source === "ebay-goodwill" ? "Goodwill on eBay" : marketplaceName(source)}</span>
                  <span className="text-right tabular-nums">{added} <span className="text-[var(--muted-ink)]">· {statuses[status]}</span></span>
                </li>
              ))}
            </ul>
            <h2 className="mb-2 text-xl font-semibold">Still available from this run</h2>
            {cards.length ? <FreshCatalog items={cards} personalActions={false} womenswear toolbarNavigation={<></>} /> : <p>No available listings from this run are in the catalog.</p>}
          </>
        )}
        <p className="mt-5 text-sm text-[var(--muted-ink)]">Shopify Global Catalog results update on demand in the full catalog.</p>
      </div>
    </main>
  );
}
