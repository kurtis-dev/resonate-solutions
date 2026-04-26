export default function AccountPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Account</p>
        <h1 className="mt-3 text-4xl font-black text-ink md:text-6xl">Review workflow placeholder</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          This page is ready for authenticated usage, billing status, monthly reply limits, approval settings, and platform access status.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Current plan", "Free", "Upgrade to unlock higher monthly reply limits."],
          ["Replies used", "0 / 10", "Production usage should come from your database."],
          ["Posting mode", "Approval required", "Start with human approval before any platform posting."],
          ["Billing", "Not connected", "Connect Stripe Billing before accepting payments."]
        ].map(([label, value, help]) => (
          <article key={label} className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-muted">{label}</p>
            <p className="mt-3 text-3xl font-black text-ink">{value}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{help}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
