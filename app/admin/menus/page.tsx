import Link from "next/link";
import { createMenuBusinessAction } from "@/app/admin/menus/actions";
import { listMenuBusinesses } from "@/lib/menu-store";
import { mailtoLink } from "@/lib/contact";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

function Field({ label, name, placeholder, required }: { label: string; name: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <input name={name} required={required} placeholder={placeholder} className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
    </label>
  );
}

function StatusFields({ includeGrid = false }: { includeGrid?: boolean }) {
  const content = (
    <>
      <label className="grid gap-2 text-sm font-bold text-ink">
        What should customers see?
        <select name="operatingStatus" defaultValue="normal" className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15">
          <option value="normal">Normal schedule</option>
          <option value="open">Open now</option>
          <option value="closed">Closed today</option>
          <option value="closed_until">Closed until a specific time</option>
          <option value="sold_out">Sold out for today</option>
          <option value="weather_delay">Weather delay</option>
          <option value="limited_menu">Limited menu</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        If closed, when should it reopen?
        <input name="statusUntil" type="datetime-local" className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink md:col-span-2">
        Message customers will see
        <input name="customAnnouncement" className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Closed for a private event today. Back tomorrow at 11." />
      </label>
    </>
  );

  if (includeGrid) {
    return <div className="grid gap-3 md:grid-cols-2">{content}</div>;
  }

  return content;
}

