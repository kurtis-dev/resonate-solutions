import Link from "next/link";
import { MenuPilotSubnav } from "@/components/MenuPilotSubnav";

const exampleFeatures = [
  {
    label: "Clear information",
    title: "Customers find the details they came for",
    text: "Put the menu, current hours, location, photos, and important updates together on one page that is easy to scan from a phone."
  },
  {
    label: "Clear next step",
    title: "Ordering and directions stay easy to reach",
    text: "Customers can move from browsing to ordering, calling, or getting directions without hunting through profiles and old links."
  },
  {
    label: "Useful after launch",
    title: "The page can keep up with the business",
    text: "Hours, closing notes, sold-out alerts, specials, menu details, and new photos can be updated as the business changes."
  }
];

const ownerControls = [
  "Update hours for the week",
  "Post closing early or sold-out notes",
  "Feature daily specials",
  "Update menu items and prices",
  "Keep ordering and location links current",
  "Swap food photos",
  "Keep the same QR code"
];

export default function MenuPilotExamplesPage() {
  return (
    <main className="bg-cream">
      <MenuPilotSubnav />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Business page examples</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.98] text-ink md:text-7xl">
            Give customers one clear place to get what they need.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            This live example brings the menu, current hours, location, ordering, photos, and business updates together in one mobile-friendly page.
          </p>
          <div className="mt-8">
            <Link href="/m/mellow-moose-burgers" className="rounded-full bg-brand px-6 py-3 text-center font-black text-white shadow-soft hover:bg-brandDark">
              Open the live menu example
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-line bg-white p-4 shadow-soft">
          <div className="rounded-[1.25rem] bg-[#f8f0e5] p-5">
            <div className="overflow-hidden rounded-2xl border border-[#dfd2c3] bg-white">
              <img src="/assets/mellow-moose-og-smashburger.jpg" alt="Burger featured on a MenuPilot customer page" className="h-72 w-full object-cover sm:h-80" />
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff6422]">Live MenuPilot example</p>
                <h2 className="mt-2 text-3xl font-black text-[#21140d]">Mellow Moose Burgers</h2>
                <p className="mt-2 leading-7 text-[#68513f]">Customers can see the food, check current hours, order, call, or get directions from one page.</p>
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Customer actions shown in the example">
                  {['Menu', 'Hours', 'Order', 'Directions'].map((action) => (
                    <span key={action} className="rounded-full bg-[#fff4df] px-3 py-2 text-xs font-black text-[#3a2418]">{action}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#3a2418] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc22e]">Why this matters</p>
              <p className="mt-2 text-lg font-black">One dependable link is easier to share and easier for customers to use.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {exampleFeatures.map((feature) => (
              <article key={feature.title} className="rounded-[1.35rem] border border-line bg-cream p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">{feature.label}</p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-ink">{feature.title}</h2>
                <p className="mt-3 leading-7 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Behind the menu</p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
            Monthly care keeps the page useful after launch.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            A static menu is easy to forget. A managed business page stays useful because hours, sellouts, specials, menu details, links, and photos can be kept current.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ownerControls.map((control) => (
            <div key={control} className="rounded-2xl border border-line bg-white p-4 font-black text-ink shadow-sm">
              {control}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
