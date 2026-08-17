import type { Metadata } from "next";
import Link from "next/link";
import { questionsEmail } from "@/lib/contact";
import { customerPortalUrl } from "@/lib/portal";
import { pageMetadata } from "@/lib/seo";

const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || "";

export const metadata: Metadata = pageMetadata({
  title: "Billing | Launch, Hosting, and Managed Page",
  description: "Start with the $399 Launch build, then choose no monthly plan, $17.99 Webpage Hosting, or $79.99 Managed Page support.",
  path: "/billing",
  robots: { index: false, follow: false }
});

const checkoutChoices = [
  {
    name: "Launch only",
    price: "No monthly bill",
    billing: "$399 Launch payment only",
    description: "Build the approved customer page with no Resonate monthly plan after launch.",
    href: "/checkout?plan=setup",
    cta: "Choose Launch only",
    highlighted: false
  },
  {
    name: "Webpage Hosting",
    price: "$17.99",
    billing: "per month with Launch",
    description: "Keep the approved page live and technically maintained. You handle your own content changes.",
    href: "/checkout?plan=launch-hosting",
    cta: "Choose Hosting after Launch",
    highlighted: false
  },
  {
    name: "Managed Page",
    price: "$79.99",
    billing: "per month with Launch",
    description: "For owners who do not want another webpage to maintain. Hosting and routine content updates are included.",
    href: "/checkout?plan=launch-managed-page",
    cta: "Choose Managed Page after Launch",
    highlighted: true
  }
];

export default function BillingPage() {
  return (
    <main className="bg-cream">
      <section className="section-seam section-glow-mint relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-coral/20" aria-hidden="true" />
        <div className="container-page relative grid gap-8 py-16 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:py-20">
          <div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
              Build the page. Then choose what happens when things change.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Every paid Resonate page starts with Launch at $399 one-time. After that, choose no monthly plan, simple Webpage Hosting, or Managed Page support.
            </p>
          </div>
          <div className="surface-card rise-in p-6">
            <p className="eyebrow text-coral">Secure payments</p>
            <p className="mt-3 leading-7 text-muted">
              Debit cards, credit cards, and supported wallets are handled by Stripe. Resonate does not collect your card number.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <section className="surface-card-tint border-2 border-coral p-7 sm:p-9">
          <p className="eyebrow text-coral">Step 1: Every page starts here</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-ink">Launch</h2>
              <p className="mt-2 max-w-3xl leading-7 text-muted">We build the approved customer page, give you a private preview, and check it before the public link goes live.</p>
            </div>
            <p className="text-3xl font-black text-ink">$399 <span className="text-sm font-bold text-muted">one-time</span></p>
          </div>
        </section>

        <div className="mt-8">
          <p className="eyebrow text-coral">Step 2: Choose what follows Launch</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink">Choose how much help you want keeping it current.</h2>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {checkoutChoices.map((choice) => (
            <article
              key={choice.name}
              className={`surface-card lift flex min-h-full flex-col border-2 p-6 ${
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
                className={`btn-base mt-7 ${
                  choice.highlighted ? "bg-coral text-white hover:bg-ink" : "bg-ink text-white hover:bg-coral"
                }`}
              >
                {choice.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-5 text-center text-sm font-semibold leading-6 text-muted">
          Monthly plans are selected with Launch. Stripe charges the first month at checkout; after that, only the monthly plan renews.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="surface-card lift p-7">
            <p className="eyebrow text-coral">Webpage Hosting</p>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">$17.99/month</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
              <li>Hosting and SSL</li>
              <li>Routine technical maintenance</li>
              <li>Basic uptime monitoring</li>
              <li>No content updates</li>
            </ul>
          </section>

          <section className="surface-card lift border-2 border-coral p-7">
            <p className="eyebrow text-coral">Managed Page</p>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">$79.99/month, hosting included</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
              <li>Request standard updates whenever your business changes</li>
              <li>Monthly page review</li>
              <li>Text, photo, hours, menu, and service updates</li>
              <li>Priority turnaround</li>
              <li>Basic link and page-health checks</li>
            </ul>
          </section>
        </div>

        <p className="mt-6 text-center text-sm font-semibold leading-6 text-muted">
          Larger projects, new features, and substantial redesigns are scoped separately.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <section className="surface-card p-7">
            <h2 className="text-2xl font-extrabold text-ink">Manage billing</h2>
            <p className="mt-3 leading-7 text-muted">
              Use Stripe to update the card on file, view subscription details, or handle billing changes after a monthly plan is active.
            </p>
            {portalUrl ? (
              <a href={portalUrl} className="btn-ink mt-6">
                Open Stripe billing portal
              </a>
            ) : (
              <a href={`mailto:${questionsEmail}?subject=Resonate billing help`} className="btn-ink mt-6">
                Ask for billing help
              </a>
            )}
          </section>

          <section className="surface-card p-7">
            <h2 className="text-2xl font-extrabold text-ink">Customer portal</h2>
            <p className="mt-3 leading-7 text-muted">
              If Resonate has activated portal access for your account, use it to review the current page and send supported update requests. Email support remains available when portal access is not active.
            </p>
            <a href={customerPortalUrl} className="btn-outline-ink mt-6">
              Open owner portal
            </a>
          </section>
        </div>

        <section className="surface-card mt-6 p-7">
          <h2 className="text-2xl font-extrabold text-ink">You stay in control before anything goes live.</h2>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-muted sm:grid-cols-3">
            <p><strong className="block text-ink">Start free if you are unsure</strong>We review what customers need and recommend the clearest next step.</p>
            <p><strong className="block text-ink">Launch starts the build</strong>The one-time payment starts the approved customer-page project.</p>
            <p><strong className="block text-ink">You approve the page</strong>Resonate shares a private preview before the public link is used.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