export default async function AdminMenusPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const businesses = await listMenuBusinesses();
  const statusMessage =
    params.status === "missing-db"
      ? "Saved customer pages are not connected yet. The site admin needs to connect the database before pages can be saved."
      : params.status === "missing-name"
        ? "Business name is required."
        : "";

  return (
    <main className="min-h-screen bg-[#101513] text-white">
      <section className="border-b border-white/10 bg-[#151d1a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f6a06f]">Admin mode</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">Create and update customer pages.</h1>
            <p className="mt-3 max-w-3xl leading-7 text-white/72">
              Add a business, publish its customer page, and keep the details current for anyone who opens the QR code, website link, Google profile, or social link.
            </p>
          </div>
          <a
            href={mailtoLink("Business page photos and details")}
            className="inline-flex w-fit rounded-full border border-white/15 bg-white px-5 py-3 font-black text-[#111815] shadow-lg shadow-black/20 hover:bg-[#fff2e9]"
          >
            Send page details
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 rounded-2xl border border-[#f6a06f]/35 bg-[#251b16] px-5 py-4 text-sm leading-6 text-[#ffe1cd]">
          <span className="font-black text-white">You are in the admin dashboard.</span> Changes saved here can update customer-facing pages. Public pages still look polished and simple for customers.
        </div>

        {statusMessage ? <p className="mb-6 rounded-2xl border border-[#f6a06f]/35 bg-[#fff2e9] px-5 py-4 font-bold text-brandDark">{statusMessage}</p> : null}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-2xl border border-white/10 bg-[#f9f5ef] p-6 text-ink shadow-2xl shadow-black/20">
          <div className="-mx-6 -mt-6 mb-6 rounded-t-2xl border-b border-[#d8cec0] bg-white px-6 py-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">Setup</p>
          </div>
          <h2 className="text-2xl font-black text-ink">New customer page</h2>
          <form action={createMenuBusinessAction} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Business name" name="businessName" placeholder="Mellow Moose Burgers" required />
              <Field label="Page link ending (optional)" name="slug" placeholder="mellow-moose-burgers" />
              <Field label="Business type" name="businessType" placeholder="Food truck, coffee shop, salon" />
              <Field label="City or service area" name="city" placeholder="Siloam Springs, AR or Brooklyn, NY" />
              <Field label="Hours customers should see" name="hoursSummary" placeholder="Tue-Fri 11 AM-2 PM & 4-8 PM" />
              <Field label="Location or service area note" name="locationSummary" placeholder="Griffin's Food Court or serving North Brooklyn" />
              <Field label="Address for maps" name="address" placeholder="825 S Mt Olive, Siloam Springs, AR" />
              <Field label="Phone" name="phone" placeholder="(479) 305-2800" />
              <Field label="Order, booking, or quote link" name="orderingUrl" placeholder="https://..." />
              <Field label="Review link" name="reviewUrl" placeholder="https://..." />
              <Field label="Facebook link" name="facebookUrl" placeholder="https://..." />
              <Field label="Instagram link" name="instagramUrl" placeholder="https://..." />
              <Field label="Main photo or logo link" name="heroImageUrl" placeholder="/assets/mellow-moose-logo.jpg" />
              <Field label="Design style (optional)" name="brandTheme" placeholder="default or mellow-moose" />
              <Field label="Menu or service version" name="activeMenuKey" placeholder="main, regular-menu, event-menu" />
            </div>

            <div className="rounded-2xl border border-[#cdddc3] bg-[#edf5e7] p-4">
              <h3 className="font-black text-ink">Today&apos;s customer message</h3>
              <p className="mt-1 text-sm leading-6 text-muted">Use this when the business is open, closed, delayed, sold out, running a limited menu, or needs a quick note at the top of the page.</p>
              <div className="mt-4">
                <StatusFields includeGrid />
              </div>
            </div>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Short description
              <textarea name="description" rows={3} className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Smashed fresh beef burgers, loaded fries, salads, kids meals, and rotating specials." />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Extra note for customers
              <input name="statusNote" className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Best burger winner, new client special, or important reminder" />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Top banner message
              <input name="popupBanner" className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Special event menu is active today." />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Menu or service section
              <input name="sectionName" className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" placeholder="Today menu, Services, Packages, or Featured offers" />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Menu or service items
              <textarea
                name="menuItems"
                rows={7}
                className="rounded-xl border border-[#d8cec0] bg-white px-4 py-3 font-normal shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                placeholder={"The OG Smashburger | $9.99 | Grilled onions, American cheese, burger sauce, and pickles | Local favorite\nBlazing Moose Fries | $13.99 | Nacho cheese, grilled peppers, beef patty, bacon, Smokeshow sauce, and ranch | Best seller"}
              />
              <span className="text-xs font-normal leading-5 text-muted">Put one item per line. Format: name | price | short description | label.</span>
            </label>

            <label className="flex items-center gap-3 text-sm font-bold text-ink">
              <input name="isPublished" type="checkbox" defaultChecked className="h-4 w-4" />
              Make this page public now
            </label>

            <button type="submit" className="rounded-full bg-brand px-5 py-3 font-black text-white shadow-soft hover:bg-brandDark">
              Create customer page
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#f9f5ef] p-6 text-ink shadow-2xl shadow-black/20">
          <div className="-mx-6 -mt-6 mb-6 rounded-t-2xl border-b border-[#d8cec0] bg-[#1f2a26] px-6 py-4 text-white">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f6a06f]">Internal account management</p>
          </div>
          <h2 className="text-2xl font-black text-ink">Manage customer accounts</h2>
          <p className="mt-3 leading-7 text-muted">
            This side is for Resonate setup work: open a customer page, hand off the owner dashboard, and keep internal account work separate from the customer&apos;s daily controls.
          </p>
          <div className="mt-5 grid gap-3">
            <Link href="/m/mellow-moose-burgers" className="block rounded-2xl border border-[#d8cec0] bg-white p-4 shadow-sm hover:border-brand">
              <span className="font-black text-ink">Open the demo customer page</span>
              <span className="mt-1 block text-sm text-muted">Shows what a customer sees when they scan or tap the public link.</span>
            </Link>
            <Link href="/dashboard/mellow-moose-burgers" className="block rounded-2xl border border-[#d8cec0] bg-white p-4 shadow-sm hover:border-brand">
              <span className="font-black text-ink">Open the demo owner dashboard</span>
              <span className="mt-1 block text-sm text-muted">This is where a business owner changes open/closed status, hours, customer messages, and menu or service version.</span>
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-[#f6a06f]/35 bg-[#fff2e9] p-4 text-sm leading-6 text-brandDark">
            <span className="font-black text-ink">Important split:</span> owners should use their dashboard for daily customer updates. This admin area is for setup, support, account review, and internal management.
          </div>

          <h2 className="mt-8 text-2xl font-black text-ink">Existing business pages</h2>
          {!businesses ? (
            <p className="mt-5 leading-7 text-muted">Connect the customer page database to see saved pages here.</p>
          ) : businesses.length === 0 ? (
            <p className="mt-5 leading-7 text-muted">No saved customer pages yet.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              {businesses.map((business) => (
                <div key={business.slug} className="rounded-2xl border border-[#d8cec0] bg-white p-4 shadow-sm">
                  <span className="font-black text-ink">{business.businessName}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {business.businessType} {business.city ? `in ${business.city}` : ""} - {business.itemCount} items - {business.isPublished ? "Published" : "Draft"}
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/m/${business.slug}`} className="rounded-full border border-[#d8cec0] px-3 py-2 text-xs font-black text-ink hover:border-brand">Public page</Link>
                    <Link href={`/dashboard/${business.slug}`} className="rounded-full bg-[#1f2a26] px-3 py-2 text-xs font-black text-white hover:bg-brandDark">Owner dashboard</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </div>
    </main>
  );
}
