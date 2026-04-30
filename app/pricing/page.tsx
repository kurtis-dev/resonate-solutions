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
              Pick the level of menu help your business actually needs.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              MenuPilot is not where customers pay for food. It is the branded menu page that helps them choose, then sends them to Clover, DoorDash, a phone call, directions, or whatever link you already use.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <PricingCards />
        <div className="mt-10 rounded-[1.75rem] border border-coral/25 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Plain version</p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink">Clover takes the order. MenuPilot helps people decide to order.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            Your page gives customers one easy place to see the menu, food photos, hours, location, specials, QR code, and order button before they reach checkout.
          </p>
        </div>
      </section>
    </main>
  );
}
