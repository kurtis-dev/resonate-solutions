import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main className="bg-cream">
      <section className="relative overflow-hidden border-b border-line bg-[#fffaf7]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#202320,#f17855,#f6a15e,#202320)]" />
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Pricing</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
              Build the page first. Keep it current when the business changes.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Resonate is built for small businesses that need a clean customer page, food menu, or services list without turning it into a full website project. Start with a fit check, pay once for the Launch Build, then choose whether you want monthly help after launch.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <PricingCards />
        <div className="mt-10 rounded-[1.75rem] border border-coral/25 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">How payment works</p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink">Setup is required before production work starts.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            The free fit check helps clarify what the business needs. The one-time Launch Build starts the real page/menu/services work. Monthly support is separate and keeps the page current after launch.
          </p>
        </div>
      </section>
    </main>
  );
}
