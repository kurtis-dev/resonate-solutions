import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Pricing</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-6xl">Plans for every review workflow.</h1>
        <p className="mt-5 leading-7 text-muted">
          Start with 10 free replies. Upgrade when you need saved business rules, mobile-friendly review triage, safer approval workflows, higher usage limits, and platform support where access is available.
        </p>
      </div>
      <PricingCards />
      <section className="mt-10 rounded-lg border border-brand/25 bg-white p-7 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Managed option</p>
        <h2 className="mt-3 text-3xl font-black text-ink">Want ReplyPilot to take more of the work off your plate?</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          A managed monthly service can include scheduled review checks, safe response drafting, owner approval, and posting support for eligible connected platforms. Unsupported channels still receive copy-ready replies for manual posting.
        </p>
        <p className="mt-4 font-bold text-ink">Suggested launch price: from $149/month.</p>
      </section>
    </main>
  );
}
