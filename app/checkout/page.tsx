import Link from "next/link";
import { getPlanById } from "@/lib/plans";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string; status?: string }>;
}) {
  const params = await searchParams;
  const planId = params.plan || "setup";
  const plan = getPlanById(planId) || getPlanById("setup");
  const isOneTime = plan?.paymentMode === "payment";
  const statusMessage =
    params.status === "missing-stripe"
      ? "Online checkout is not available right now. Please request a Free Page Plan or contact Resonate to complete payment."
      : params.status === "cancelled"
        ? "Checkout was cancelled. You can restart when ready."
        : params.status === "checkout-error"
          ? "Checkout could not start. Please try again or contact Resonate for help."
          : "";

  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-[1.75rem] border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Checkout</p>
        <h1 className="mt-3 text-4xl font-black text-ink">{isOneTime ? "Start your page/menu setup." : "Start monthly page care."}</h1>
        <p className="mt-4 leading-7 text-muted">
          You selected <strong>{plan?.name}</strong>. Launch is the one-time payment that starts the custom build. Monthly support keeps the page, menu, or services list current after launch.
        </p>
        {statusMessage ? <p className="mt-5 rounded-2xl bg-[#fff0e9] px-4 py-3 text-sm font-bold text-coral">{statusMessage}</p> : null}
        <form action="/api/checkout" method="POST" className="mt-8 grid gap-4">
          <input type="hidden" name="plan" value={plan?.id || "setup"} />
          <label className="grid gap-2 text-sm font-bold text-ink">
            Customer email
            <input name="email" type="email" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="owner@example.com" />
          </label>
          <button type="submit" className="rounded-full bg-coral px-5 py-3 text-center font-black text-white shadow-soft hover:bg-ink">
            Continue to secure checkout
          </button>
        </form>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Back to pricing</Link>
          <Link href="/menupilot#fit-check" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Request Free Page Plan</Link>
        </div>
      </section>
    </main>
  );
}
