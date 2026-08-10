import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MenuPilotSubnav } from "@/components/MenuPilotSubnav";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Small Business Website & Customer Intake Examples | Resonate",
  description: "See how a mobile-friendly MenuPilot page brings a small business menu, hours, photos, ordering, calling, and directions together.",
  path: "/menupilot/examples"
});

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
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "MenuPilot", path: "/menupilot" }, { name: "Examples", path: "/menupilot/examples" }])} />
      <MenuPilotSubnav />
      <section className="section-glow-mint border-b border-line">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="eyebrow text-brand">MenuPilot example</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.98] text-ink md:text-7xl">
            One simple place for the information customers actually need.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            This live example brings the menu, current hours, location, ordering, photos, and business updates together in one mobile-friendly page.
          </p>
          <div className="mt-8">
            <Link href="/m/mellow-moose-burgers" className="btn-coral">
              Open the live menu example
            </Link>
          </div>
        </div>

        <div className="surface-card rise-in p-4">
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
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc22e]">The owner experience</p>
              <p className="mt-2 text-lg font-black">One dependable link is easier to share and easier for customers to use.</p>
            </div>
          </div>
        </div>
      </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {exampleFeatures.map((feature) => (
              <article key={feature.title} className="surface-card lift bg-cream p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">{feature.label}</p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-ink">{feature.title}</h2>
                <p className="mt-3 leading-7 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="eyebrow text-brand">When the business changes</p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
            You run the business. Managed Page helps keep the page current.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            You decide what changes. Resonate can update supplied hours, sellout notes, specials, menu details, links, and photos within the Managed Page scope.
          </p>
          <Link href="/portal" className="btn-ink mt-7">See how Managed Page works</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ownerControls.map((control) => (
            <div key={control} className="surface-card lift rounded-2xl p-4 font-black text-ink">
              {control}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
