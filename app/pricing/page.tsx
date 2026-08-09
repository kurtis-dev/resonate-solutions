import type { Metadata } from "next";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = {
  title: "Pricing | Build Your Page, Then Choose Ongoing Help",
  description: "Start with a $399 Launch build, then choose $17.99 Webpage Hosting or $79.99 Managed Page support with hosting included."
};

export default function PricingPage() {
  return (
    <main className="bg-cream">
      <section className="relative overflow-hidden border-b border-line bg-[#fffaf7]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#202320,#f17855,#f6a15e,#202320)]" />
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Pricing</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
              Build it first. Then choose how much help you want keeping it current.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Every paid Resonate page starts with Launch. After the approved page is built, choose simple hosting or let Resonate handle routine content updates for you.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <PricingCards />
        <div className="mt-10 rounded-[1.75rem] border border-coral/25 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">What happens next</p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink">You approve the page before customers see it.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            Launch starts the build. Resonate organizes the approved content, creates a private preview, and checks the page on phone and desktop. Monthly support begins with Launch only when you choose Webpage Hosting or Managed Page at checkout.
          </p>
        </div>
      </section>
    </main>
  );
}
