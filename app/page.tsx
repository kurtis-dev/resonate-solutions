import Link from "next/link";

const offerCards = [
  {
    title: "Custom menu page",
    text: "A mobile-first menu shaped around the business's logo, colors, photos, item notes, prices, hours, and order links."
  },
  {
    title: "Real food and product photos",
    text: "Useful, current images that help customers choose without scrolling old posts or guessing from a blurry upload."
  },
  {
    title: "QR code that stays useful",
    text: "One link for signs, trucks, counters, receipts, and profiles. Update the page without reprinting."
  },
  {
    title: "Live updates",
    text: "Hours, location, specials, sold-out items, popup menus, and seasonal changes can stay current."
  },
  {
    title: "Customer path cleanup",
    text: "A practical Mic Check for the links and details people need before they visit, order, call, or leave a review."
  }
];

const customSignals = [
  ["Logo and colors", "Use the marks, colors, and tone customers already associate with the business."],
  ["Menu personality", "Feature local favorites, owner picks, item notes, sold-out updates, and the way the menu is actually talked about."],
  ["Real photos", "Swap generic placeholders for crisp item photos, truck photos, counter photos, or product shots."],
  ["Customer actions", "Shape the page around what matters most: directions, ordering, reviews, calls, questions, or social links."]
];

const customerQuestions = [
  "Where are you today?",
  "Are you open right now?",
  "What should I order?",
  "What does it look like?",
  "How do I get there?",
  "Can I trust this place?"
];

const customerMenuPreview = [
  {
    item: "The OG Smashburger",
    detail: "Grilled onions, American cheese, burger sauce, and pickles",
    price: "$9.99",
    note: "Local favorite",
    image: "/assets/mellow-moose-og-smashburger.jpg"
  },
  {
    item: "Blazing Moose Fries",
    detail: "Nacho cheese, grilled peppers, beef patty, bacon, Smokeshow sauce, and ranch",
    price: "$13.99",
    note: "Best seller",
    image: "/assets/mellow-moose-blazing-fries.jpg"
  },
  {
    item: "Hearty Shroom and Cheese Burger",
    detail: "Cheese, mushroom brown gravy, and mayonnaise on a toasted bun",
    price: "$11.99",
    note: "Mellow pick",
    image: "/assets/mellow-moose-hearty-shroom.jpg"
  }
];

const serviceSteps = [
  ["Mic Check", "We find the missing notes in the customer path: menu, hours, location, photos, links, and Google details."],
  ["Tune", "We build the mobile page, QR path, menu layout, public links, and Google-ready details."],
  ["Keep tempo", "We keep seasonal items, hours, specials, photos, and links from quietly going stale."]
];

const monthlyPlans = [
  {
    name: "Mic Check",
    price: "Free",
    text: "A quick fit check before anyone pays: what is missing, what customers cannot find, and which monthly plan makes sense.",
    features: ["Menu and link review", "Google profile notes", "Photo gaps", "Low/high plan recommendation"]
  },
  {
    name: "MenuPilot Core",
    price: "$49/mo",
    text: "For owners who need one polished menu page, a QR code, and a small number of monthly edits.",
    features: ["Custom menu page", "QR code", "Order/call/directions links", "2 updates per month"]
  },
  {
    name: "MenuPilot Managed",
    price: "$149/mo",
    text: "For businesses that change specials, photos, popups, hours, or locations and want more hands-on help.",
    features: ["Everything in Core", "8 updates per month", "Popup menu switching", "Monthly customer-path check"]
  }
];

