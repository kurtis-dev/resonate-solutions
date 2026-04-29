import { plans } from "@/lib/plans";

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`rounded-lg border bg-white p-6 shadow-sm ${plan.highlighted ? "border-brand shadow-soft" : "border-line"}`}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
            {plan.highlighted ? <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">Popular</span> : null}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{plan.description}</p>
          <p className="mt-6 text-4xl font-black text-ink">
            {plan.price}
            {plan.billingPeriod ? <span className="text-base font-semibold text-muted">/{plan.billingPeriod}</span> : null}
          </p>
          <p className="mt-2 text-sm font-bold text-brand">{plan.limit}</p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {/* STRIPE CHECKOUT: Replace checkoutUrl values in lib/plans.ts with live Stripe Checkout links or call your own checkout API route here. */}
          <a
            href={plan.checkoutUrl}
            className={`mt-7 inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-bold ${plan.highlighted ? "bg-brand text-white hover:bg-brandDark" : "bg-ink text-white hover:bg-brandDark"}`}
          >
            {plan.cta}
          </a>
        </article>
      ))}
    </div>
  );
}
