import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excellent Pins & Badges Example Library",
  description:
    "Browse custom pin, medal, coin, badge, keychain, and metal emblem examples before starting an Excellent Pins quote.",
  openGraph: {
    title: "Excellent Pins & Badges Example Library",
    description:
      "Browse custom pin, medal, coin, badge, keychain, and metal emblem examples before starting a quote.",
    images: ["/assets/excellent-pins/excellent-pins-logo-mark.png"],
  },
};

const librarySections = [
  {
    id: "lapel-pins",
    eyebrow: "Pins",
    title: "Lapel pin starting points",
    intro:
      "Use these examples to choose a general direction. Excellent Pins can recommend the exact style after seeing your artwork.",
    items: [
      {
        title: "Soft enamel pin",
        text: "Color-filled areas with raised metal outlines.",
        image: "/assets/excellent-pins/lovable/pin-soft-enamel.jpg",
      },
      {
        title: "Hard enamel pin",
        text: "Smooth polished color with a cleaner, jewelry-like surface.",
        image: "/assets/excellent-pins/lovable/pin-hard-enamel.jpg",
      },
      {
        title: "Die struck pin",
        text: "Metal-only detail for a classic raised-and-recessed look.",
        image: "/assets/excellent-pins/lovable/pin-die-struck.jpg",
      },
      {
        title: "Printed pin",
        text: "Full-color artwork for gradients, small details, and photo-like designs.",
        image: "/assets/excellent-pins/lovable-page/printed-pin.png",
      },
    ],
  },
  {
    id: "awards",
    eyebrow: "Awards & keepsakes",
    title: "Medals, coins, and recognition pieces",
    intro:
      "For events, service awards, clubs, ceremonies, and keepsakes that should feel substantial.",
    items: [
      {
        title: "Medal",
        text: "Award or recognition piece, often paired with a ribbon.",
        image: "/assets/excellent-pins/lovable-page/medal.png",
      },
      {
        title: "Novelty coin",
        text: "Heavier keepsake-style metal piece for commemorative work.",
        image: "/assets/excellent-pins/lovable-page/novelty-coin.png",
      },
      {
        title: "Event emblem",
        text: "Custom shape or design for clubs, campaigns, and gatherings.",
        image: "/assets/excellent-pins/lovable/pin-event.jpg",
      },
    ],
  },
  {
    id: "badges-more",
    eyebrow: "More formats",
    title: "Badges, keychains, and other metal emblems",
    intro:
      "If the item is not meant to be worn as a standard pin, start here and describe the finished piece you have in mind.",
    items: [
      {
        title: "Badge or nameplate",
        text: "Flat or shaped pieces for names, teams, staff roles, and organizations.",
        image: "/assets/excellent-pins/lovable-page/badge-nameplate.png",
      },
      {
        title: "Keychain",
        text: "Custom metal artwork made to carry, sell, or hand out.",
        image: "/assets/excellent-pins/lovable-page/keychain.png",
      },
      {
        title: "Other metal emblem",
        text: "Ornaments, cufflinks, tags, charms, plaques, and unusual custom ideas.",
        image: "/assets/excellent-pins/lovable/pin-badge.jpg",
      },
    ],
  },
];

const jumpLinks = [
  { label: "Pins", href: "#lapel-pins" },
  { label: "Awards", href: "#awards" },
  { label: "More formats", href: "#badges-more" },
  { label: "Start quote", href: "/excellent-pins#quote" },
];

