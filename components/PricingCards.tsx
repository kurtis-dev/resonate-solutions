import { Plan, plans } from "@/lib/plans";

function PlanCard({ plan, managed = false }: { plan: Plan; managed?: boolean }) {
  return (
    <article
      className={`surface-card lift relative flex h-full flex-col border-2 p-7 ${
        managed
          ? "border-[#ff5a1f] shadow-[0_22px_65px_rgba(255,90,31,0.14)]"
          : "border-line"
      }`}
    >
      {managed ? (
        <span className="absolute -top-3 right-7 rounded-full bg-[#ff5a1f] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(255,90,31,0.28)]">
          Hosting included
        </span>
      ) : null}

      <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${managed ? "bg-[#ffe6da] text-[#ff5a1f]" : "bg-[#e8f6f3] text-[#17877d]"}`}>
        {plan.limit}
      </span>
      <h3 className="mt-5 text-2xl font-black text-ink">{plan.name}</h3>
      <p className="mt-4 text-sm leading-6 text-muted">{plan.description}</p>

      <p className="mt-6 flex items-end gap-2 text-4xl font-black text-ink">
        {plan.price}
        <span className="pb-1 text-sm font-semibold text-muted">
          {plan.billingPeriod ? `per ${plan.billingPeriod === "mo" ? "month" : plan.billingPeriod}` : "one-time"}
        </span>
      </p>

      <ul className="mt-6 grid gap-2.5 text-sm text-muted">
        {plan.features.map((feature) => (
          <li key={feature.label} title={feature.detail} className="rounded-2xl border border-transparent bg-[#fffaf7] p-3 transition hover:border-[#f1d8cc]">
            <div className="flex gap-3">
              <span className="mt-1 text-[#ff5a1f]" aria-hidden="true">{"\u2713"}</span>
              <span className="font-semibold leading-5 text-ink">{feature.label}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex-1" />
      <a
        href={plan.checkoutUrl}
        className={`btn-base mt-8 w-full gap-2 ${
          managed
            ? "bg-[#ff5a1f] text-white shadow-[0_16px_35px_rgba(255,90,31,0.22)] hover:bg-[#3a2418]"
            : "bg-[#3a2418] text-white hover:bg-[#ff5a1f]"
        }`}
      >
        {plan.cta}
        <span aria-hidden="true">{"\u2192"}</span>
      </a>
    </article>
  );
}

export function PricingCards() {
  const freePlan = plans.find((plan) => plan.id === "review");
  const launchPlan = plans.find((plan) => plan.id === "setup");
  const hostingPlan = plans.find((plan) => plan.id === "hosting");
  const managedPlan = plans.find((plan) => plan.id === "managed-page");

  if (!freePlan || !launchPlan || !hostingPlan || !managedPlan) {
    return null;
  }

  return (
    <section>
      <aside className="relative grid overflow-hidden rounded-[1.75rem] border border-[#4c4868] bg-[#27243f] p-7 text-white shadow-[0_22px_65px_rgba(39,36,63,0.2)] md:grid-cols-[1fr_auto] md:items-center md:gap-10">
        <span className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border border-[#b9b5ff]/40" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-4 -top-8 h-36 w-36 rounded-full border border-[#ffd35e]/35" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffd35e]">Not sure what you need?</p>
          <h2 className="mt-3 text-3xl font-black">Start with a Free Page Plan.</h2>
          <p className="mt-3 max-w-3xl leading-7 text-white/72">We review what you have, what customers need to find, and the most useful next step before you pay for a build.</p>
        </div>
        <a href={freePlan.checkoutUrl} className="btn-base relative bg-white text-ink hover:bg-[#ffd35e]">
          {freePlan.cta}
        </a>
      </aside>

      <div className="mt-14">
        <p className="eyebrow text-coral">Stage 1: Build it</p>
        <h2 className="mt-3 text-3xl font-black text-ink">Every paid Resonate page starts with Launch.</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted">We build the approved customer page, give you a private preview, and check it before the public link goes live.</p>
        <div className="mt-7 max-w-3xl">
          <PlanCard plan={launchPlan} />
        </div>
      </div>

      <div className="mt-14">
        <p className="eyebrow text-coral">Stage 2: Keep it running</p>
        <h2 className="mt-3 text-3xl font-black text-ink">Choose how much help you want after Launch.</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted">Choose hosting when you will send your own content changes. Choose Managed Page when you do not want another webpage to maintain.</p>
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <PlanCard plan={hostingPlan} />
          <PlanCard plan={managedPlan} managed />
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm font-semibold leading-6 text-muted">
        Need frequent or complex updates? Custom management is available by quote.
      </p>
    </section>
  );
}
