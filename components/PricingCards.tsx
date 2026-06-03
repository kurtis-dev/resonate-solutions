import { plans } from "@/lib/plans";

export function PricingCards() {
  const reviewPlan = plans.find((plan) => plan.paymentMode === "none");
  const paidPlans = plans.filter((plan) => plan.paymentMode !== "none");

  return (
    <div className="grid gap-6">
      {reviewPlan ? (
        <article className="grid gap-5 rounded-[1.75rem] border-2 border-coral/30 bg-white p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-extrabold text-ink">{reviewPlan.name}</h3>
              <span className="rounded-full bg-[#fff0e9] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-coral">{reviewPlan.limit}</span>
            </div>
            <p className="mt-3 max-w-3xl leading-7 text-muted">{reviewPlan.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-muted">
              {reviewPlan.features.map((feature) => (
                <span key={feature.label} className="rounded-full border border-line bg-cream px-3 py-2">{feature.label}</span>
              ))}
            </div>
          </div>
          <a href={reviewPlan.checkoutUrl} className="inline-flex justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-coral">
            {reviewPlan.cta}
          </a>
        </article>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {paidPlans.map((plan) => (
          <article
            key={plan.name}
            className={`group flex min-h-full flex-col rounded-[1.75rem] border-2 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft ${plan.highlighted ? "border-coral shadow-soft" : "border-line hover:border-coral/40"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-extrabold text-ink">{plan.name}</h3>
              <span className="rounded-full bg-[#fff0e9] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-coral">{plan.limit}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{plan.description}</p>
            <p className="mt-6 text-4xl font-black text-ink">
              {plan.price}
              {plan.billingPeriod ? <span className="text-base font-semibold text-muted">/{plan.billingPeriod}</span> : null}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {plan.features.map((feature) => (
                <li key={feature.label} className="group/feature rounded-xl border border-transparent p-3 transition hover:border-coral/30 hover:bg-[#fff0e9]">
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-coral" />
                    <span className="font-bold text-ink">{feature.label}</span>
                  </div>
                  <p className="mt-2 max-h-0 overflow-hidden pl-4 text-xs leading-5 text-muted opacity-0 transition-all duration-200 group-hover/feature:max-h-32 group-hover/feature:opacity-100">
                    {feature.detail}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex-1" />
            {/* STRIPE CHECKOUT: Replace checkoutUrl values in lib/plans.ts with live Stripe Checkout links or call your own checkout API route here. */}
            <a
              href={plan.checkoutUrl}
              className={`mt-7 inline-flex w-full justify-center rounded-full px-4 py-3 text-sm font-bold shadow-sm transition ${plan.highlighted ? "bg-coral text-white hover:bg-ink" : "bg-ink text-white hover:bg-coral"}`}
            >
              {plan.cta}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
