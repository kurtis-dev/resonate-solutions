import type { Metadata } from "next";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = {
  title: "Pricing | Build Your Page, Then Choose Ongoing Help",
  description: "Start with a $399 Launch build, then choose $17.99 Webpage Hosting or $79.99 Managed Page support with hosting included."
};

export default function PricingPage() {
  return (
    <main className="bg-cream">
      <section className="section-seam section-glow-mint relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-coral/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-4 top-4 h-48 w-48 rounded-full border border-gold/35" aria-hidden="true" />
        <div className="container-page relative py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="eyebrow text-coral">Pricing</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
              Build it first. Then choose how much help you want keeping it current.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Every paid Resonate page starts with Launch. After the approved page is built, choose simple hosting or let Resonate handle routine content updates for you.
            </p>
          </div>
        </div>
      </section>
      <section className="container-page py-14 md:py-20">
        <PricingCards />
        <div className="surface-card-tint mt-12 p-7 sm:p-9">
          <p className="eyebrow text-coral">What happens next</p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink">You approve the page before customers see it.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            Launch starts the build. Resonate organizes the approved content, creates a private preview, and checks the page on phone and desktop. Monthly support begins with Launch only when you choose Webpage Hosting or Managed Page at checkout.
          </p>
        </div>
      </section>
    </main>
  );
}
