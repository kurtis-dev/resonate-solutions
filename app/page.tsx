import Link from "next/link";

const proofPoints = [
  "Custom branded menu pages",
  "QR links customers can trust",
  "Hours, specials, and location in one place",
  "Built for food trucks and local restaurants"
];

const customerProblems = [
  {
    title: "Facebook is too easy to miss",
    text: "Posts get buried, screenshots get old, and new customers do not know which update is current."
  },
  {
    title: "Clover is for checkout",
    text: "Clover takes the order. MenuPilot helps customers decide what to order and whether it is worth the drive."
  },
  {
    title: "Google is not the whole story",
    text: "A business profile can show hours and directions, but it rarely shows the food, specials, status, and personality clearly."
  }
];

export default function ResonateHome() {
  return (
    <main className="bg-cream">
      <section className="relative overflow-hidden border-b border-line bg-[#fffaf7]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#202320,#f17855,#f6a15e,#202320)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
          <div>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.01em] text-ink md:text-7xl">
              Make your local business easier to find, choose, and trust.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Resonate Solutions builds polished local presence pages for food trucks and small restaurants that need one current place for menus, hours, location, specials, photos, QR links, and ordering.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/menupilot" className="rounded-full bg-coral px-7 py-4 text-center font-bold text-white shadow-soft transition hover:bg-ink">
                Explore MenuPilot
              </Link>
              <Link href="/m/mellow-moose-burgers" className="rounded-full border border-line bg-white px-7 py-4 text-center font-bold text-ink shadow-sm transition hover:border-coral">
                See live example
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-muted">
              {proofPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2">
                  <span className="text-coral">{"\u2713"}</span>
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-line bg-white p-4 shadow-soft">
            <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#f17855,#f6a15e)] p-5">
              <div className="overflow-hidden rounded-[1.25rem] border-[6px] border-[#3a2418] bg-cream shadow-soft">
                <div className="bg-[#3a2418] px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Sample MenuPilot page
                </div>
                <div className="grid gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <img src="/assets/mellow-moose-logo.jpg" alt="Mellow Moose Burgers logo" className="h-20 w-20 rounded-2xl object-cover" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Live customer example</p>
                      <h2 className="text-3xl font-extrabold leading-tight text-ink">Mellow Moose Burgers</h2>
                      <p className="mt-1 text-sm font-semibold text-muted">Siloam Springs, AR</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <img src="/assets/mellow-moose-og-smashburger.jpg" alt="Mellow Moose smash burger" className="aspect-[4/3] rounded-2xl object-cover" />
                    <img src="/assets/mellow-moose-blazing-fries.jpg" alt="Mellow Moose loaded fries" className="aspect-[4/3] rounded-2xl object-cover" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm font-bold">
                    <span className="rounded-full bg-ink px-3 py-3 text-white">Order</span>
                    <span className="rounded-full bg-white px-3 py-3 text-ink">Directions</span>
                    <span className="rounded-full bg-white px-3 py-3 text-ink">Share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">What Resonate solves</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
              Customers should not have to dig to know if you are open.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {customerProblems.map((problem) => (
              <article key={problem.title} className="rounded-[1.5rem] border border-line bg-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <h3 className="text-2xl font-extrabold text-ink">{problem.title}</h3>
                <p className="mt-3 leading-7 text-muted">{problem.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-[2rem] bg-ink p-8 text-white shadow-soft md:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold md:text-4xl">MenuPilot is the first Resonate product.</h2>
                <p className="mt-3 max-w-2xl leading-7 text-white/80">
                  It gives local food businesses a branded menu hub that can route customers to Clover, maps, phone, reviews, specials, and daily status updates.
                </p>
              </div>
              <Link href="/menupilot" className="rounded-full bg-coral px-7 py-4 text-center font-bold text-white shadow-sm transition hover:bg-white hover:text-ink">
                See how MenuPilot works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