export default function ExcellentPinsLibraryPage() {
  return (
    <main className="excellent-pins-page min-h-screen bg-[#f4efe7] text-[#15110d]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800;900&family=Oswald:wght@400;500;600;700&display=swap');
        .excellent-pins-page { font-family: 'Oswald', Arial, sans-serif; }
        .excellent-pins-display { font-family: 'League Spartan', Arial Black, sans-serif; }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#c8d4e3] bg-[#f8f2e9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a href="/excellent-pins#top" className="flex items-center gap-3">
            <span className="flex h-14 w-28 items-center justify-center overflow-hidden rounded-[14px] border border-[#c8d4e3] bg-[#fffaf3] shadow-[0_12px_30px_rgba(23,56,102,0.12)]">
              <img
                src="/assets/excellent-pins/excellent-pins-logo-mark.png"
                alt="Excellent Pins & Badges"
                className="h-full w-full object-contain p-1.5 drop-shadow-[0_5px_8px_rgba(21,17,13,0.18)]"
              />
            </span>
            <span>
              <span className="excellent-pins-display block text-xl font-black leading-none tracking-tight text-[#15110d]">
                Excellent Pins & Badges
              </span>
              <span className="block text-[11px] font-black uppercase tracking-[0.28em] text-[#173866]">
                Custom metal emblems
              </span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-black text-[#173866]">
            <a className="rounded-full px-3 py-2 hover:bg-[#eef5fb]" href="/excellent-pins#options">
              Pin options
            </a>
            <a className="rounded-full px-3 py-2 hover:bg-[#eef5fb]" href="/excellent-pins#customization">
              Details
            </a>
            <a className="rounded-full bg-[#eef5fb] px-3 py-2 text-[#173866]" href="/excellent-pins/library">
              Library
            </a>
            <a className="rounded-full px-3 py-2 hover:bg-[#eef5fb]" href="/excellent-pins#process">
              How it works
            </a>
            <a className="rounded-full bg-[#c92f2f] px-5 py-3 text-white shadow-[0_14px_34px_rgba(201,47,47,0.24)]" href="/excellent-pins#quote">
              Start a quote
            </a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#c8d4e3]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(47,157,146,0.14),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(216,168,61,0.32),transparent_30%),linear-gradient(135deg,#f8f2e9_0%,#eef5fb_56%,#f8ecd5_100%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-18">
          <p className="mb-5 text-[12px] font-black uppercase tracking-[0.34em] text-[#173866]">
            Example library
          </p>
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <h1 className="excellent-pins-display max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-[#15110d] sm:text-6xl lg:text-7xl">
                Browse ideas before starting your quote.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4b5e73]">
                These examples are starting points, not fixed templates. Choose
                the closest style, send your artwork or idea, and Excellent Pins
                can recommend the best way to make it.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#c8d4e3] bg-[#fffaf3] p-5 shadow-[0_24px_70px_rgba(23,56,102,0.12)]">
              <div className="grid gap-3 sm:grid-cols-2">
                {jumpLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex min-h-12 items-center justify-center rounded-full border border-[#c8d4e3] bg-[#f8f2e9] px-5 text-center text-xs font-black uppercase tracking-[0.18em] text-[#173866] transition hover:-translate-y-0.5 hover:border-[#173866] hover:bg-[#eef5fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173866] focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="space-y-12">
          {librarySections.map((section, sectionIndex) => {
            const leftItems = section.items.slice(0, Math.ceil(section.items.length / 2));
            const rightItems = section.items.slice(Math.ceil(section.items.length / 2));

            return (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="mb-6 grid gap-4 lg:grid-cols-[0.72fr_1fr] lg:items-end">
                  <div>
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#c92f2f]">
                      {section.eyebrow}
                    </p>
                    <h2 className="excellent-pins-display text-4xl font-black leading-tight sm:text-5xl">
                      {section.title}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-base leading-7 text-[#4b5e73] lg:justify-self-end">
                    {section.intro}
                  </p>
                </div>

                <article className="relative overflow-hidden rounded-[24px] border border-[#c8d4e3] bg-[#fffaf3] shadow-[0_24px_70px_rgba(23,56,102,0.10)]">
                  <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px bg-[#d8c9b6] lg:block" />
                  <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(21,17,13,0.08),transparent)] lg:block" />

                  <div className="grid lg:grid-cols-2">
                    {[leftItems, rightItems.length ? rightItems : []].map((pageItems, pageIndex) => (
                      <div
                        key={`${section.id}-${pageIndex}`}
                        className={`min-h-[420px] bg-[#fffaf3] p-5 sm:p-6 ${
                          pageIndex === 0 ? "lg:pr-8" : "border-t border-[#e3d7c8] lg:border-t-0 lg:pl-8"
                        }`}
                      >
                        <div className="mb-5 flex items-center justify-between border-b border-[#e3d7c8] pb-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#173866]">
                            Excellent Pins library
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9b6d29]">
                            {String(sectionIndex + 1).padStart(2, "0")}.{pageIndex + 1}
                          </span>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          {pageItems.map((item) => (
                            <a
                              key={item.title}
                              href="/excellent-pins#quote"
                              className="group block overflow-hidden rounded-[10px] border border-[#c8d4e3] bg-[#f8f2e9] transition hover:-translate-y-1 hover:border-[#173866] hover:shadow-[0_18px_45px_rgba(23,56,102,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173866] focus-visible:ring-offset-2"
                            >
                              <div className="overflow-hidden bg-[#f7f0e6]">
                                <img
                                  src={item.image}
                                  alt={`${item.title} example`}
                                  className="aspect-[1.18/1] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="excellent-pins-display text-2xl font-black leading-tight text-[#15110d]">
                                  {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-[#4b5e73]">
                                  {item.text}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            );
          })}
        </div>

        <section className="mt-14 rounded-[24px] border border-[#c8d4e3] bg-[#102847] p-6 text-[#fffaf3] shadow-[0_24px_70px_rgba(23,56,102,0.14)] sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#d7a83d]">
              Ready to start?
            </p>
            <h2 className="excellent-pins-display text-4xl font-black leading-tight">
              Send the idea. Excellent Pins will help shape the quote.
            </h2>
          </div>
          <a
            href="/excellent-pins#quote"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#c92f2f] px-7 text-sm font-black text-white shadow-[0_18px_45px_rgba(201,47,47,0.24)] lg:mt-0"
          >
            Start a custom quote
          </a>
        </section>
      </div>
    </main>
  );
}
