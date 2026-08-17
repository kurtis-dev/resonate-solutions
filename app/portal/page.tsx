import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { customerPortalUrl } from "@/lib/portal";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Website Maintenance & Managed Updates for Small Businesses | Resonate",
  description: "Managed Page includes hosting and reviewed standard updates when your business changes, with separately scoped support for larger projects and redesigns.",
  path: "/portal"
});

const includedUpdates = [
  "Text and service details",
  "Photos supplied by the business",
  "Regular hours and temporary closures",
  "Menu items and prices",
  "Announcements and availability",
  "Primary links and customer actions"
];

const requestSteps = [
  ["Tell us what changed", "Send one clear request with the new information and any files we need."],
  ["We review the request", "Resonate checks the current page, the proposed change, and whether anything needs clarification."],
  ["We update the supported page", "The approved change is made to the Resonate-hosted customer page within the plan scope."],
  ["You get confirmation", "Resonate confirms when the request is complete so you know what customers can see."]
];

export default function ManagedPagePage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Managed Page", path: "/portal" }])} />
      <section className="section-seam section-glow-mint relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-48 -top-52 h-[38rem] w-[38rem] rounded-full border border-coral/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-28 h-[25rem] w-[25rem] rounded-full border border-gold/25" aria-hidden="true" />
        <div className="container-page relative grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow text-coral">Managed Page</p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">You run the business. We help keep the page current.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">You decide what changes. Resonate handles supported routine updates to the customer page and confirms when the work is complete.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/checkout?plan=launch-managed-page" className="btn-coral">
                Start Launch + Managed Page
              </Link>
              <a href="mailto:questions@resonate.solutions?subject=Managed%20Page%20Question" className="btn-outline-ink">
                Ask a question
              </a>
            </div>
            <p className="mt-4 text-sm font-bold leading-6 text-muted">$79.99 per month. Hosting included. Request standard updates whenever your business changes.</p>
          </div>

          <div className="surface-card rise-in p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-brandDark">Routine changes we can handle</p>
            <h2 className="mt-3 text-2xl font-black">Keep the answers customers check most often useful.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {includedUpdates.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 text-sm font-bold leading-5 transition hover:-translate-y-0.5 hover:border-coral/40 hover:bg-white">
                  <span className="mt-0.5 text-coral" aria-hidden="true">{"\u2713"}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-ink p-4 text-sm leading-6 text-white/72"><strong className="text-white">You stay in control:</strong> Resonate reviews the requested change before updating the customer-facing page.</p>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow text-coral">How updates work</p>
          <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">One request. A reviewed update. Clear confirmation.</h2>
          <p className="mt-4 text-lg leading-8 text-muted">Your page is updated deliberately. Resonate confirms what changed on the hosted customer page, and handles other destinations only when access and scope are confirmed with you.</p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {requestSteps.map(([title, text], index) => (
            <li key={title} className="surface-card lift p-6">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-coral">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-seam border-y border-line bg-[#27243f] text-white">
        <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">What the plan includes</p>
            <h2 className="mt-3 text-3xl font-black">Routine help when your business changes.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/70">Request standard updates whenever your business changes. Resonate reviews the change, updates your page, and confirms when it’s complete. Larger projects, new features, and substantial redesigns are scoped separately.</p>
          </div>
          <Link href="/pricing" className="btn-base bg-white text-ink hover:bg-gold">View pricing</Link>
        </div>
      </section>

      <section className="container-page py-10">
        <p className="text-sm leading-6 text-muted">Already have portal access? <a href={customerPortalUrl} className="font-black text-ink underline decoration-coral decoration-2 underline-offset-4">Sign in to your account</a>. Additional destinations may require account access or manual updates and are not included unless Resonate confirms them.</p>
      </section>
    </main>
  );
}
