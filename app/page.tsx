import type { Metadata } from "next";
import Link from "next/link";

const title = "Resonate Solutions | Better Webpages and Business Tools";
const description =
  "Resonate Solutions builds clear webpages and straightforward tools that help small businesses win customers, answer questions faster, and spend less time repeating the same work.";

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
    number: "For customers",
    title: "Help customers choose you",
    copy: "Put the information people need in one clear, mobile-friendly place, then make the next step obvious.",
    items: ["Services, menus, and prices", "Hours, photos, and directions", "Call, order, book, or request a quote", "One easy link to share anywhere"]
  },
  {
    number: "For new leads",
    title: "Turn questions into good leads",
    copy: "Guide customers to the right service and collect the useful details before you call or email them back.",
    items: ["Quote and request forms", "Questions tailored to your service", "Cleaner customer details", "Less back-and-forth before the sale"]
  },
  {
    number: "After launch",
    title: "Keep it current without the hassle",
    copy: "Choose the level of help you want after launch, from reliable hosting to ongoing page updates.",
    items: ["Secure webpage hosting", "Managed text and photo updates", "Routine page and link checks", "A real person to contact when you need help"]
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
              Give customers the answers they need.<span className="text-coral"> Give them a clear reason to choose you.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              We build focused webpages and simple business tools that help people understand what you offer,
              take the next step, and stop calling you with the same basic questions.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#solutions" className="rounded-full bg-coral px-7 py-4 text-center font-black text-white shadow-[0_16px_38px_rgba(217,120,86,0.25)] transition hover:-translate-y-0.5 hover:bg-ink">See what we can build</a>
              <a href="#work" className="rounded-full border-2 border-ink px-7 py-4 text-center font-black text-ink transition hover:bg-ink hover:text-white">View customer examples</a>
            </div>
            <div className="mt-8 max-w-xl border-l-2 border-gold pl-5">
              <Link className="font-black text-ink underline decoration-coral decoration-2 underline-offset-4" href="/checkout?plan=review">Get a Free Page Plan</Link>
              <p className="mt-2 text-sm leading-6 text-muted">Tell us about your business. We’ll recommend the page and support option that fits before you spend anything.</p>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[410px]">
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
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Everything customers need</p>
                <p className="mt-2 text-sm leading-6 text-muted">See the menu, check the hours, call, or get directions in a few taps.</p>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-xs font-black uppercase tracking-[0.13em] text-muted">Built by Resonate with MenuPilot</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>What it costs you</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Confused customers call, leave, or choose someone else.</h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-black text-ink">Your business details end up spread across:</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {['Google profiles', 'Facebook pages', 'PDFs', 'Printed menus', 'Booking tools', 'Old websites', 'Customer messages', 'Internal notes'].map((item) => <span key={item} className="rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold text-muted">{item}</span>)}
              </div>
              <p className="mt-6 max-w-xl leading-7 text-muted">Hours change. Prices move. Services get added. Before long, customers find different answers depending on where they look.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-3xl border border-line bg-cream p-7">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">For customers</p>
                <h3 className="mt-3 text-xl font-black text-ink">No clear answer can mean no sale.</h3>
                <p className="mt-3 text-sm leading-6 text-muted">If people cannot quickly confirm the details, many will move on to a business that makes it easier.</p>
              </article>
              <article className="rounded-3xl bg-ink p-7 text-white">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-gold">For owners</p>
                <h3 className="mt-3 text-xl font-black">You answer questions your page should handle.</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">Hours, prices, directions, services, and availability keep taking time away from the work that pays.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>How we help</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">What Resonate can do for your business.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">You do not need more complicated software. You need customers to find the right answer and take the right next step.</p>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {solutionAreas.map((area, index) => (
              <article key={area.number} className={`rounded-[1.75rem] p-8 ${index === 0 ? "bg-ink text-white" : "border border-line bg-white"}`}>
                <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? "text-gold" : "text-coral"}`}>{area.number}</p>
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
          <SectionLabel>See it in action</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Built around the way each business actually sells.</h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[1.75rem] border border-line bg-cream shadow-sm">
              <div className="relative h-64 overflow-hidden">
                <img src="/assets/mellow-moose-food-truck.jpg" alt="Mellow Moose food truck" className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <p className="absolute bottom-5 left-6 text-xs font-black uppercase tracking-[0.15em] text-white">MenuPilot · Mellow Moose</p>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-ink">One page takes customers from hungry to ordering.</h3>
                <p className="mt-4 leading-7 text-muted">The menu, current hours, food photos, phone number, and directions are all easy to find on a phone.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/m/mellow-moose-burgers" className="rounded-full bg-ink px-5 py-3 text-sm font-black text-white hover:bg-coral">Open live example</Link>
                  <Link href="/menupilot" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-black text-ink hover:border-coral">Explore MenuPilot</Link>
                </div>
              </div>
            </article>
            <article className="overflow-hidden rounded-[1.75rem] bg-[#2d1b12] text-white shadow-sm">
              <div className="grid h-64 grid-cols-[1.15fr_0.85fr] overflow-hidden bg-[#f2e6d5]">
                <img src="/assets/excellent-pins/lovable/pin-hard-enamel.jpg" alt="Red and navy hard-enamel pin example" className="h-full w-full object-cover" />
                <div className="grid grid-rows-2 gap-px bg-[#2d1b12]/15">
                  <img src="/assets/excellent-pins/lovable/finishes.jpg" alt="Custom pin finish options" className="h-full w-full object-cover" />
                  <img src="/assets/excellent-pins/lovable/pin-badge.jpg" alt="Custom badge example" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="p-8">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-gold">Excellent Pins &amp; Badges</p>
                <h3 className="mt-3 text-3xl font-black">Buyers get answers before requesting a quote.</h3>
                <p className="mt-4 leading-7 text-white/70">Customers can see their options, understand the differences, and send the details needed for an accurate quote.</p>
                <Link href="/excellent-pins" className="mt-7 inline-flex rounded-full bg-coral px-5 py-3 text-sm font-black text-white hover:bg-white hover:text-ink">See how it works</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>A simple process</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Tell us where customers get stuck. We’ll build the page that fixes it.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {["Show us what customers ask about most", "We recommend what will make the biggest difference", "You review everything before it goes live", "We launch it with the support level you choose"].map((step, index) => (
              <li key={step} className="border-t-2 border-ink pt-5"><span className="text-xs font-black uppercase tracking-[0.16em] text-coral">0{index + 1}</span><p className="mt-3 font-black leading-6 text-ink">{step}</p></li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl leading-7 text-muted">No bloated package and no technology for technology’s sake. We recommend the smallest useful solution that makes buying from your business easier.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -bottom-56 -right-48 h-[36rem] w-[36rem] rounded-full border border-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 -right-28 h-[24rem] w-[24rem] rounded-full border border-coral/30" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div><span className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-gold">Coming next</span><h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">Update it once. Keep the details customers see consistent.</h2></div>
          <p className="max-w-3xl text-lg leading-8 text-white/72">We are working toward one owner-friendly place to update hours, menus, services, and other customer details across the channels Resonate supports. We will only announce connections after they are ready to use.</p>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>What it costs</SectionLabel>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><h2 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Start with the $399 build. Add monthly help only if you want it.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Every custom page begins with Launch. After that, handle it yourself, pay only for hosting, or let Resonate keep it updated.</p></div>
            <div className="rounded-3xl bg-ink px-8 py-6 text-white"><p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Launch</p><p className="mt-2 text-4xl font-black">$399 <span className="text-sm text-white/65">one-time</span></p></div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-line bg-cream p-7"><p className="text-xs font-black uppercase tracking-[0.15em] text-muted">Handle it yourself</p><h3 className="mt-3 text-2xl font-black text-ink">No monthly bill</h3><p className="mt-4 text-sm leading-6 text-muted">We deliver the finished page. You take care of hosting, maintenance, and future changes.</p></article>
            <article className="rounded-3xl border border-line bg-cream p-7"><p className="text-xs font-black uppercase tracking-[0.15em] text-brandDark">Keep it online</p><h3 className="mt-3 text-2xl font-black text-ink">Webpage Hosting</h3><p className="mt-3 text-3xl font-black text-ink">$17.99 <span className="text-sm text-muted">/month</span></p><p className="mt-4 text-sm leading-6 text-muted">We host the page and maintain the platform. You handle content changes.</p><div className="mt-5"><DotList items={["Secure hosting and SSL", "Routine platform maintenance", "Basic uptime monitoring", "No content updates"]} /></div></article>
            <article className="relative rounded-3xl border-2 border-coral bg-cream p-7 shadow-[0_20px_60px_rgba(217,120,86,0.12)]"><span className="absolute -top-3 right-6 rounded-full bg-coral px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white">Hosting included</span><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Keep it handled</p><h3 className="mt-3 text-2xl font-black text-ink">Managed Page</h3><p className="mt-3 text-3xl font-black text-ink">$79.99 <span className="text-sm text-muted">/month</span></p><p className="mt-4 text-sm leading-6 text-muted">We host the page and handle up to four standard update requests each month.</p><div className="mt-5"><DotList items={["Text, photo, hours, menu, and service updates", "Monthly page review", "Priority turnaround", "Basic page and link-health checks"]} /></div></article>
          </div>
          <p className="mt-8 max-w-4xl text-sm leading-6 text-muted">When a monthly option is selected, the Launch fee and first month are charged at checkout. Managed Page includes hosting. Need frequent or complex updates? Custom management is available by quote.</p>
          <Link href="/pricing" className="mt-8 inline-flex rounded-full border-2 border-ink px-6 py-3.5 text-sm font-black text-ink transition hover:bg-ink hover:text-white">Compare all pricing</Link>
        </div>
      </section>

      <section id="free-page-plan" className="relative overflow-hidden bg-[#2d1b12] text-white">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <div className="flex justify-center"><SectionLabel light>Start here</SectionLabel></div>
          <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Let’s figure out what would help your business most.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">Tell us what you sell, what customers ask, and where the confusion happens. We’ll recommend the page and support option that makes sense.</p>
          <Link href="/checkout?plan=review" className="mt-9 inline-flex rounded-full bg-coral px-7 py-4 font-black text-white shadow-[0_16px_40px_rgba(217,120,86,0.3)] transition hover:-translate-y-0.5 hover:bg-white hover:text-ink">Get Your Free Page Plan</Link>
          <p className="mt-5 text-xs text-white/55">You’ll receive a free recommendation, not a free custom website.</p>
        </div>
      </section>
    </main>
  );
}
