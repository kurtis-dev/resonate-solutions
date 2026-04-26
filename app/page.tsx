import Link from "next/link";

const offerCards = [
  {
    title: "Mobile menu page",
    text: "A fast page with menu items, prices, photos, hours, location, specials, and the links customers ask for most."
  },
  {
    title: "Food and service photos",
    text: "Simple on-site photo sessions so the page shows what customers can actually order, buy, book, or visit."
  },
  {
    title: "QR code and link hub",
    text: "One clean QR and one memorable link for Google, Instagram, Facebook, counters, trucks, receipts, and signs."
  },
  {
    title: "Google profile tune-up",
    text: "A practical checklist for hours, menu links, service details, photos, review links, and missing public info."
  }
];

const customerQuestions = [
  "Where are you today?",
  "Are you open right now?",
  "What does the food look like?",
  "What is on the menu?",
  "How do I order?",
  "Can I trust this place?"
];

const serviceSteps = [
  ["Collect", "We gather menu items, hours, locations, links, photos, and the public details customers need."],
  ["Build", "We create a clean mobile page, QR path, and Google-ready public links that are easy to share."],
  ["Maintain", "We keep seasonal items, hours, specials, photos, and links updated through a simple monthly plan."]
];

const launchPackages = [
  {
    name: "Launch Kit",
    price: "$299 setup",
    text: "Best first offer for food trucks, pop-ups, coffee stands, and small restaurants.",
    features: ["Mobile menu page", "QR code", "Basic food photos", "Google review link", "One revision"]
  },
  {
    name: "Upkeep",
    price: "$49/mo",
    text: "For businesses that need small updates without logging into another platform.",
    features: ["Menu updates", "Hours and location updates", "Specials and sold-out notes", "Photo swaps"]
  },
  {
    name: "Managed Presence",
    price: "$149/mo",
    text: "For owners who want Resonate to keep the public-facing details from getting stale.",
    features: ["Monthly check-in", "Google profile checklist", "Fresh photos as needed", "Customer link cleanup"]
  }
];

export default function ResonateHome() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(15,159,143,0.32),transparent_34%),linear-gradient(135deg,rgba(245,184,75,0.16),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_0.9fr] md:py-28">
          <div className="self-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Resonate Solutions</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.96] text-white md:text-7xl">
              Make your local business easier to find, choose, and trust.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Resonate builds clean mobile menu and presence pages for food trucks, restaurants, coffee shops, service businesses, and local operators who need customers to find the right info fast.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/menupilot" className="min-h-12 rounded-lg bg-brand px-6 py-3 text-center font-bold text-white hover:bg-brandDark">
                See MenuPilot
              </Link>
              <Link href="/pricing" className="min-h-12 rounded-lg border border-white/25 px-6 py-3 text-center font-bold text-white hover:bg-white/10">
                View launch packages
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-soft backdrop-blur">
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-brand">Live customer page</p>
                  <h2 className="mt-2 text-3xl font-black text-ink">Ozark Street Kitchen</h2>
                  <p className="mt-1 text-sm text-muted">Open today, 11 AM to 2 PM, Bentonville Square</p>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">QR ready</span>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ["Smoked chicken bowl", "$12", "House rice, pickled onions, green sauce"],
                  ["Hot honey biscuit", "$7", "Crisp chicken, honey glaze, slaw"],
                  ["Seasonal lemonade", "$4", "Rotating fruit, fresh mint"]
                ].map(([item, price, note]) => (
                  <div key={item} className="rounded-lg border border-line bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black text-ink">{item}</span>
                      <span className="font-black text-brand">{price}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm font-bold">
                <span className="rounded-lg bg-ink px-3 py-3 text-white">Directions</span>
                <span className="rounded-lg bg-ink px-3 py-3 text-white">Order link</span>
                <span className="rounded-lg bg-brand px-3 py-3 text-white">Menu photos</span>
                <span className="rounded-lg bg-brand px-3 py-3 text-white">Review link</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">The real problem</p>
          <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
            Customers should not have to hunt through old posts to figure out if they want to visit.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            Google profiles, Facebook posts, Instagram bios, old PDF menus, and handwritten signs all drift out of sync. Resonate gives a business one simple customer-facing source of truth.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {customerQuestions.map((question) => (
            <div key={question} className="rounded-lg border border-line bg-white p-5 font-black text-ink shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-soft">
              {question}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">What we build</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              A small-business presence kit that feels practical from day one.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {offerCards.map((card) => (
              <article key={card.title} className="rounded-lg border border-line bg-slate-50 p-6 shadow-sm">
                <h3 className="text-xl font-black text-ink">{card.title}</h3>
                <p className="mt-3 leading-7 text-muted">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {serviceSteps.map(([title, text], index) => (
            <article key={title} className="rounded-lg border border-line bg-white p-7 shadow-sm">
              <span className="text-sm font-black text-brand">0{index + 1}</span>
              <h2 className="mt-4 text-3xl font-black text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Launch offer</p>
            <h2 className="mt-3 text-4xl font-black text-white md:text-5xl">
              Start with the businesses that need visibility, not another dashboard.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              The first sellable version can be service-led: you take photos, collect menu details, publish the page, create the QR code, and keep the info fresh.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {launchPackages.map((plan) => (
              <article key={plan.name} className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur">
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="mt-2 text-3xl font-black text-gold">{plan.price}</p>
                <p className="mt-4 leading-7 text-slate-300">{plan.text}</p>
                <ul className="mt-5 space-y-3 text-sm font-bold text-white">
                  {plan.features.map((feature) => (
                    <li key={feature} className="rounded-lg bg-white/10 px-4 py-3">{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
