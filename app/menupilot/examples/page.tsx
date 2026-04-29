import Link from "next/link";

const exampleFeatures = [
  {
    label: "Customer-facing menu",
    title: "The restaurant page stays clean",
    text: "Mellow Moose customers see food, hours, location, ordering, QR sharing, and current specials. They should not see Resonate sales copy."
  },
  {
    label: "Event mode",
    title: "One page can shift for a popup",
    text: "Dos Gordos takeover mode changes the hero, featured items, menu sections, and event messaging without creating a confusing second website."
  },
  {
    label: "Owner controls",
    title: "The business can change the day",
    text: "Hours, closed notes, sold-out alerts, Happy Hour, Fry Day, combos, and popup mode are the kinds of controls that make the page useful after launch."
  }
];

const ownerControls = [
  "Turn popup mode on or off",
  "Update hours for the week",
  "Post closing early or sold-out notes",
  "Feature daily specials",
  "Flag changed location",
  "Swap food photos",
  "Keep the same QR code"
];

export default function MenuPilotExamplesPage() {
  return (
    <main className="bg-cream">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">MenuPilot examples</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.98] text-ink md:text-7xl">
            Show what changes without cluttering the customer menu.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            This page is for Resonate customers. It explains the system behind a real menu page: branded public menu, event takeover mode, owner controls, and daily updates.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/m/mellow-moose-burgers" className="rounded-full bg-brand px-6 py-3 text-center font-black text-white shadow-soft hover:bg-brandDark">
              View customer menu
            </Link>
            <Link href="/m/mellow-moose-burgers?menu=dos-gordos" className="rounded-full border border-line bg-white px-6 py-3 text-center font-black text-ink hover:border-brand">
              View takeover mode
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-line bg-white p-4 shadow-soft">
          <div className="rounded-[1.25rem] bg-[#f8f0e5] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-[#dfd2c3] bg-white">
                <img src="/assets/mellow-moose-og-smashburger.jpg" alt="Mellow Moose burger menu example" className="h-56 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff6422]">Normal mode</p>
                  <h2 className="mt-2 text-2xl font-black text-[#21140d]">Mellow Moose Burgers</h2>
                  <p className="mt-2 text-sm leading-6 text-[#68513f]">The public page feels like the business, not like a generic hosted menu.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#dfd2c3] bg-white">
                <img src="/assets/dos-gordos-birria-tacos.jpg" alt="Dos Gordos takeover example" className="h-56 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2f9c96]">Popup mode</p>
                  <h2 className="mt-2 text-2xl font-black text-[#21140d]">Dos Gordos Takeover</h2>
                  <p className="mt-2 text-sm leading-6 text-[#68513f]">The same customer path can shift for a special menu without losing clarity.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#3a2418] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc22e]">What this proves</p>
              <p className="mt-2 text-lg font-black">The page can match the day, the menu, and the business without reprinting QR codes.</p>
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
            This is the part the owner pays for.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            A static menu is easy to forget. MenuPilot is useful because the public page can respond to real operations: weather, sellouts, hours, popups, specials, and new photos.
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
