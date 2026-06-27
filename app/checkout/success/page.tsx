import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const isFreeRequest = params.status === "free-requested";

  return (
    <main className="mx-auto flex max-w-2xl px-5 py-16">
      <section className="w-full rounded-[1.75rem] border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{isFreeRequest ? "Request received" : "Payment received"}</p>
        <h1 className="mt-3 text-4xl font-black text-ink">{isFreeRequest ? "Your Free Page Plan request is in." : "Your Resonate package is confirmed."}</h1>
        <p className="mt-4 leading-7 text-muted">
          {isFreeRequest
            ? "Thank you. Resonate will review the business details, recommend the right MenuPilot setup, and follow up with the next step. Paid build work starts only after you choose Launch."
            : "Thank you. Resonate will review your order, match it to your business details, and follow up with the next step. When your portal is ready, you will sign in at app.resonate.solutions."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!isFreeRequest ? <Link href="/portal" className="rounded-full bg-coral px-5 py-3 text-center font-black text-white">Open customer portal</Link> : null}
          {!isFreeRequest ? <Link href="/billing" className="rounded-full bg-ink px-5 py-3 text-center font-black text-white">Open billing</Link> : null}
          <Link href="/" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Back home</Link>
        </div>
      </section>
    </main>
  );
}
