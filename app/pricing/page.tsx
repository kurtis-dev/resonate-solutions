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
              Pick the level of business page help your company actually needs.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              A business page gives customers one clean place to see what you offer, trust your company, and take the next step. Choose the business type that fits you best, then shape the page around what customers need before they call, book, request a quote, or visit.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <PricingCards />
        <div className="mt-10 rounded-[1.75rem] border border-coral/25 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Plain version</p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink">Your page helps customers decide what to do next.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            Give people one easy place to see services, photos, hours, location, trust signals, QR code, and the button that moves them forward.
          </p>
        </div>
      </section>
    </main>
  );
}
