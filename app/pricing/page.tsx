import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Pricing</p>
        <h1 className="mt-3 text-4xl font-black text-ink md:text-6xl">Launch packages for local businesses that need to be easier to find.</h1>
        <p className="mt-5 leading-7 text-muted">
          Start with a practical mobile presence kit, then add monthly upkeep when the business needs help keeping menus, hours, locations, photos, and public links current.
        </p>
      </div>
      <PricingCards />
      <section className="mt-10 rounded-lg border border-brand/25 bg-white p-7 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Service-led launch</p>
        <h2 className="mt-3 text-3xl font-black text-ink">This is built to sell locally before it becomes a bigger software platform.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          Resonate can start with hands-on setup: photos, menu cleanup, QR code, Google profile review, and a clean mobile customer page. Software features can grow from the repeated work customers actually pay for.
        </p>
      </section>
    </main>
  );
}