export default function ResonateHome() {
  return (
    <main>
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#4d8b72,#e8a93a,#d97856)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1fr] md:py-24">
          <div className="self-center">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] text-ink md:text-7xl">
              MenuPilot makes your menu easier to find, trust, and order from.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Practical polish for food trucks, pop-ups, and local restaurants that do not need a giant website or another generic menu clone.
            </p>
            <div className="mt-8">
              <Link href="/menupilot" className="min-h-12 rounded-full bg-brand px-6 py-3 text-center font-bold text-white shadow-soft hover:bg-brandDark">
                See MenuPilot
              </Link>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-6 text-muted">
              A custom menu page, QR code, ordering link, hours, location, and useful photos, all tuned to feel like the business.
            </p>
          </div>

          <div className="rounded-[0.9rem] border border-[#d7c1a1] bg-[#fffaf0] p-3 shadow-[0_24px_70px_rgba(47,31,16,.14)]">
            <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[0.75rem] bg-[#f06f23] p-3">
                <div className="overflow-hidden rounded-[0.65rem] bg-white shadow-sm">
                  <img src="/assets/mellow-moose-og-smashburger.jpg" alt="Mellow Moose smash burger" className="aspect-[4/5] w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8d3709]">Real customer example</p>
                    <div className="mt-3 rounded-full bg-[#fff0cf] px-4 py-2 text-sm font-black text-ink">Mellow Moose Burgers</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[0.75rem] bg-white p-5">
                <div className="border-b border-line pb-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8d3709]">MenuPilot example</p>
                  <h2 className="mt-2 text-3xl font-black text-ink">Mellow Moose Burgers</h2>
                  <p className="mt-1 text-sm text-muted">Griffin&apos;s Food Court, Siloam Springs</p>
                </div>
                <div className="mt-5 grid gap-3">
                  {customerMenuPreview.map((menuItem) => (
                    <div key={menuItem.item} className="rounded-2xl border border-line bg-white p-4">
                      <div className="flex items-start gap-3">
                        <img src={menuItem.image} alt={menuItem.item} className="h-16 w-16 rounded-xl object-cover" />
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-black text-ink">{menuItem.item}</span>
                            <span className="font-black text-coral">{menuItem.price}</span>
                          </div>
                          <p className="mt-1 text-sm leading-5 text-muted">{menuItem.detail}</p>
                        </div>
                      </div>
                      <span className="mt-3 inline-flex rounded-full bg-sage px-3 py-1 text-xs font-black text-brandDark">{menuItem.note}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm font-bold">
                  <span className="rounded-full bg-ink px-3 py-3 text-white">Directions</span>
                  <span className="rounded-full bg-[#f06f23] px-3 py-3 text-white">Order on Clover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-4xl font-black text-ink md:text-5xl">
              Practical polish for businesses that do not need a giant website or a generic menu clone.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              MenuPilot starts with the daily details customers actually need, then makes them look current, useful, and specific to the business.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {offerCards.map((card) => (
              <article key={card.title} className="rounded-[0.9rem] border border-line bg-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <h3 className="text-xl font-black text-ink">{card.title}</h3>
                <p className="mt-3 leading-7 text-muted">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Your menu should feel like your place, not a listing template.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Logos, colors, photos, best sellers, popup menus, and customer actions shape the page so the menu feels unmistakably theirs.
            </p>
          </div>
          <div className="rounded-[0.9rem] border border-[#d7c1a1] bg-white p-4 shadow-soft">
            <div className="rounded-[0.75rem] bg-[#fff4df] p-5">
              <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="mt-2 text-3xl font-black text-ink">Mellow Moose Burgers</h3>
                  <p className="mt-1 text-sm text-muted">Griffin&apos;s Food Court in Siloam Springs</p>
                </div>
                <div className="rounded-xl bg-ink px-4 py-3 text-center text-sm font-black text-white">QR-ready</div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
                <img src="/assets/mellow-moose-food-truck.jpg" alt="Mellow Moose Burgers food truck" className="h-full min-h-64 rounded-2xl border border-line object-cover" />
                <div className="grid gap-3">
                  {customSignals.map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-line bg-white p-4">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-brand">{label}</p>
                      <p className="mt-1 font-bold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm font-bold sm:grid-cols-4">
                {["Directions", "Order", "Instagram", "Reviews"].map((action) => (
                  <span key={action} className="rounded-full border border-line bg-white px-3 py-3 text-ink">Example: {action}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">The everyday problem</p>
          <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
            People decide fast. Missing details make them move on.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            A customer should not have to scroll old posts, zoom into a blurry menu photo, or guess whether the business is open. Resonate keeps the basics easy to find and easy to trust.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {customerQuestions.map((question) => (
            <div key={question} className="rounded-2xl border border-line bg-white p-5 font-black text-ink shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-soft">
              {question}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {serviceSteps.map(([title, text], index) => (
            <article key={title} className="relative border-l-4 border-ink bg-white px-7 py-8 shadow-[8px_8px_0_rgba(32,35,32,.08)]">
              <span className="absolute -left-[1.15rem] top-8 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-sm font-black text-white">{index + 1}</span>
              <h2 className="text-3xl font-black text-ink">{title}</h2>
              <p className="mt-3 text-base leading-7 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-sage">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brandDark">Monthly service</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Keep the offer simple: low monthly or high monthly.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Core is for businesses that need the menu page and light edits. Managed is for owners who want Resonate keeping the public details fresh when specials, hours, locations, photos, or popup menus change.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {monthlyPlans.map((plan) => (
              <article key={plan.name} className="rounded-2xl border border-white/70 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-black text-ink">{plan.name}</h3>
                <p className="mt-2 text-3xl font-black text-brandDark">{plan.price}</p>
                <p className="mt-4 leading-7 text-muted">{plan.text}</p>
                <ul className="mt-5 space-y-3 text-sm font-bold text-ink">
                  {plan.features.map((feature) => (
                    <li key={feature} className="rounded-full bg-cream px-4 py-3">{feature}</li>
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
