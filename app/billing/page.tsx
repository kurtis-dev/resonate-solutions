import Link from "next/link";
import { questionsEmail } from "@/lib/contact";
import { customerPortalUrl } from "@/lib/portal";

const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || "";

const checkoutChoices = [
  {
    name: "Launch only",
    price: "$399",
    billing: "one-time",
    description: "The custom page build with no Resonate monthly plan added at checkout.",
    href: "/checkout?plan=setup",
    cta: "Choose Launch only",
    highlighted: false
  },
  {
    name: "Launch + Webpage Hosting",
    price: "$416.99",
    billing: "today, then $17.99/month",
    description: "Launch plus hosting, SSL, routine platform maintenance, and basic uptime monitoring. Content updates are not included.",
    href: "/checkout?plan=launch-hosting",
    cta: "Choose Launch + Hosting",
    highlighted: false
  },
  {
    name: "Launch + Managed Page",
    price: "$478.99",
    billing: "today, then $79.99/month",
    description: "Launch plus Managed Page. Hosting is included, so there is no separate $17.99 monthly charge.",
    href: "/checkout?plan=launch-managed-page",
    cta: "Choose Launch + Managed Page",
    highlighted: true
  }
];

export default function BillingPage() {
  return (
    <main className="bg-cream">
      <section className="border-b border-line bg-[#fffaf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
              Billing for your Resonate page.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Choose Launch only, Launch with Webpage Hosting, or Launch with Managed Page through secure Stripe checkout.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-coral/25 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Secure payments</p>
            <p className="mt-3 leading-7 text-muted">
              Debit cards, credit cards, and supported wallets are handled by Stripe. Resonate does not collect card numbers in the website or customer app.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {checkoutChoices.map((choice) => (
            <article
              key={choice.name}
              className={`flex min-h-full flex-col rounded-[1.75rem] border-2 bg-white p-6 shadow-sm ${
                choice.highlighted ? "border-coral" : "border-line"
              }`}
            >
              <h2 className="text-2xl font-extrabold text-ink">{choice.name}</h2>
              <p className="mt-5 text-3xl font-black text-ink">{choice.price}</p>
              <p className="mt-1 text-sm font-bold text-coral">{choice.billing}</p>
              <p className="mt-5 leading-7 text-muted">{choice.description}</p>
              <div className="flex-1" />
              <Link
                href={choice.href}
                className={`mt-7 rounded-full px-5 py-3 text-center font-black shadow-sm transition ${
                  choice.highlighted ? "bg-coral text-white hover:bg-ink" : "bg-ink text-white hover:bg-coral"
                }`}
              >
                {choice.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Webpage Hosting</p>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">$17.99/month</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
              <li>Hosting and SSL</li>
              <li>Routine platform maintenance</li>
              <li>Basic uptime monitoring</li>
              <li>No content updates</li>
            </ul>
          </section>

          <section className="rounded-[1.75rem] border-2 border-coral bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Managed Page</p>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">$79.99/month, hosting included</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
              <li>Up to 4 standard update requests per month</li>
              <li>Monthly page review</li>
              <li>Text, photo, hours, menu, and service updates</li>
              <li>Priority turnaround</li>
              <li>Basic link and page-health checks</li>
            </ul>
          </section>
        </div>

        <p className="mt-6 text-center text-sm font-semibold leading-6 text-muted">
          Need frequent or complex updates? Custom management is available by quote.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <section className="rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-ink">Manage billing</h2>
            <p className="mt-3 leading-7 text-muted">
              Use Stripe to update the card on file, view subscription details, or handle billing changes after a monthly plan is active.
            </p>
            {portalUrl ? (
              <a href={portalUrl} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-black text-white transition hover:bg-coral">
                Open Stripe billing portal
              </a>
            ) : (
              <a href={`mailto:${questionsEmail}?subject=Resonate billing help`} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-black text-white transition hover:bg-coral">
                Ask for billing help
              </a>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-ink">Customer portal</h2>
            <p className="mt-3 leading-7 text-muted">
              Your MenuPilot customer portal lives at app.resonate.solutions. Portal access is opened after Resonate reviews the business record and connects it to the right account.
            </p>
            <a href={customerPortalUrl} className="mt-6 inline-flex rounded-full border border-line px-5 py-3 font-black text-ink transition hover:border-coral">
              Open customer portal
            </a>
          </section>
        </div>

        <section className="mt-6 rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-extrabold text-ink">Before work starts</h2>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-muted sm:grid-cols-3">
            <p><strong className="block text-ink">Free Page Plan</strong>Resonate reviews the business and recommends the right setup.</p>
            <p><strong className="block text-ink">Launch payment</strong>The one-time setup payment starts the custom build.</p>
            <p><strong className="block text-ink">Choose monthly support</strong>Webpage Hosting keeps the page live; Managed Page adds updates and includes hosting.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
