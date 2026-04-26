import Link from "next/link";

const features = [
  {
    title: "Mobile menu page",
    text: "A clean menu that loads fast on a phone, with sections, prices, sold-out notes, and daily specials."
  },
  {
    title: "Where we are today",
    text: "A simple location block for food trucks, pop-ups, and small restaurants that move or change hours."
  },
  {
    title: "QR code ready",
    text: "Put one QR code on the truck, counter, receipt, or social profile and update the page without reprinting anything."
  },
  {
    title: "Google profile helper",
    text: "Keep the public essentials aligned: hours, services, menu link, photos, and customer review touchpoints."
  }
];

const sampleMenu = [
  ["Honey Latte", "$5.50"],
  ["Cold Brew", "$4.25"],
  ["Breakfast Taco", "$3.75"],
  ["Brisket Slider", "$7.00"]
];

export default function MenuPilotPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(245,184,75,0.28),transparent_34%),linear-gradient(135deg,rgba(15,159,143,0.24),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_0.85fr] md:py-28">
          <div className="self-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">MenuPilot by Resonate Solutions</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              A menu and location page customers can actually find.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              For food trucks, pop-ups, and small restaurants that need a simple mobile page for menu items, hours, location, photos, and review links without building a full website.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pricing" className="min-h-12 rounded-lg bg-brand px-6 py-3 text-center font-bold text-white hover:bg-brandDark">
                View launch plans
              </Link>
              <Link href="/" className="min-h-12 rounded-lg border border-white/25 px-6 py-3 text-center font-bold text-white hover:bg-white/10">
                See full offer
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-soft backdrop-blur">
            <div className="rounded-lg bg-white p-5">
              <div className="border-b border-line pb-4">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-brand">Today</p>
                <h2 className="mt-2 text-3xl font-black text-ink">Bentonville Square</h2>
                <p className="mt-1 text-sm text-muted">11:00 AM - 2:00 PM - Near the south entrance</p>
              </div>
              <div className="mt-5 grid gap-3">
                {sampleMenu.map(([item, price]) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border border-line bg-slate-50 p-4">
                    <span className="font-bold text-ink">{item}</span>
                    <span className="font-black text-brand">{price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-ink p-4 text-white">
                <p className="text-sm font-bold">Quick actions</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm font-bold">
                  <span className="rounded-lg bg-white/10 px-3 py-2">Get directions</span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">Leave review</span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">Order link</span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">Share menu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Why it fits</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
            Discovery is broken for a lot of small food businesses.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            Customers often cannot find the menu, current location, hours, or a reliable link. MenuPilot gives them one lightweight page that can sit on Google, Instagram, QR codes, receipts, and signs.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-ink">{feature.title}</h3>
              <p className="mt-3 leading-7 text-muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
