import Link from "next/link";

export default function CheckoutPage({
  searchParams
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams.plan || "starter";

  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-lg border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Checkout</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Stripe checkout placeholder</h1>
        <p className="mt-4 leading-7 text-muted">
          You selected the <strong>{plan}</strong> plan. This page is a safe placeholder until Stripe Checkout is connected.
        </p>
        {/* STRIPE CHECKOUT: Replace this placeholder page with a Stripe Checkout redirect or create an API route that returns a Stripe Checkout session URL. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/replypilot/pricing" className="rounded-lg bg-ink px-5 py-3 text-center font-black text-white">Back to pricing</Link>
          <Link href="/replypilot/generator" className="rounded-lg border border-line px-5 py-3 text-center font-black text-ink">Try generator</Link>
        </div>
      </section>
    </main>
  );
}
