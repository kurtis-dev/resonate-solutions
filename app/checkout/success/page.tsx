import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-[1.75rem] border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Payment received</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Your Resonate package is confirmed.</h1>
        <p className="mt-4 leading-7 text-muted">
          Thank you. Resonate will review your order, match it to your business details, and follow up with the next step. When your portal is ready, you will sign in at app.resonate.solutions.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/portal" className="rounded-full bg-coral px-5 py-3 text-center font-black text-white">Open customer portal</Link>
          <Link href="/billing" className="rounded-full bg-ink px-5 py-3 text-center font-black text-white">Open billing</Link>
          <Link href="/" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Back home</Link>
        </div>
      </section>
    </main>
  );
}
