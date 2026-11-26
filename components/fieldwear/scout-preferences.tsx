import { SlidersHorizontal } from "lucide-react";
import { saveScoutPreferences } from "@/app/fieldwear/actions";
import { departmentLabels, type ScoutPreferences } from "@/lib/fieldwear/preferences";

const control = "mt-1 block min-h-12 w-full rounded-xl border border-black/20 bg-white px-3 text-base";

export function ScoutPreferencesForm({ preferences, status }: { preferences: ScoutPreferences; status?: string }) {
  return (
    <details id="preferences" open={status ? true : undefined} className="mb-5 scroll-mt-24 rounded-2xl border border-black/10 bg-[var(--card)] px-4">
      <summary className="min-h-12 cursor-pointer py-3 font-bold text-[var(--pine)]">
        <SlidersHorizontal aria-hidden="true" size={17} className="mr-2 inline-block" />Scout preferences
      </summary>
      <form action={saveScoutPreferences} className="border-t border-black/10 pb-4 pt-3">
        <p className="mb-4 text-sm text-[var(--muted-ink)]">Choose what Scout puts first in Daily finds and the catalog.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-bold">Department
            <select className={control} name="department" defaultValue={preferences.department}>
              {Object.entries(departmentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold">Shirt sizes
            <input className={control} name="shirtSizes" defaultValue={preferences.shirtSizes.join(", ")} placeholder="M, XL Tall, XXL" maxLength={120} aria-describedby="size-help" />
          </label>
          <label className="text-sm font-bold">Bottoms sizes
            <input className={control} name="pantsSizes" defaultValue={preferences.pantsSizes.join(", ")} placeholder="38x32, 40x34, 12" maxLength={120} aria-describedby="size-help" />
          </label>
          <p id="size-help" className="text-sm text-[var(--muted-ink)] sm:col-span-2 lg:col-span-3">Separate sizes with commas. For bottoms, use waist × inseam or the tag size. Leave blank for any size.</p>
          <label className="text-sm font-bold">Shirt budget ($)
            <input className={control} name="shirtBudget" type="number" inputMode="decimal" min="0.01" max="9999.99" step="0.01" defaultValue={preferences.shirtBudget ?? ""} placeholder="Any price" />
          </label>
          <label className="text-sm font-bold">Bottoms budget ($)
            <input className={control} name="pantsBudget" type="number" inputMode="decimal" min="0.01" max="9999.99" step="0.01" defaultValue={preferences.pantsBudget ?? ""} placeholder="Any price" />
          </label>
        </div>
        <p className="mt-2 text-sm text-[var(--muted-ink)]">Budgets apply to the Under budget filter and include shipping when listed.</p>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-bold">
          <input type="checkbox" name="matchingOnly" defaultChecked={preferences.matchingOnly} className="h-5 w-5 accent-[var(--pine)]" />
          Only show matching sizes and compatible departments
        </label>
        <p className="text-sm text-[var(--muted-ink)]">Listings without a department label can still appear. Saved finds stay available.</p>
        <button className="mt-4 min-h-11 rounded-xl bg-[var(--pine)] px-4 font-bold text-white">Save preferences</button>
        {status === "saved" ? <p className="mt-2 text-sm font-semibold text-[var(--pine)]" role="status">Preferences saved.</p> : null}
        {status === "invalid" ? <p className="mt-2 text-sm font-semibold text-[var(--rust)]" role="alert">Check the size format and budgets. Enter up to 12 comma-separated sizes per group.</p> : null}
      </form>
    </details>
  );
}
