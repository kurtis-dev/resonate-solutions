import type { Metadata } from "next";
import { OwnerPortalPreview } from "@/components/OwnerPortalPreview";
import { customerPortalUrl } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Owner Portal | Resonate Solutions",
  description: "Review your customer page, request updates, and follow each change from request to publication."
};

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-48 -top-52 h-[38rem] w-[38rem] rounded-full border border-coral/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-28 h-[25rem] w-[25rem] rounded-full border border-gold/25" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Resonate Owner Portal</p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">Keep your customer page current without starting another email chain.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">See what customers can view now, request the next change, and follow each update through review and publication.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={customerPortalUrl} className="rounded-full bg-coral px-6 py-3.5 text-center font-black text-white shadow-[0_16px_38px_rgba(217,120,86,0.24)] hover:bg-ink">
                Sign in to your portal
              </a>
              <a href="mailto:questions@resonate.solutions?subject=Owner%20Portal%20Access" className="rounded-full border-2 border-ink px-6 py-3.5 text-center font-black text-ink hover:bg-ink hover:text-white">
                Ask about access
              </a>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted">Secure sign-in opens the customer portal at app.resonate.solutions.</p>
          </div>

          <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-brandDark">Built for day-to-day changes</p>
            <h2 className="mt-3 text-2xl font-black">The details customers check before they contact you.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Hours and temporary closures", "Announcements and availability", "Text, pricing, menus, and services", "Photos and primary customer actions"].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-cream p-4 text-sm font-bold leading-5">
                  <span className="mt-0.5 text-coral" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-ink p-4 text-sm leading-6 text-white/72">
              <strong className="text-white">Review first:</strong> Resonate checks requested changes before anything reaches the public customer page.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Dashboard preview</p>
          <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">One place to see what is live and what needs attention.</h2>
          <p className="mt-4 text-lg leading-8 text-muted">The dashboard is organized around owner tasks—not internal Resonate setup, billing notes, or technical controls.</p>
        </div>
        <OwnerPortalPreview />
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-3">
          {[
            ["Send it once", "Choose the type of change and provide the details in one request."],
            ["See the status", "Know whether Resonate needs information, is reviewing the work, or is ready to publish."],
            ["Know what is live", "Check the current customer-facing details without opening several profiles and pages."]
          ].map(([title, text]) => (
            <article key={title} className="border-t-2 border-ink pt-5">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
