import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Pricing</p>
        <h1 className="mt-3 text-4xl font-black text-ink md:text-6xl">Monthly menu presence for local businesses that need to stay easy to find.</h1>
        <p className="mt-5 leading-7 text-muted">
          Keep the offer simple: an owner-managed plan when the business wants control, or a Resonate-managed plan when they want you handling updates, specials, photos, hours, and popup changes for them.
        </p>
      </div>
      <PricingCards />
      <section className="mt-10 rounded-lg border border-brand/25 bg-white p-7 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">What the customer is buying</p>
        <h2 className="mt-3 text-3xl font-black text-ink">Not a one-time website project. A cleaner customer path that stays current.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          Owner Managed gives the business a branded menu page, QR link, and the controls to update routine changes themselves. Resonate Managed is priced higher because it includes your time: menu changes, popup switches, fresh photos, sold-out notes, and recurring checks so public information does not quietly go stale.
        </p>
      </section>
    </main>
  );
}
