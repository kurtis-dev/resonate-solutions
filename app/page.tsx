import type { Metadata } from "next";
import Link from "next/link";

const title = "Resonate Solutions | Practical Digital Systems for Small Businesses";
const description =
  "Resonate Solutions builds practical digital systems that help customers understand what you offer, take the right next step, and reduce repetitive work.";

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
    items: ["Services, menus, and key details", "Hours, photos, and directions", "Call, order, book, or request a quote", "One easy link to share anywhere"]
  },
  {
    number: "For new leads",
    title: "Turn questions into qualified leads",
    copy: "Guide customers to the right service and collect the useful details before you call or email them back.",
    items: ["Guided intake and quote requests", "Questions tailored to your service", "Clearer customer details", "Less back-and-forth before the sale"]
  },
  {
    number: "For your team",
    title: "Keep business information current",
    copy: "Organize important details and make changes without repeating the same work across scattered places.",
    items: ["Structured business information", "Managed change requests", "Publishing workflows", "Tools that reduce repeated updates"]
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
    <main className="overflow-hidden bg-[#fffdf9]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <section className="relative border-b border-[#f3d8ca] bg-[radial-gradient(circle_at_12%_14%,rgba(255,211,94,0.22),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(255,108,76,0.2),transparent_31%),linear-gradient(135deg,#fffdf9_0%,#fff5ee_54%,#f3fbf8_100%)]">
        <div className="pointer-events-none absolute -right-52 -top-56 h-[44rem] w-[44rem] rounded-full border border-[#ff6c4c]/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-32 h-[29rem] w-[29rem] rounded-full border border-[#f5bd35]/35" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-[#7bd7c4]/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <SectionLabel>Resonate Solutions</SectionLabel>
            <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-ink md:text-7xl">
              Make your business easier to understand.<span className="text-[#f05f3b]"> Make it easier to run.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Resonate Solutions builds practical digital systems that help customers understand what you offer,
              take the right next step, and reduce the repetitive work that slows your business down.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#solutions" className="rounded-full bg-[#f05f3b] px-7 py-4 text-center font-black text-white shadow-[0_18px_42px_rgba(240,95,59,0.28)] transition hover:-translate-y-0.5 hover:bg-ink">See what we can build</a>
              <a href="#work" className="rounded-full border-2 border-ink bg-white/65 px-7 py-4 text-center font-black text-ink transition hover:bg-ink hover:text-white">View customer examples</a>
            </div>
            <div className="mt-8 max-w-xl border-l-2 border-[#f5bd35] pl-5">
              <Link className="font-black text-ink underline decoration-[#f05f3b] decoration-2 underline-offset-4" href="/checkout?plan=review">Start a project review</Link>
              <p className="mt-2 text-sm leading-6 text-muted">Tell us where the business gets stuck. We will recommend the most useful next step.</p>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[410px]">
            <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-ink bg-white shadow-[0_34px_100px_rgba(68,53,120,0.2)]">
              <div className="flex items-center justify-between bg-ink px-6 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white"><span>MenuPilot</span><span className="text-[#ffd35e]">Live page</span></div>
              <div className="relative min-h-[235px] overflow-hidden">
                <img src="/assets/mellow-moose-og-smashburger.jpg" alt="Mellow Moose smash burger" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b12]/90 via-[#2d1b12]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="rounded-full bg-[#f05f3b] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]">Open today</span>
                  <h2 className="mt-4 text-3xl font-black">Mellow Moose Burgers</h2>
                  <p className="mt-1 text-sm text-white/80">Smash burgers · Siloam Springs, AR</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 bg-[#fff7f1] p-4 text-center text-xs font-black text-ink">
                {['Menu', 'Call', 'Map', 'Share'].map((action, index) => <span key={action} className={`rounded-xl px-2 py-3 ${index === 0 ? "bg-[#f05f3b] text-white" : "border border-[#f0d6c8] bg-white"}`}>{action}</span>)}
              </div>
              <div className="border-t border-line bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Everything customers need</p>
                <p className="mt-2 text-sm leading-6 text-muted">See the menu, check the hours, call, or get directions in a few taps.</p>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-xs font-black uppercase tracking-[0.13em] text-muted">A live MenuPilot example built by Resonate</figcaption>
          </figure>
        </div>
      </section>

      <section className="relative border-b border-[#efe1d9] bg-white">
        <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#b9b5ff]/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>Where business gets harder</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Confused customers call, leave, or choose someone else.</h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-black text-ink">Your business details end up spread across:</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {['Google profiles', 'Facebook pages', 'PDFs', 'Printed menus', 'Booking tools', 'Old websites', 'Customer messages', 'Internal notes'].map((item, index) => <span key={item} className={`rounded-full border px-4 py-2 text-sm font-semibold text-ink ${index % 3 === 0 ? "border-[#ffc7b7] bg-[#fff1ec]" : index % 3 === 1 ? "border-[#b9e5da] bg-[#edf9f6]" : "border-[#ddd7ff] bg-[#f4f2ff]"}`}>{item}</span>)}
              </div>
              <p className="mt-6 max-w-xl leading-7 text-muted">Hours change. Prices move. Services get added. Before long, customers find different answers depending on where they look.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-3xl border border-[#f4d685] bg-[#fff8dd] p-7 shadow-[0_18px_50px_rgba(226,177,56,0.1)]">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#a76900]">For customers</p>
                <h3 className="mt-3 text-xl font-black text-ink">No clear answer can mean no sale.</h3>
                <p className="mt-3 text-sm leading-6 text-muted">If people cannot quickly confirm the details, many will move on to a business that makes it easier.</p>
              </article>
              <article className="relative overflow-hidden rounded-3xl bg-[#27243f] p-7 text-white shadow-[0_22px_60px_rgba(39,36,63,0.2)]">
                <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ff6c4c,#ffd35e,#7bd7c4)]" aria-hidden="true" />
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ffd35e]">For owners</p>
                <h3 className="mt-3 text-xl font-black">You answer questions your page should handle.</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">Hours, prices, directions, services, and availability keep taking time away from the work that pays.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 border-b border-[#d9eee7] bg-[linear-gradient(180deg,#f3fbf8_0%,#fffdf9_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>How we help</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">What Resonate can do for your business.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">You do not need more complicated software. You need the right information, the right next step, and less repetitive work.</p>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {solutionAreas.map((area, index) => (
              <article key={area.number} className={`relative overflow-hidden rounded-[1.75rem] border p-8 shadow-[0_20px_55px_rgba(46,52,49,0.08)] ${index === 0 ? "border-[#27243f] bg-[#27243f] text-white" : index === 1 ? "border-[#ffc8b8] bg-[#fff1ec]" : "border-[#a9dfd3] bg-[#eaf8f4]"}`}>
                <span className={`absolute inset-x-0 top-0 h-1 ${index === 0 ? "bg-[linear-gradient(90deg,#ff6c4c,#ffd35e)]" : index === 1 ? "bg-[#ff6c4c]" : "bg-[#4bb9a2]"}`} aria-hidden="true" />
                <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? "text-[#ffd35e]" : index === 1 ? "text-[#d94d2d]" : "text-[#1f7566]"}`}>{area.number}</p>
                <h3 className={`mt-4 text-2xl font-black ${index === 0 ? "text-white" : "text-ink"}`}>{area.title}</h3>
                <p className={`mt-4 text-sm leading-6 ${index === 0 ? "text-white/70" : "text-muted"}`}>{area.copy}</p>
                <div className="mt-7"><DotList items={area.items} light={index === 0} /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 border-b border-[#f1d8cc] bg-[radial-gradient(circle_at_92%_8%,rgba(185,181,255,0.23),transparent_25%),radial-gradient(circle_at_8%_90%,rgba(255,211,94,0.18),transparent_27%),#fff8f3]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>See it in action</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Built around the way each business actually sells.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">Different businesses. Different problems. Practical systems built around each one.</p>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[1.75rem] border border-[#ffc8b8] bg-white shadow-[0_24px_70px_rgba(240,95,59,0.12)]">
              <div className="relative h-64 overflow-hidden">
                <img src="/assets/mellow-moose-food-truck.jpg" alt="Mellow Moose food truck" className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <p className="absolute bottom-5 left-6 text-xs font-black uppercase tracking-[0.15em] text-white">MenuPilot · Mellow Moose</p>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-ink">One page takes customers from hungry to ordering.</h3>
                <p className="mt-4 leading-7 text-muted">The menu, current hours, food photos, phone number, and directions are all easy to find on a phone.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/m/mellow-moose-burgers" className="rounded-full bg-[#f05f3b] px-5 py-3 text-sm font-black text-white hover:bg-ink">Open live example</Link>
                  <Link href="/menupilot" className="rounded-full border border-[#ffc8b8] bg-[#fff7f2] px-5 py-3 text-sm font-black text-ink hover:border-[#f05f3b]">Explore MenuPilot</Link>
                </div>
              </div>
            </article>
            <article className="overflow-hidden rounded-[1.75rem] border border-[#4b466d] bg-[#27243f] text-white shadow-[0_26px_75px_rgba(39,36,63,0.2)]">
              <div className="grid h-72 grid-cols-[1.18fr_0.82fr] gap-2 overflow-hidden bg-[linear-gradient(135deg,#ffe7dc,#fff6d9_48%,#e7f8f4)] p-3">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <img src="/assets/excellent-pins/lovable/pin-hard-enamel.jpg" alt="Red and navy hard-enamel pin example" className="h-full w-full object-contain object-center" />
                </div>
                <div className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                  <div className="min-h-0 overflow-hidden rounded-2xl bg-[#fff5e8] shadow-sm">
                    <img src="/assets/excellent-pins/lovable/finishes.jpg" alt="Custom pin finish options" className="h-full w-full object-contain object-center" />
                  </div>
                  <div className="min-h-0 overflow-hidden rounded-2xl bg-white shadow-sm">
                    <img src="/assets/excellent-pins/lovable/pin-badge.jpg" alt="Custom badge example" className="h-full w-full object-contain object-center" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ffd35e]">Excellent Pins &amp; Badges</p>
                <h3 className="mt-3 text-3xl font-black">Buyers get answers before requesting a quote.</h3>
                <p className="mt-4 leading-7 text-white/70">Customers can see their options, understand the differences, and send the details needed for an accurate quote.</p>
                <Link href="/excellent-pins" className="mt-7 inline-flex rounded-full bg-[#f05f3b] px-5 py-3 text-sm font-black text-white hover:bg-white hover:text-ink">See how it works</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-b border-[#eee5df] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <SectionLabel>A simple process</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Tell us where the business gets stuck. We will build the right system to fix it.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {["Show us where customers or staff lose time", "We recommend the smallest useful system", "You review everything before it goes live", "We launch it and stay available when you need help"].map((step, index) => (
              <li key={step} className={`rounded-2xl border p-5 ${index === 0 ? "border-[#ffc8b8] bg-[#fff1ec]" : index === 1 ? "border-[#f2dc92] bg-[#fff9df]" : index === 2 ? "border-[#a9dfd3] bg-[#eaf8f4]" : "border-[#d7d2ff] bg-[#f3f1ff]"}`}><span className="text-xs font-black uppercase tracking-[0.16em] text-[#f05f3b]">0{index + 1}</span><p className="mt-3 font-black leading-6 text-ink">{step}</p></li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl leading-7 text-muted">No bloated package and no technology for technology's sake. We recommend the smallest useful solution that makes the business easier to understand and run.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#27243f] text-white">
        <div className="pointer-events-none absolute -bottom-56 -right-48 h-[36rem] w-[36rem] rounded-full border border-[#b9b5ff]/30" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 -right-28 h-[24rem] w-[24rem] rounded-full border border-[#ff6c4c]/45" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#7bd7c4]/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div><span className="inline-flex rounded-full border border-[#ffd35e]/40 bg-[#ffd35e]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#ffd35e]">Coming next</span><h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">Update it once. Keep the details customers see consistent.</h2></div>
          <p className="max-w-3xl text-lg leading-8 text-white/72">We are working toward one owner-friendly place to update hours, menus, services, and other customer details across the channels Resonate supports. We will only announce connections after they are ready to use.</p>
        </div>
      </section>

      <section id="free-page-plan" className="relative overflow-hidden bg-[linear-gradient(135deg,#f05f3b_0%,#ff7d57_48%,#e85089_100%)] text-white">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-white/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 top-4 h-60 w-60 rounded-full bg-[#ffd35e]/30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <div className="flex justify-center"><SectionLabel light>Start here</SectionLabel></div>
          <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Let's figure out what would help your business most.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">Tell us what you sell, where customers get confused, and what work keeps repeating. We will recommend the most useful next step.</p>
          <Link href="/checkout?plan=review" className="mt-9 inline-flex rounded-full bg-white px-7 py-4 font-black text-ink shadow-[0_18px_45px_rgba(97,35,37,0.25)] transition hover:-translate-y-0.5 hover:bg-[#fff5db]">Start Your Project Review</Link>
          <p className="mt-5 text-xs font-semibold text-white/75">A short business review comes before any recommendation.</p>
        </div>
      </section>
    </main>
  );
}
