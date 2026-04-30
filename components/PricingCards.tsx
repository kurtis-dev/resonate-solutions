import { plans } from "@/lib/plans";

export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`group flex min-h-full flex-col rounded-[1.75rem] border-2 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft ${plan.highlighted ? "border-coral shadow-soft" : "border-line hover:border-coral/40"}`}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-extrabold text-ink">{plan.name}</h3>
            {plan.highlighted ? <span className="rounded-full bg-[#fff0e9] px-3 py-1 text-xs font-bold text-coral">Main offer</span> : null}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{plan.description}</p>
          <p className="mt-6 text-4xl font-black text-ink">
            {plan.price}
            {plan.billingPeriod ? <span className="text-base font-semibold text-muted">/{plan.billingPeriod}</span> : null}
          </p>
          <p className="mt-2 text-sm font-bold text-coral">{plan.limit}</p>
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
  );
}
