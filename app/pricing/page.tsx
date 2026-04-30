import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Pricing</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
          Simple monthly menu pages for local businesses that need to stay easy to find.
        </h1>
        <p className="mt-5 leading-7 text-muted">
          Starter gives the business the branded page. Plus adds easy daily update tools. Resonate Managed is for owners who want updates handled for them.
        </p>
      </div>
      <PricingCards />
      <section className="mt-10 rounded-[1.75rem] border border-coral/25 bg-white p-7 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">What the customer is buying</p>
        <h2 className="mt-3 text-3xl font-extrabold text-ink">Not a Clover replacement. A better front door that makes Clover easier to trust.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          Clover takes the order. MenuPilot helps customers decide to order by making the menu, hours, location, photos, specials, QR code, and ordering path easy to find before they reach checkout.
        </p>
      </section>
    </main>
  );
}
