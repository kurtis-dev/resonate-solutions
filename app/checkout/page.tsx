import Link from "next/link";
import { getPlanById } from "@/lib/plans";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string; status?: string }>;
}) {
  const params = await searchParams;
  const planId = params.plan || "launch-kit";
  const plan = getPlanById(planId) || getPlanById("launch-kit");
  const statusMessage =
    params.status === "missing-stripe"
      ? "Stripe is not connected yet. Add STRIPE_SECRET_KEY and the matching Stripe Price ID environment variable in Vercel."
      : params.status === "cancelled"
        ? "Checkout was cancelled. You can restart when ready."
        : params.status === "checkout-error"
          ? "Stripe did not return a checkout URL. Please try again."
          : "";

  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-[1.75rem] border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Checkout</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Start your Resonate package.</h1>
        <p className="mt-4 leading-7 text-muted">
          You selected <strong>{plan?.name}</strong>. Once Stripe is connected, this button sends customers to a secure Stripe Checkout page and webhook events update your backend.
        </p>
        {statusMessage ? <p className="mt-5 rounded-2xl bg-sage px-4 py-3 text-sm font-bold text-brandDark">{statusMessage}</p> : null}
        <form action="/api/checkout" method="POST" className="mt-8 grid gap-4">
          <input type="hidden" name="plan" value={plan?.id || "launch-kit"} />
          <label className="grid gap-2 text-sm font-bold text-ink">
            Customer email
            <input name="email" type="email" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="owner@example.com" />
          </label>
          <button type="submit" className="rounded-full bg-brand px-5 py-3 text-center font-black text-white shadow-soft hover:bg-brandDark">
            Continue to secure checkout
          </button>
        </form>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Back to pricing</Link>
          <Link href="/menupilot" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Request Soundcheck</Link>
        </div>
      </section>
    </main>
  );
}
