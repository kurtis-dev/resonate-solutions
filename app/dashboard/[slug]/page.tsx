import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { updateBusinessDashboardAction } from "@/app/dashboard/[slug]/actions";
import { getMenuBusiness } from "@/lib/menu-store";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
};

function statusText(status?: string) {
  switch (status) {
    case "saved":
      return "Saved. Your customer page has been updated.";
    case "missing-db":
      return "This dashboard is not connected to the live customer page database yet.";
    case "missing-slug":
      return "This business page could not be found.";
    default:
      return "";
  }
}

function FieldShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#1d2824]">
      {label}
      {children}
    </label>
  );
}

const inputClass = "rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export default async function BusinessDashboardPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const business = await getMenuBusiness(slug);

  if (!business) {
    notFound();
  }

  const message = statusText(query.status);
  const variants = business.menuVariants?.length ? business.menuVariants : [{ key: business.activeMenuKey || "main", label: business.sections[0]?.name || "Main menu or services" }];

  return (
    <main className="min-h-screen bg-[#101513] text-white">
      <section className="border-b border-white/10 bg-[#151d1a]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f6a06f]">Business owner dashboard</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">{business.businessName}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-white/72">
              Use this page for day-to-day changes customers need to see right away: open or closed status, hours, announcements, and the active menu or service list.
            </p>
          </div>
          <Link href={`/m/${business.slug}`} className="inline-flex w-fit rounded-full border border-white/15 bg-white px-5 py-3 font-black text-[#111815] shadow-lg shadow-black/20 hover:bg-[#fff2e9]">
            View customer page
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-2xl border border-white/10 bg-[#1a231f] p-5 shadow-2xl shadow-black/20">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f6a06f]">What customers see now</p>
          <h2 className="mt-3 text-2xl font-black">{business.operatingStatus.replaceAll("_", " ")}</h2>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-white/74">
            <p><span className="font-black text-white">Hours:</span> {business.hoursSummary || "No hours listed yet."}</p>
            <p><span className="font-black text-white">Location/service area:</span> {business.locationSummary || business.city || "No location listed yet."}</p>
            <p><span className="font-black text-white">Customer message:</span> {business.customAnnouncement || business.popupBanner || business.statusNote || "No special message showing."}</p>
            <p><span className="font-black text-white">Current list:</span> {business.activeMenuKey || "main"}</p>
          </div>
          <div className="mt-6 rounded-2xl border border-[#f6a06f]/35 bg-[#251b16] p-4 text-sm leading-6 text-[#ffe1cd]">
            This dashboard is for the business owner. Resonate internal setup, billing, support notes, and account management belong in the separate admin area.
          </div>
        </aside>

        <section className="rounded-2xl border border-white/10 bg-[#f9f5ef] p-6 text-ink shadow-2xl shadow-black/20">
          <div className="-mx-6 -mt-6 mb-6 rounded-t-2xl border-b border-[#d8cec0] bg-white px-6 py-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">Quick customer updates</p>
          </div>

          {message ? <p className="mb-5 rounded-2xl border border-[#cdddc3] bg-[#edf5e7] px-4 py-3 font-bold text-brandDark">{message}</p> : null}

          <form action={updateBusinessDashboardAction} className="grid gap-5">
            <input type="hidden" name="slug" value={business.slug} />
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="What should customers see?">
                <select name="operatingStatus" defaultValue={business.operatingStatus} className={inputClass}>
                  <option value="normal">Normal schedule</option>
                  <option value="open">Open now</option>
                  <option value="closed">Closed today</option>
                  <option value="closed_until">Closed until a specific time</option>
                  <option value="sold_out">Sold out for today</option>
                  <option value="weather_delay">Weather delay</option>
                  <option value="limited_menu">Limited menu or services</option>
                </select>
              </FieldShell>

              <FieldShell label="If closed, when should it reopen?">
                <input name="statusUntil" type="datetime-local" defaultValue={business.statusUntil || ""} className={inputClass} />
              </FieldShell>
            </div>

            <FieldShell label="Message customers will see">
              <input name="customAnnouncement" defaultValue={business.customAnnouncement || ""} className={inputClass} placeholder="Closed for a private event today. Back tomorrow at 11." />
            </FieldShell>

            <FieldShell label="Top message">
              <input name="popupBanner" defaultValue={business.popupBanner || ""} className={inputClass} placeholder="Special event menu is active today." />
            </FieldShell>

            <FieldShell label="Extra customer note">
              <input name="statusNote" defaultValue={business.statusNote || ""} className={inputClass} placeholder="Closing at 7 PM tonight because of weather." />
            </FieldShell>

            <FieldShell label="Hours customers should see">
              <textarea name="hoursSummary" rows={3} defaultValue={business.hoursSummary || ""} className={inputClass} placeholder={"Tue 11-2 & 4-8\nWed 11-2 & 4-8\nThu catering lunch; open 4-8"} />
            </FieldShell>

            <FieldShell label="Which menu or service list should show?">
              <select name="activeMenuKey" defaultValue={business.activeMenuKey || variants[0]?.key || "main"} className={inputClass}>
                {variants.map((variant) => (
                  <option key={variant.key} value={variant.key}>{variant.label}</option>
                ))}
              </select>
            </FieldShell>

            <button type="submit" className="rounded-full bg-brand px-5 py-3 font-black text-white shadow-soft hover:bg-brandDark">
              Save customer updates
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
