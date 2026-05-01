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
const compactInputClass = "rounded-xl border border-[#d8cec0] bg-white px-3 py-2 text-sm font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

const weekdays = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" }
];

const timeOptions = [
  "",
  "5:00 AM",
  "5:30 AM",
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM"
];

type DayHours = {
  closed: boolean;
  open1: string;
  close1: string;
  open2: string;
  close2: string;
};

function defaultHoursForDay(slug: string, dayKey: string): DayHours {
  const closed = { closed: true, open1: "", close1: "", open2: "", close2: "" };

  if (slug === "mellow-moose-burgers" && ["tue", "wed", "thu", "fri"].includes(dayKey)) {
    return { closed: false, open1: "11:00 AM", close1: "2:00 PM", open2: "4:00 PM", close2: "8:00 PM" };
  }

  if (slug === "mellow-moose-burgers" && dayKey === "sat") {
    return { closed: false, open1: "11:00 AM", close1: "5:00 PM", open2: "", close2: "" };
  }

  return closed;
}

function TimeSelect({ name, defaultValue, label }: { name: string; defaultValue: string; label: string }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-muted">
      {label}
      <select name={name} defaultValue={defaultValue} className={compactInputClass}>
        {timeOptions.map((time) => (
          <option key={time || "blank"} value={time}>{time || "Select time"}</option>
        ))}
      </select>
    </label>
  );
}

function WeeklyHoursEditor({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-[#d8cec0] bg-white p-4">
      <input type="hidden" name="hoursInputMode" value="weekly" />
      <div>
        <h3 className="font-black text-[#1d2824]">Weekly hours customers should see</h3>
        <p className="mt-1 text-sm leading-6 text-muted">Set each day separately. Use the second time window for split hours, like lunch and dinner service.</p>
      </div>
      <div className="mt-4 grid gap-4">
        {weekdays.map((day) => {
          const defaults = defaultHoursForDay(slug, day.key);

          return (
            <div key={day.key} className="rounded-2xl border border-[#eadfce] bg-[#f9f5ef] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black text-[#1d2824]">{day.label}</p>
                <label className="flex items-center gap-2 text-sm font-bold text-muted">
                  <input name={`${day.key}Closed`} type="checkbox" defaultChecked={defaults.closed} className="h-4 w-4" />
                  Closed
                </label>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <TimeSelect name={`${day.key}Open1`} defaultValue={defaults.open1} label="Open" />
                <TimeSelect name={`${day.key}Close1`} defaultValue={defaults.close1} label="Close" />
                <TimeSelect name={`${day.key}Open2`} defaultValue={defaults.open2} label="Open again" />
                <TimeSelect name={`${day.key}Close2`} defaultValue={defaults.close2} label="Close again" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

            <WeeklyHoursEditor slug={business.slug} />

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
