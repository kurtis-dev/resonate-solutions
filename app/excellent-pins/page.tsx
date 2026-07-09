import type { Metadata } from "next";
import { ExcellentPinsQuoteFlow } from "@/app/excellent-pins/QuoteFlow";
import { productStyles } from "@/app/excellent-pins/productStyles";

export const metadata: Metadata = {
  title: "Excellent Pins & Badges Custom Quotes",
  description:
    "Custom pins, badges, medals, coins, and metal emblems quoted from your artwork and project details.",
  openGraph: {
    title: "Excellent Pins & Badges Custom Quotes",
    description:
      "Custom pins, badges, medals, coins, and metal emblems quoted from your artwork and project details.",
    images: ["/assets/excellent-pins/excellent-pins-logo-mark.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Excellent Pins & Badges Custom Quotes",
    description:
      "Custom pins, badges, medals, coins, and metal emblems quoted from your artwork and project details.",
    images: ["/assets/excellent-pins/excellent-pins-logo-mark.png"],
  },
};

const processSteps = [
  {
    title: "Tell us what you need",
    text: "Choose the closest product type, upload artwork if you have it, and describe the result you want.",
  },
  {
    title: "We review the details",
    text: "Excellent Pins checks the artwork, quantity, size, finish, backing, packaging, and timeline.",
  },
  {
    title: "You get a practical quote",
    text: "We reply with pricing, production options, and the next details needed before an order moves forward.",
  },
];

const customizationChoices = [
  {
    title: "Metal finish",
    text: "Common directions include gold-tone, nickel/silver-tone, black nickel, antique brass, antique silver, and copper-tone finishes. Exact finish names are confirmed during quoting.",
  },
  {
    title: "Color & enamel",
    text: "Soft enamel fills, hard enamel polish, screen-print color matching.",
  },
  {
    title: "Size & shape",
    text: "Round, oval, rectangle, or cut to your custom silhouette.",
  },
  {
    title: "Backing",
    text: "Butterfly clutch, rubber, deluxe locking, magnet, safety pin.",
  },
  {
    title: "Packaging",
    text: "Poly bag, header card, velvet pouch, custom branded card.",
  },
  {
    title: "Quantity",
    text: "From small staff runs to large event giveaways.",
  },
  {
    title: "Artwork detail",
    text: "Line weight and color count affect what is producible.",
  },
  {
    title: "Timeline",
    text: "Event dates, rush needs, and approval timing help shape the quote.",
  },
];

export default function ExcellentPinsPage() {
  return (
    <main className="excellent-pins-page min-h-screen bg-[#f4efe7] text-[#15110d]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700;800;900&family=Oswald:wght@400;500;600;700&display=swap');
        .excellent-pins-page { font-family: 'Oswald', Arial, sans-serif; }
        .excellent-pins-display { font-family: 'League Spartan', Arial Black, sans-serif; }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#c8d4e3] bg-[#f8f2e9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a href="#top" className="flex items-center gap-3">
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
            <a className="rounded-full px-3 py-2 hover:bg-[#eef5fb]" href="#options">
              Pin options
            </a>
            <a className="rounded-full px-3 py-2 hover:bg-[#eef5fb]" href="#customization">
              Details
            </a>
            <a className="rounded-full px-3 py-2 hover:bg-[#eef5fb]" href="#process">
              How it works
            </a>
            <a className="rounded-full bg-[#c92f2f] px-5 py-3 text-white shadow-[0_14px_34px_rgba(201,47,47,0.24)]" href="#quote">
              Start a quote
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden border-b border-[#c8d4e3]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(216,168,61,0.34),transparent_26%),radial-gradient(circle_at_16%_86%,rgba(47,157,146,0.15),transparent_32%),linear-gradient(135deg,#f8f2e9_0%,#eef5fb_52%,#f8ecd5_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-[12px] font-black uppercase tracking-[0.34em] text-[#173866]">
              Pins, medals, coins, badges, and more
            </p>
            <h1 className="excellent-pins-display max-w-3xl text-5xl font-black leading-[0.92] tracking-tight text-[#15110d] sm:text-6xl lg:text-7xl">
              Custom metal pieces made from your artwork.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4b5e73]">
              Tell Excellent Pins what you want made. Upload artwork if you have
              it, choose the closest product type, and get a quote based on
              your personalized request.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="inline-flex items-center justify-center rounded-full bg-[#c92f2f] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(201,47,47,0.24)]"
              >
                Start a custom quote
              </a>
              <a
                href="#options"
                className="inline-flex items-center justify-center rounded-full border border-[#c8d4e3] bg-[#fffaf3] px-7 py-4 text-sm font-black text-[#173866] shadow-[0_14px_36px_rgba(23,56,102,0.08)]"
              >
                See product options
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[34px] bg-[#d7a83d]/20 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[30px] border border-[#c8d4e3] bg-[#fffaf3] p-3 shadow-[0_32px_85px_rgba(23,56,102,0.14)]">
              <img
                src="/assets/excellent-pins/excellent-pins-logo-mark.png"
                alt="Excellent Pins & Badges custom metal emblem example"
                className="min-h-[360px] w-full rounded-[22px] bg-[#fffaf3] object-contain p-8 drop-shadow-[0_18px_28px_rgba(21,17,13,0.22)] sm:p-10"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {["Artwork", "Options", "Quote"].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-[16px] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] ${
                      index === 0
                        ? "bg-[#173866] text-white"
                        : index === 1
                          ? "bg-[#d7a83d] text-[#15110d]"
                          : "bg-[#c92f2f] text-white"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="options" className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-4 text-[12px] font-black uppercase tracking-[0.34em] text-[#173866]">
              Product starting points
            </p>
            <h2 className="excellent-pins-display text-4xl font-black leading-tight sm:text-5xl">
              Choose the closest format. We will help shape the exact build.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#4b5e73]">
              These are not fixed-price menu items. They are the main quote
              paths customers can recognize before Excellent Pins reviews the
              artwork, quantity, finish, and production details.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productStyles.map((style) => (
              <article
                key={style.name}
                className="flex min-h-full flex-col overflow-hidden rounded-[10px] border border-[#c8d4e3] bg-[#fffaf3] shadow-[0_12px_32px_rgba(23,56,102,0.08)]"
              >
                <div className="relative overflow-hidden bg-[#f7f0e6]">
                  <img
                    src={style.image}
                    alt={`${style.cardTitle || style.name} sample`}
                    className={`aspect-[1.25/1] w-full ${
                      style.imageFit === "contain" ? "object-contain p-7" : "object-cover"
                    }`}
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="excellent-pins-display text-2xl font-black leading-tight text-[#15110d]">
                    {style.cardTitle || style.name}
                  </h3>
                  <p className="mt-3 text-base leading-6 text-[#4b5e73]">
                    {style.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="customization" className="bg-[#f8f2e9] px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.05fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#c8d4e3] bg-[#eef5fb] px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#173866]">
              Customization choices
            </p>
            <h2 className="excellent-pins-display text-5xl font-black leading-[0.96] text-[#15110d] sm:text-6xl">
              Built to your spec, one decision at a time.
            </h2>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#4b5e73]">
              Excellent Pins will guide you through the options that matter for
              your project.
            </p>
            <div className="mt-8 overflow-hidden rounded-[10px] bg-[#eef5fb] shadow-[0_14px_40px_rgba(23,56,102,0.12)]">
              <img
                src="/assets/excellent-pins/lovable/finishes.jpg"
                alt="Metal finish sample discs"
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="grid overflow-hidden rounded-[10px] border border-[#c8d4e3] bg-[#fffaf3] shadow-[0_18px_50px_rgba(23,56,102,0.08)] sm:grid-cols-2">
            {customizationChoices.map((choice) => (
              <div key={choice.title} className="min-h-[176px] border-b border-[#c8d4e3] p-6 odd:sm:border-r">
                <h3 className="excellent-pins-display text-xl font-black text-[#15110d]">
                  {choice.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#4b5e73]">
                  {choice.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-y border-[#173866] bg-[#102847] text-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="mb-4 text-[12px] font-black uppercase tracking-[0.3em] text-[#d7a83d]">
              How it works
            </p>
            <h2 className="excellent-pins-display text-4xl font-black leading-tight sm:text-5xl">
              Send the right details without needing to know every production term.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-[10px] border border-[#31527a] bg-[#173866] p-6 shadow-[0_18px_45px_rgba(9,29,55,0.22)]">
                <span className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c92f2f] text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="excellent-pins-display text-2xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#e7eef8]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="bg-[linear-gradient(135deg,#f8f2e9_0%,#eef5fb_100%)] px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ExcellentPinsQuoteFlow />
        </div>
      </section>
    </main>
  );
}
