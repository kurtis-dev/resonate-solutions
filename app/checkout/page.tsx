import Link from "next/link";

export default function CheckoutPage({
  searchParams
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams.plan || "launch-kit";

  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-lg border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Checkout</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Payment placeholder</h1>
        <p className="mt-4 leading-7 text-muted">
          You selected the <strong>{plan}</strong> package. This page is a safe placeholder until Stripe Checkout, Stripe Payment Links, Square invoices, or another payment flow is connected.
        </p>
        {/* STRIPE CHECKOUT: Replace this placeholder page with a Stripe Checkout redirect, a Stripe Payment Link, or your own checkout API route. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="rounded-lg bg-ink px-5 py-3 text-center font-black text-white">Back to pricing</Link>
          <Link href="/menupilot" className="rounded-lg border border-line px-5 py-3 text-center font-black text-ink">See MenuPilot</Link>
        </div>
      </section>
    </main>
  );
}
