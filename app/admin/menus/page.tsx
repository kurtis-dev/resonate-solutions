import Link from "next/link";
import { createMenuBusinessAction, updateMenuModeAction } from "@/app/admin/menus/actions";
import { listMenuBusinesses } from "@/lib/menu-store";
import { mailtoLink, questionsEmail } from "@/lib/contact";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

function Field({ label, name, placeholder, required }: { label: string; name: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      {label}
      <input name={name} required={required} placeholder={placeholder} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
    </label>
  );
}

export default async function AdminMenusPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const businesses = await listMenuBusinesses();
  const statusMessage =
    params.status === "missing-db"
      ? "Database is not connected yet. Add DATABASE_URL in Vercel and run database/schema.sql."
      : params.status === "missing-name"
        ? "Business name is required."
        : "";

  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">MenuPilot product</p>
        <h1 className="mt-3 text-4xl font-black text-ink md:text-6xl">Create a live customer menu.</h1>
        <p className="mt-5 leading-7 text-muted">
          This is the first operator workflow: enter a local business, publish its menu page, and use the generated QR code anywhere customers need the current details.
        </p>
        <a
          href={mailtoLink("MenuPilot photos and menu details")}
          className="mt-6 inline-flex rounded-full border border-line bg-white px-5 py-3 font-black text-ink hover:border-brand"
        >
          Photo inbox: {questionsEmail}
        </a>
      </div>

      {statusMessage ? <p className="mb-6 rounded-2xl bg-sage px-5 py-4 font-bold text-brandDark">{statusMessage}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-ink">New menu page</h2>
          <form action={createMenuBusinessAction} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Business name" name="businessName" placeholder="Mellow Moose Burgers" required />
              <Field label="Optional slug" name="slug" placeholder="mellow-moose-burgers" />
              <Field label="Business type" name="businessType" placeholder="Food truck, coffee shop, salon" />
              <Field label="City" name="city" placeholder="Siloam Springs, AR" />
              <Field label="Hours summary" name="hoursSummary" placeholder="Tue-Fri 11 AM-2 PM & 4-8 PM" />
              <Field label="Location summary" name="locationSummary" placeholder="Griffin's Food Court" />
              <Field label="Address or map search" name="address" placeholder="825 S Mt Olive, Siloam Springs, AR" />
              <Field label="Phone" name="phone" placeholder="(479) 305-2800" />
              <Field label="Order URL" name="orderingUrl" placeholder="https://..." />
              <Field label="Review URL" name="reviewUrl" placeholder="https://..." />
              <Field label="Facebook URL" name="facebookUrl" placeholder="https://..." />
              <Field label="Instagram URL" name="instagramUrl" placeholder="https://..." />
              <Field label="Hero image URL" name="heroImageUrl" placeholder="/assets/mellow-moose-logo.jpg" />
              <Field label="Brand theme" name="brandTheme" placeholder="default or mellow-moose" />
              <Field label="Active menu key" name="activeMenuKey" placeholder="main, mellow-moose, dos-gordos" />
            </div>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Short description
              <textarea name="description" rows={3} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="Smashed fresh beef burgers, loaded fries, salads, kids meals, and rotating specials." />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Status note
              <input name="statusNote" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="Best of Siloam Springs 2026 Winner: Burger / Local" />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Popup banner
              <input name="popupBanner" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="Dos Gordos popup is active today." />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Section name
              <input name="sectionName" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="Today menu" />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              Menu items
              <textarea
                name="menuItems"
                rows={7}
                className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal"
                placeholder={"The OG Smashburger | $9.99 | Grilled onions, American cheese, burger sauce, and pickles | Local favorite\nBlazing Moose Fries | $13.99 | Nacho cheese, grilled peppers, beef patty, bacon, Smokeshow sauce, and ranch | Best seller"}
              />
              <span className="text-xs font-normal leading-5 text-muted">Format each line as: item name | price | description | badge.</span>
            </label>

            <label className="flex items-center gap-3 text-sm font-bold text-ink">
              <input name="isPublished" type="checkbox" defaultChecked className="h-4 w-4" />
              Publish this menu page now
            </label>

            <button type="submit" className="rounded-full bg-brand px-5 py-3 font-black text-white shadow-soft hover:bg-brandDark">
              Create menu page
            </button>
          </form>
        </section>

        <section className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-ink">Customer page controls</h2>
          <p className="mt-3 leading-7 text-muted">
            This is the shape of the owner/admin experience: switch the active menu, adjust the banner, review the public page, and keep one QR code pointed at the current customer-facing version.
          </p>
          <div className="mt-5 grid gap-3">
            <Link href="/m/mellow-moose-burgers" className="block rounded-2xl border border-line bg-cream p-4 hover:border-brand">
              <span className="font-black text-ink">Open Mellow Moose live page</span>
              <span className="mt-1 block text-sm text-muted">Normal burger menu and local favorites.</span>
            </Link>
            <Link href="/m/mellow-moose-burgers?menu=dos-gordos" className="block rounded-2xl border border-line bg-cream p-4 hover:border-brand">
              <span className="font-black text-ink">Preview Dos Gordos popup mode</span>
              <span className="mt-1 block text-sm text-muted">Shows the takeover structure without changing the live default.</span>
            </Link>
          </div>

          <form action={updateMenuModeAction} className="mt-6 rounded-2xl border border-line bg-sage p-4">
            <h3 className="font-black text-ink">Database menu mode update</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Once Mellow Moose is stored in the database, this form becomes the button that flips the live QR destination between regular menu and popup menu.
            </p>
            <input type="hidden" name="slug" value="mellow-moose-burgers" />
            <label className="mt-4 grid gap-2 text-sm font-bold text-ink">
              Active menu key
              <select name="activeMenuKey" defaultValue="mellow-moose" className="rounded-2xl border border-line bg-white px-4 py-3 font-normal">
                <option value="mellow-moose">Mellow Moose Burgers</option>
                <option value="dos-gordos">Dos Gordos popup</option>
              </select>
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-ink">
              Banner text
              <input name="popupBanner" className="rounded-2xl border border-line bg-white px-4 py-3 font-normal" placeholder="Dos Gordos popup is active at Mellow Moose today." />
            </label>
            <button type="submit" className="mt-4 rounded-full bg-brand px-5 py-3 font-black text-white shadow-soft hover:bg-brandDark">
              Save active menu mode
            </button>
          </form>

          <h2 className="mt-8 text-2xl font-black text-ink">Existing menu pages</h2>
          {!businesses ? (
            <p className="mt-5 leading-7 text-muted">Connect the database to see customer menu pages created from this admin form.</p>
          ) : businesses.length === 0 ? (
            <p className="mt-5 leading-7 text-muted">No database menu pages yet.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              {businesses.map((business) => (
                <Link key={business.slug} href={`/m/${business.slug}`} className="rounded-2xl border border-line bg-cream p-4 hover:border-brand">
                  <span className="font-black text-ink">{business.businessName}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {business.businessType} {business.city ? `in ${business.city}` : ""} - {business.itemCount} items - {business.isPublished ? "Published" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
