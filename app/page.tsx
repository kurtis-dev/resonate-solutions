import Link from "next/link";

const offerCards = [
  {
    title: "A menu people can find",
    text: "One clean phone-friendly signal for menu items, prices, photos, hours, location, specials, and order links."
  },
  {
    title: "Photos that help people choose",
    text: "Simple on-site photo sessions so customers can see the food, service, space, or product before they decide."
  },
  {
    title: "A QR code that stays useful",
    text: "Put one QR code on the truck, counter, sign, receipt, or social profile and update the page without reprinting."
  },
  {
    title: "Google-ready public details",
    text: "A practical Soundcheck for hours, menu links, photos, review links, services, and missing customer info."
  }
];

const customerQuestions = [
  "Where are you today?",
  "Are you open right now?",
  "What should I order?",
  "What does it look like?",
  "How do I get there?",
  "Can I trust this place?"
];

const serviceSteps = [
  ["Soundcheck", "We listen for the missing notes in the customer path: menu, hours, location, photos, links, and Google details."],
  ["Tune", "We build the mobile page, QR path, menu layout, public links, and Google-ready details."],
  ["Keep tempo", "We keep seasonal items, hours, specials, photos, and links from quietly going stale."]
];

const launchPackages = [
  {
    name: "Launch Kit",
    price: "$299 setup",
    text: "A friendly first package for food trucks, pop-ups, coffee stands, salons, and local shops.",
    features: ["Mobile page", "QR code", "Basic photos", "Google review link", "One revision"]
  },
  {
    name: "Upkeep",
    price: "$49/mo",
    text: "For businesses that change hours, specials, locations, or menu items more than they expected.",
    features: ["Menu updates", "Hours and location updates", "Specials and sold-out notes", "Photo swaps"]
  },
  {
    name: "Managed Presence",
    price: "$149/mo",
    text: "For owners who want a real person keeping the public details polished in the background.",
    features: ["Monthly check-in", "Google profile checklist", "Fresh photo support", "Customer link cleanup"]
  }
];

export default function ResonateHome() {
  return (
    <main>
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#4d8b72,#e8a93a,#d97856)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1fr_0.86fr] md:py-24">
          <div className="self-center">
            <p className="inline-flex rounded-full bg-sage px-4 py-2 text-sm font-bold text-brandDark">Resonate Solutions</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] text-ink md:text-7xl">
              Make your local business easier to find, choose, and trust.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Resonate helps local businesses turn scattered menus, links, hours, photos, and Google details into one polished customer path that feels easy on a phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/menupilot" className="min-h-12 rounded-full bg-brand px-6 py-3 text-center font-bold text-white shadow-soft hover:bg-brandDark">
                See MenuPilot
              </Link>
              <Link href="/pricing" className="min-h-12 rounded-full border border-line bg-white px-6 py-3 text-center font-bold text-ink hover:border-brand">
                View launch packages
              </Link>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-6 text-muted">
              Built for the kind of owner who is great at the actual work and tired of customers asking where the current menu, location, or booking link is hiding.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-line bg-white p-4 shadow-soft">
            <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[1.25rem] bg-sage p-4">
                <div className="aspect-[4/5] rounded-[1rem] bg-[linear-gradient(145deg,#d97856,#e8a93a_55%,#4d8b72)] p-4 text-white">
                  <p className="text-sm font-bold">Photo day</p>
                  <div className="mt-28 rounded-full bg-white/85 px-4 py-2 text-sm font-black text-ink">fresh menu photos</div>
                </div>
              </div>
              <div className="rounded-[1.25rem] bg-cream p-5">
                <div className="border-b border-line pb-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-brand">Clear signal</p>
                  <h2 className="mt-2 text-3xl font-black text-ink">Ozark Street Kitchen</h2>
                  <p className="mt-1 text-sm text-muted">Open today, 11 AM to 2 PM, Bentonville Square</p>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    ["Smoked chicken bowl", "$12"],
                    ["Hot honey biscuit", "$7"],
                    ["Seasonal lemonade", "$4"]
                  ].map(([item, price]) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
                      <span className="font-black text-ink">{item}</span>
                      <span className="font-black text-coral">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 text-center text-sm font-bold">
                  <span className="rounded-full bg-ink px-3 py-3 text-white">Directions</span>
                  <span className="rounded-full bg-brand px-3 py-3 text-white">Order link</span>
                </div>
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

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">What we build</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Practical polish for businesses that do not need a giant website.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {offerCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-line bg-cream p-6 shadow-sm">
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
            <article key={title} className="rounded-2xl border border-line bg-white p-7 shadow-sm">
              <span className="text-sm font-black text-coral">0{index + 1}</span>
              <h2 className="mt-4 text-3xl font-black text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-sage">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brandDark">Launch offer</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Start with helpful service. Let the software grow from the work people actually buy.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              The first version can feel personal: you show up, take photos, organize the details, tune the public signal, and leave the owner with a link customers can actually use.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {launchPackages.map((plan) => (
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
