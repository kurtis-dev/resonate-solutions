import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-[1.75rem] border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Payment received</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Your Resonate package is queued.</h1>
        <p className="mt-4 leading-7 text-muted">
          Stripe confirmed checkout. Once Stripe and the database are connected, this page can also record payment status for follow-up.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/menupilot" className="rounded-full bg-brand px-5 py-3 text-center font-black text-white">Request Free Menu Review</Link>
          <Link href="/" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Back home</Link>
        </div>
      </section>
    </main>
  );
}
