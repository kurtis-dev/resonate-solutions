import type { Metadata } from "next";
import Link from "next/link";
import { customerPortalUrl } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Managed Page | Routine Updates Without More Owner Upkeep",
  description: "You decide what changes. Resonate handles supported routine updates to your customer page and confirms when the work is complete."
};

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
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-48 -top-52 h-[38rem] w-[38rem] rounded-full border border-coral/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-28 h-[25rem] w-[25rem] rounded-full border border-gold/25" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Managed Page</p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">You run the business. We help keep the page current.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">You decide what changes. Resonate handles supported routine updates to the customer page and confirms when the work is complete.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/checkout?plan=launch-managed-page" className="rounded-full bg-coral px-6 py-3.5 text-center font-black text-white shadow-[0_16px_38px_rgba(217,120,86,0.24)] hover:bg-ink">
                Start Launch + Managed Page
              </Link>
              <a href="mailto:questions@resonate.solutions?subject=Managed%20Page%20Question" className="rounded-full border-2 border-ink px-6 py-3.5 text-center font-black text-ink hover:bg-ink hover:text-white">
                Ask a question
              </a>
            </div>
            <p className="mt-4 text-sm font-bold leading-6 text-muted">$79.99 per month. Hosting included. Up to 4 standard update requests per month.</p>
          </div>

          <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-brandDark">Routine changes we can handle</p>
            <h2 className="mt-3 text-2xl font-black">Keep the answers customers check most often useful.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {includedUpdates.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 text-sm font-bold leading-5">
                  <span className="mt-0.5 text-coral" aria-hidden="true">{"\u2713"}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-ink p-4 text-sm leading-6 text-white/72"><strong className="text-white">You stay in control:</strong> Resonate reviews the requested change before updating the customer-facing page.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">How updates work</p>
          <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">One request. A reviewed update. Clear confirmation.</h2>
          <p className="mt-4 text-lg leading-8 text-muted">Your page is updated deliberately. Resonate confirms what changed on the hosted customer page, and handles other destinations only when access and scope are confirmed with you.</p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {requestSteps.map(([title, text], index) => (
            <li key={title} className="rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-coral">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">What the plan includes</p>
            <h2 className="mt-3 text-3xl font-black">Routine help with a clear monthly scope.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted">Managed Page includes hosting, a monthly page review, priority turnaround, basic link and page-health checks, and up to 4 standard update requests each month. Frequent or complex work is available by quote.</p>
          </div>
          <Link href="/pricing" className="rounded-full bg-ink px-6 py-3.5 text-center font-black text-white hover:bg-coral">View pricing</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <p className="text-sm leading-6 text-muted">Already have portal access? <a href={customerPortalUrl} className="font-black text-ink underline decoration-coral decoration-2 underline-offset-4">Sign in to your account</a>. Additional destinations may require account access or manual updates and are not included unless Resonate confirms them.</p>
      </section>
    </main>
  );
}
