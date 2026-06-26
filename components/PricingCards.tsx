import { plans } from "@/lib/plans";

export function PricingCards() {
  return (
    <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => {
        const isFree = plan.paymentMode === "none";
        const isManaged = plan.id === "care-plus";
        const isHighlighted = plan.highlighted || isManaged;

        return (
          <article
            key={plan.name}
            className={`relative flex min-h-[520px] flex-col rounded-[1.75rem] border-2 bg-white p-6 shadow-sm transition-colors duration-200 ${
              isHighlighted
                ? "border-[#ff5a1f] shadow-[0_22px_65px_rgba(255,90,31,0.14)]"
                : "border-line hover:border-[#ff5a1f]/40"
            }`}
          >
            {isManaged ? (
              <span className="absolute -top-3 right-7 rounded-full bg-[#ff5a1f] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(255,90,31,0.28)]">
                Most hands-off
              </span>
            ) : null}

            <div className="min-h-[148px]">
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                isHighlighted ? "bg-[#ffe6da] text-[#ff5a1f]" : "bg-[#e8f6f3] text-[#17877d]"
              }`}>
                {isFree ? "Start here" : plan.limit}
              </span>
              <h3 className="mt-5 text-2xl font-black text-ink">{plan.name}</h3>
              <p className="mt-4 text-sm leading-6 text-muted">{plan.description}</p>
            </div>

            <p className="mt-6 flex min-h-[52px] items-end gap-2 text-4xl font-black text-ink">
              {isFree ? "Free" : plan.price}
              {plan.billingPeriod ? <span className="pb-1 text-sm font-semibold text-muted">per {plan.billingPeriod === "mo" ? "month" : plan.billingPeriod}</span> : isFree ? <span className="pb-1 text-sm font-semibold text-muted">Preview & decide</span> : <span className="pb-1 text-sm font-semibold text-muted">one-time</span>}
            </p>

            <ul className="mt-6 grid gap-2.5 text-sm text-muted">
              {plan.features.map((feature) => (
                <li
                  key={feature.label}
                  title={feature.detail}
                  className="rounded-xl border border-transparent p-3 transition-colors hover:border-[#ff5a1f]/25 hover:bg-[#fff7f1]"
                >
                  <div className="flex gap-3">
                    <span className="mt-1 text-[#ff5a1f]">{"\u2713"}</span>
                    <span className="font-semibold leading-5 text-ink">{feature.label}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex-1" />
            <a
              href={plan.checkoutUrl}
              className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-black shadow-sm transition ${
                isHighlighted
                  ? "bg-[#ff5a1f] text-white shadow-[0_16px_35px_rgba(255,90,31,0.22)] hover:bg-[#3a2418]"
                  : "bg-[#3a2418] text-white hover:bg-[#ff5a1f]"
              }`}
            >
              {plan.cta}
              <span aria-hidden="true">{"\u2192"}</span>
            </a>
          </article>
        );
      })}
    </div>
  );
}
