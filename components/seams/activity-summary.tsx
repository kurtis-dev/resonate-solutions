import { readSeamsActivity } from "@/lib/seams/activity";
import { marketplaceName } from "@/lib/fieldwear/marketplace-directory";

const areaLabels: Record<string, string> = { masthead: "Header", fresh: "Fresh finds", fit: "Fit settings", join: "Signup", "first-dibs": "First Dibs" };
const garmentLabels: Record<string, string> = { shirt: "Tops", pants: "Pants", skirt: "Skirts", dress: "Dresses", outerwear: "Jackets" };

export async function SeamsActivitySummary() {
  const rows = await readSeamsActivity().catch(() => null);
  const count = (event: string) => rows?.filter((row) => row.event === event).reduce((sum, row) => sum + row.total, 0) ?? 0;
  const clicks = rows?.filter((row) => row.event === "seller-click").slice(0, 8) ?? [];
  const times = rows?.filter((row) => row.event === "visible-time" && row.total >= 60) ?? [];
  const metrics = [
    ["Page views", count("view")],
    ["Listing opens", count("listing-open")],
    ["Seller clicks", count("seller-click")],
    ["Visible minutes", Math.round(count("visible-time") / 60)],
  ] as const;
  return (
    <details id="activity" className="my-5 scroll-mt-6 border-y border-[var(--line)]">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[var(--accent)]">Public catalog activity · last 7 days</summary>
      {rows ? <div className="pb-4">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map(([label, total]) => <div key={label}><dt className="text-sm">{label}</dt><dd className="text-xl font-bold">{total.toLocaleString("en-US")}</dd></div>)}
        </dl>
        {times.length ? <p className="mt-4 text-sm">{times.map(({ kind, total }) => `${areaLabels[kind] ?? "Other"} ${Math.round(total / 60)} min`).join(" · ")}</p> : null}
        {clicks.length ? <ul className="mt-4 space-y-1 text-sm">{clicks.map(({ kind, source, total }) => (
          <li key={kind + ":" + source}>{garmentLabels[kind] ?? "Other"} · {marketplaceName(source)} · {total} seller {total === 1 ? "click" : "clicks"}</li>
        ))}</ul> : null}
        <p className="mt-3 text-xs text-[var(--muted-ink)]">Aggregate counts include repeat visits. Seller clicks measure referrals. Purchases require a seller report.</p>
      </div> : <p className="pb-4 text-sm">Activity is unavailable.</p>}
    </details>
  );
}
