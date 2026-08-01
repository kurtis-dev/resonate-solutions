import type { Metadata } from "next";
import Link from "next/link";

const title = "Resonate Solutions | Practical Digital Systems for Small Businesses";
const description =
  "Resonate Solutions builds customer-ready webpages, business information tools, guided intake experiences, hosting, managed updates, and practical workflows for small businesses.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    images: ["/assets/resonate-logo-flat.png"]
  }
};

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <p className={`text-xs font-black uppercase tracking-[0.2em] ${light ? "text-gold" : "text-coral"}`}>{children}</p>
      <span className={`h-px w-16 ${light ? "bg-white/25" : "bg-coral/35"}`} aria-hidden="true" />
    </div>
  );
}

function DotList({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 text-sm leading-6 ${light ? "text-white/78" : "text-muted"}`}>
          <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${light ? "bg-gold" : "bg-coral"}`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const solutionAreas = [
  {
    number: "01",
    title: "Customer experiences",
    copy: "Clear, mobile-friendly pages that put the right information and next action in front of customers immediately.",
    items: ["Services and menus", "Hours and photos", "Quote and intake questions", "QR-friendly, shareable links"]
  },
  {
    number: "02",
    title: "Business information systems",
    copy: "Structured tools and workflows that help a business maintain one reliable source of information.",
    items: ["Guided forms", "Review-first change requests", "Organized business records", "Owner control center in development"]
  },
  {
    number: "03",
    title: "Workflow and managed support",
    copy: "Practical automation, managed updates, hosting, and workflow improvements that reduce repetitive work.",
    items: ["Managed page updates", "Webpage hosting", "Page and link-health checks", "Human review where it matters"]
  }
];

export default function ResonateHome() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Resonate Solutions",
    url: "https://resonate.solutions",
    email: "questions@resonate.solutions",
    description,
    areaServed: "Northwest Arkansas"
  };

  return (
    <main className="overflow-hidden bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <section className="relative border-b border-line">
        <div className="pointer-events-none absolute -right-52 -top-56 h-[44rem] w-[44rem] rounded-full border border-coral/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-32 h-[29rem] w-[29rem] rounded-full border border-gold/20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <SectionLabel>Resonate Solutions</SectionLabel>
            <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-ink md:text-7xl">
              Make your business easier to understand<span className="text-coral">—and easier to run.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Resonate Solutions builds practical digital systems that organize customer-facing information,
              reduce repetitive work, and help small businesses keep moving.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#solutions" className="rounded-full bg-coral px-7 py-4 text-center font-black text-white shadow-[0_16px_38px_rgba(217,120,86,0.25)] transition hover:-translate-y-0.5 hover:bg-ink">Explore our solutions</a>
              <a href="#work" className="rounded-full border-2 border-ink px-7 py-4 text-center font-black text-ink transition hover:bg-ink hover:text-white">See real work</a>
            </div>
            <div className="mt-8 max-w-xl border-l-2 border-gold pl-5">
              <Link className="font-black text-ink underline decoration-coral decoration-2 underline-offset-4" href="/checkout?plan=review">Get a Free Page Plan</Link>
              <p className="mt-2 text-sm leading-6 text-muted">Tell us about your business and receive a recommended page and support plan before you purchase. It is a planning step—not a free custom website.</p>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[410px]">
            <div className="absolute -left-8 top-16 z-10 hidden rounded-2xl border border-line bg-white px-4 py-3 text-xs font-black text-ink shadow-soft sm:block">Real customer experience</div>
            <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-[#3a2418] bg-white shadow-[0_30px_90px_rgba(58,36,24,0.22)]">
              <div className="flex items-center justify-between bg-[#3a2418] px-6 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white"><span>MenuPilot</span><span>Live page</span></div>
              <div className="relative min-h-[235px] overflow-hidden">
                <img src="/assets/mellow-moose-og-smashburger.jpg" alt="Mellow Moose smash burger" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b12]/90 via-[#2d1b12]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="rounded-full bg-coral px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]">Open today</span>
                  <h2 className="mt-4 text-3xl font-black">Mellow Moose Burgers</h2>
                  <p className="mt-1 text-sm text-white/80">Smash burgers · Siloam Springs, AR</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 bg-[#fffaf4] p-4 text-center text-xs font-black text-ink">
                {['Menu', 'Call', 'Map', 'Share'].map((action, index) => <span key={action} className={`rounded-xl px-2 py-3 ${index === 0 ? "bg-coral text-white" : "border border-line bg-white"}`}>{action}</span>)}
              </div>
              <div className="border-t border-line bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">One useful customer page</p>
                <p className="mt-2 text-sm leading-6 text-muted">Menus, hours, photos, links, and the next action—without the hunt.</p>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-xs font-black uppercase tracking-[0.13em] text-muted">MenuPilot — a Resonate Solutions product</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>The problem</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Your customers shouldn’t have to hunt for the right information.</h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-black text-ink">Business information gets scattered across:</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {['Google profiles', 'Facebook pages', 'PDFs', 'Printed menus', 'Booking tools', 'Old websites', 'Customer messages', 'Internal notes'].map((item) => <span key={item} className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold text-muted">{item}</span>)}
              </div>
              <p className="mt-6 max-w-xl leading-7 text-muted">Every copy drifts a little further from the truth. Nobody decides to let it happen—it simply accumulates.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-3xl border border-line bg-cream p-7">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">For customers</p>
                <h3 className="mt-3 text-xl font-black text-ink">Uncertainty causes drop-off.</h3>
                <p className="mt-3 text-sm leading-6 text-muted">They guess, call to double-check, or move on to another business.</p>
              </article>
              <article className="rounded-3xl bg-ink p-7 text-white">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-gold">For owners</p>
                <h3 className="mt-3 text-xl font-black">The same work repeats.</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">The same facts get updated, explained, and corrected in several places.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>What we build</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Three connected areas of practical work.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">We start with the business problem. Pages, workflows, automation, and managed support follow from there.</p>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {solutionAreas.map((area, index) => (
              <article key={area.number} className={`rounded-[1.75rem] p-8 ${index === 0 ? "bg-ink text-white" : "border border-line bg-white"}`}>
                <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? "text-gold" : "text-coral"}`}>Area {area.number}</p>
                <h3 className={`mt-4 text-2xl font-black ${index === 0 ? "text-white" : "text-ink"}`}>{area.title}</h3>
                <p className={`mt-4 text-sm leading-6 ${index === 0 ? "text-white/70" : "text-muted"}`}>{area.copy}</p>
                <div className="mt-7"><DotList items={area.items} light={index === 0} /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>Real Resonate work</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Different businesses. Different problems. Practical solutions.</h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[1.75rem] border border-line bg-cream shadow-sm">
              <div className="relative h-64 overflow-hidden">
                <img src="/assets/mellow-moose-food-truck.jpg" alt="Mellow Moose food truck" className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <p className="absolute bottom-5 left-6 text-xs font-black uppercase tracking-[0.15em] text-white">MenuPilot · Mellow Moose</p>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-ink">A menu customers can actually use.</h3>
                <p className="mt-4 leading-7 text-muted">A mobile-first page for menu discovery, current hours, photos, calls, directions, and shareable links.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/m/mellow-moose-burgers" className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white hover:bg-coral">Open live example</Link>
                  <Link href="/menupilot" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-black text-ink hover:border-coral">Explore MenuPilot</Link>
                </div>
              </div>
            </article>
            <article className="overflow-hidden rounded-[1.75rem] bg-[#2d1b12] text-white shadow-sm">
              <div className="grid h-64 grid-cols-[1.15fr_0.85fr] overflow-hidden bg-[#f2e6d5]">
                <img src="/assets/excellent-pins/lovable/hero-pin.jpg" alt="Custom pin example" className="h-full w-full object-cover" />
                <div className="grid grid-rows-2 gap-px bg-[#2d1b12]/15">
                  <img src="/assets/excellent-pins/lovable/finishes.jpg" alt="Custom pin finish options" className="h-full w-full object-cover" />
                  <img src="/assets/excellent-pins/lovable/pin-badge.jpg" alt="Custom badge example" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="p-8">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-gold">Excellent Pins &amp; Badges</p>
                <h3 className="mt-3 text-3xl font-black">Answering questions before the call.</h3>
                <p className="mt-4 leading-7 text-white/70">A guided experience for product education, visual decision support, and structured quote intake.</p>
                <Link href="/excellent-pins" className="mt-7 inline-flex rounded-full bg-coral px-5 py-3 text-sm font-black text-white hover:bg-white hover:text-ink">See the implementation</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>How Resonate works</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">A short, human process.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {["Tell us what is slowing the business down", "We identify the right practical solution", "We design and prepare the system", "We launch it with the right level of support"].map((step, index) => (
              <li key={step} className="border-t-2 border-ink pt-5"><span className="text-xs font-black uppercase tracking-[0.16em] text-coral">0{index + 1}</span><p className="mt-3 font-black leading-6 text-ink">{step}</p></li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl leading-7 text-muted">Some businesses need a focused customer page. Others need guided intake, information management, automation, or ongoing support. The solution should fit the workflow—not the other way around.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -bottom-56 -right-48 h-[36rem] w-[36rem] rounded-full border border-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 -right-28 h-[24rem] w-[24rem] rounded-full border border-coral/30" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div><span className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-gold">In development</span><h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">One clear place for business information.</h2></div>
          <p className="max-w-3xl text-lg leading-8 text-white/72">Resonate is building toward one clear place where owners can manage hours, menus, services, and other customer-facing information across supported channels. Specific integrations will be announced only when they are ready.</p>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>Simple pricing path</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><h2 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Every custom page starts with Launch.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">The one-time build comes first. Then choose the ongoing support that matches how you want the page handled.</p></div>
            <div className="rounded-3xl bg-ink px-8 py-6 text-white"><p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Launch</p><p className="mt-2 text-4xl font-black">$399 <span className="text-sm text-white/65">one-time</span></p></div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-line bg-cream p-7"><p className="text-xs font-black uppercase tracking-[0.15em] text-muted">Self-managed</p><h3 className="mt-3 text-2xl font-black text-ink">No monthly plan</h3><p className="mt-4 text-sm leading-6 text-muted">You take responsibility for hosting, maintenance, and updates after delivery.</p></article>
            <article className="rounded-3xl border border-line bg-cream p-7"><p className="text-xs font-black uppercase tracking-[0.15em] text-brandDark">Monthly hosting</p><h3 className="mt-3 text-2xl font-black text-ink">Webpage Hosting</h3><p className="mt-3 text-3xl font-black text-ink">$17.99 <span className="text-sm text-muted">/month</span></p><div className="mt-5"><DotList items={["Secure hosting and SSL", "Routine platform maintenance", "Basic uptime monitoring", "No content updates"]} /></div></article>
            <article className="relative rounded-3xl border-2 border-coral bg-cream p-7 shadow-[0_20px_60px_rgba(217,120,86,0.12)]"><span className="absolute -top-3 right-6 rounded-full bg-coral px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white">Hosting included</span><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Hosting + updates</p><h3 className="mt-3 text-2xl font-black text-ink">Managed Page</h3><p className="mt-3 text-3xl font-black text-ink">$79.99 <span className="text-sm text-muted">/month</span></p><div className="mt-5"><DotList items={["Up to four standard update requests", "Monthly page review", "Priority turnaround", "Basic page and link-health checks"]} /></div></article>
          </div>
          <p className="mt-8 max-w-4xl text-sm leading-6 text-muted">When a monthly option is selected, the Launch fee and first month are charged at checkout. Managed Page includes hosting. Need frequent or complex updates? Custom management is available by quote.</p>
          <Link href="/pricing" className="mt-8 inline-flex rounded-full border-2 border-ink px-6 py-3.5 text-sm font-black text-ink transition hover:bg-ink hover:text-white">See plans and what’s included</Link>
        </div>
      </section>

      <section id="free-page-plan" className="relative overflow-hidden bg-[#2d1b12] text-white">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <div className="flex justify-center"><SectionLabel light>Start here</SectionLabel></div>
          <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Not sure what your business needs? Start with a free plan.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">Share your business details once and receive a recommended page, workflow, and support approach before you purchase.</p>
          <Link href="/checkout?plan=review" className="mt-9 inline-flex rounded-full bg-coral px-7 py-4 font-black text-white shadow-[0_16px_40px_rgba(217,120,86,0.3)] transition hover:-translate-y-0.5 hover:bg-white hover:text-ink">Get a Free Page Plan</Link>
          <p className="mt-5 text-xs text-white/55">A recommendation and planning step—not a free custom website.</p>
        </div>
      </section>
    </main>
  );
}
