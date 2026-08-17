import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, pageMetadata, questionsEmail, siteName, siteUrl } from "@/lib/seo";

const title = "Small Business Web Design & Managed Updates | Resonate Solutions";
const description =
  "Resonate Solutions builds mobile-friendly web pages, online menus, intake forms, and managed updates around what each small business actually needs.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/"
});

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
    title: "Give customers one clear place",
    copy: "Put the answers people need in one mobile-friendly place and make the next step easy to see.",
    items: ["Services, menus, and key details", "Hours, photos, and directions", "Call, order, book, or request a quote", "One easy link to share anywhere"]
  },
  {
    number: "For new inquiries",
    title: "Make the next step easier",
    copy: "Help people call, order, book, or send the details you need without making them hunt for the right link.",
    items: ["Guided intake and quote requests", "Questions matched to your service", "Contact and project details in one submission", "Fewer missing answers before follow-up"]
  },
  {
    number: "For owners",
    title: "Keep it current without doing it all yourself",
    copy: "You decide what changes. Resonate can handle routine page updates and basic checks when you want ongoing help.",
    items: ["Text, photo, hours, menu, and service updates", "Monthly page review", "Basic link and page-health checks", "Hosting and routine platform maintenance"]
  }
];

const approachCards = [
  {
    title: "Built for your business",
    copy: "Not squeezed into a generic template. The page starts with what customers need to find and what the owner needs to make easier."
  },
  {
    title: "Predictable website costs",
    copy: "Resonate webpage pricing is not based on how many people visit the page or how many customers the business serves."
  },
  {
    title: "A real person helping you",
    copy: "When something needs to change, the owner should not have to figure out another website builder alone."
  },
  {
    title: "Built to keep improving",
    copy: "Resonate keeps developing practical tools that make customer-facing business information easier to maintain."
  }
];

export default function ResonateHome() {
  const siteIdentitySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: absoluteUrl("/assets/resonate-logo-flat.png"),
        email: questionsEmail,
        description,
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Northwest Arkansas"
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: questionsEmail
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-US"
      }
    ]
  };

  return (
    <main className="overflow-hidden bg-[#fffdf9]">
      <JsonLd data={siteIdentitySchema} />

      <section className="relative border-b border-[#f3d8ca] bg-[radial-gradient(circle_at_12%_14%,rgba(255,211,94,0.22),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(255,108,76,0.2),transparent_31%),linear-gradient(135deg,#fffdf9_0%,#fff5ee_54%,#f3fbf8_100%)]">
        <div className="pointer-events-none absolute -right-52 -top-56 h-[44rem] w-[44rem] rounded-full border border-[#ff6c4c]/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-32 h-[29rem] w-[29rem] rounded-full border border-[#f5bd35]/35" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-[#7bd7c4]/15 blur-3xl" aria-hidden="true" />
        <div className="container-page relative grid gap-14 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <SectionLabel>Clear answers for your customers</SectionLabel>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#5d55a7]">
              Small business web design <span aria-hidden="true">&bull;</span> online menu pages <span aria-hidden="true">&bull;</span> managed website updates
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-ink md:text-7xl">
              Your customers should not have to hunt for the right answer.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Resonate Solutions designs mobile-friendly web pages, online menus and service pages, customer intake forms,
              and managed website updates around the way each small business actually works. We make important customer
              information easier to find and easier for owners to keep current.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#work" className="btn-coral px-7 py-4">See what your page could look like</a>
              <Link href="/m/mellow-moose-burgers" className="btn-outline-ink bg-white/65 px-7 py-4">View a live example</Link>
            </div>
            <div className="mt-8 grid max-w-2xl gap-2 border-l-2 border-[#f5bd35] pl-5 text-sm font-black text-ink sm:grid-cols-3">
              <span>Fewer repeated questions.</span>
              <span>Fewer outdated details.</span>
              <span>A clearer next step.</span>
            </div>
          </div>

          <figure className="rise-in relative mx-auto w-full max-w-[410px]">
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
        <div className="container-page relative py-16 md:py-24">
          <SectionLabel>Where business gets harder</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Confused customers call, leave, or choose someone else.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">Your business changes faster than your online information does. The correct answer may be clear to you and still be hard for a customer to find.</p>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-black text-ink">The same business details live in different places.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { number: "01", title: "Search and social", detail: "Google Business and Facebook", color: "border-[#ffb8a5] bg-[#fff2ed] text-[#c9482b]" },
                  { number: "02", title: "Menus and documents", detail: "Printed menus and PDFs", color: "border-[#f0d47d] bg-[#fff9df] text-[#9a6500]" },
                  { number: "03", title: "Sites and booking tools", detail: "Old pages and scheduling links", color: "border-[#9fdcce] bg-[#ebf8f4] text-[#166f61]" },
                  { number: "04", title: "Messages and notes", detail: "Customer messages and internal notes", color: "border-[#cfc9ff] bg-[#f2f0ff] text-[#5d55a7]" }
                ].map((item) => (
                  <div key={item.number} className={`lift relative overflow-hidden rounded-2xl border p-5 ${item.color}`}>
                    <span className="absolute -right-1 -top-5 text-7xl font-black opacity-[0.08]" aria-hidden="true">{item.number}</span>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em]">Source {item.number}</p>
                    <p className="mt-3 font-black text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
                  </div>
                ))}
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
                <h3 className="mt-3 text-xl font-black">You keep answering questions your business information should already answer.</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">Hours, prices, directions, services, and availability keep taking time away from the work that pays.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-[#f1d8cc] bg-[radial-gradient(circle_at_15%_10%,rgba(255,211,94,0.18),transparent_26%),radial-gradient(circle_at_88%_78%,rgba(123,215,196,0.18),transparent_27%),#fff8f3]">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-start md:py-24">
          <div>
            <SectionLabel>Built around the business</SectionLabel>
            <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Your business shouldn&apos;t have to fit the website builder.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Most website platforms start with their tools, their templates, their plans, and their limits.
              Resonate starts somewhere else: what does your business actually need?
            </p>
          </div>
          <div className="surface-card p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">We ask better questions first</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "What are customers constantly asking you?",
                "What information keeps getting outdated?",
                "What should customers be able to do without calling you?",
                "What are you paying for today that is not making the business easier to run?"
              ].map((question) => (
                <div key={question} className="rounded-2xl border border-[#f1d8cc] bg-[#fffdf9] p-4 text-sm font-bold leading-6 text-ink">
                  {question}
                </div>
              ))}
            </div>
            <p className="mt-6 leading-7 text-muted">
              Then we build around those answers. A restaurant may need a menu that is easy to keep current.
              A service business may need a better way to collect quote requests. Another business may need
              customers to send artwork, request an appointment, or simply know whether they are open.
            </p>
            <p className="mt-4 text-xl font-black leading-8 text-ink">
              Different businesses have different problems. Your website should be allowed to solve them.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d9eee7] bg-white">
        <div className="container-page py-14 md:py-20">
          <SectionLabel>Why Resonate is different</SectionLabel>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {approachCards.map((card, index) => (
              <article key={card.title} className={`lift rounded-[1.5rem] border p-6 ${index === 0 ? "border-[#27243f] bg-[#27243f] text-white" : index === 1 ? "border-[#f2dc92] bg-[#fff9df]" : index === 2 ? "border-[#ffc8b8] bg-[#fff1ec]" : "border-[#a9dfd3] bg-[#eaf8f4]"}`}>
                <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${index === 0 ? "text-[#ffd35e]" : "text-coral"}`}>Idea 0{index + 1}</p>
                <h3 className={`mt-4 text-xl font-black ${index === 0 ? "text-white" : "text-ink"}`}>{card.title}</h3>
                <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-white/72" : "text-muted"}`}>{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 border-b border-[#d9eee7] bg-[linear-gradient(180deg,#f3fbf8_0%,#fffdf9_100%)]">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>How we help</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">One clear place for customers. One easier way to keep it current.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">Start with a customer page that makes the important answers easy to find. Then decide how much help you want when the business changes.</p>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {solutionAreas.map((area, index) => (
              <article key={area.number} className={`lift relative overflow-hidden rounded-[1.75rem] border p-8 shadow-[0_20px_55px_rgba(46,52,49,0.08)] ${index === 0 ? "border-[#27243f] bg-[#27243f] text-white" : index === 1 ? "border-[#ffc8b8] bg-[#fff1ec]" : "border-[#a9dfd3] bg-[#eaf8f4]"}`}>
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
        <div className="container-page py-16 md:py-24">
          <SectionLabel>See it in action</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Different businesses need different answers.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">The page should match what customers need to know and what the owner needs them to do next.</p>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <article className="lift overflow-hidden rounded-[1.75rem] border border-[#ffc8b8] bg-white shadow-[0_24px_70px_rgba(240,95,59,0.12)]">
              <div className="relative h-72 overflow-hidden">
                <img src="/assets/mellow-moose-buffalo-chicken-fries.jpg" alt="Mellow Moose buffalo chicken fries" className="h-full w-full object-cover object-center transition duration-500 hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-6 text-xs font-black uppercase tracking-[0.15em] text-white">MenuPilot | Mellow Moose</p>
              </div>
              <div className="p-8">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#f05f3b]">The problem</p>
                <h3 className="mt-3 text-3xl font-black text-ink">Customers needed the menu, hours, and ordering details without hunting.</h3>
                <p className="mt-4 leading-7 text-muted"><strong className="text-ink">What Resonate created:</strong> A mobile MenuPilot page with the menu, current hours, food photos, phone number, and directions together.</p>
                <p className="mt-3 text-sm leading-6 text-muted"><strong className="text-ink">For customers:</strong> They can move from hungry to ordering in a few taps.</p>
                <p className="mt-2 text-sm leading-6 text-muted"><strong className="text-ink">For the owner:</strong> One useful link is easier to share.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/m/mellow-moose-burgers" className="rounded-full bg-[#f05f3b] px-5 py-3 text-sm font-black text-white hover:bg-ink">Open live example</Link>
                  <Link href="/menupilot" className="rounded-full border border-[#ffc8b8] bg-[#fff7f2] px-5 py-3 text-sm font-black text-ink hover:border-[#f05f3b]">Explore MenuPilot</Link>
                </div>
              </div>
            </article>
            <article className="lift overflow-hidden rounded-[1.75rem] border border-[#4b466d] bg-[#27243f] text-white shadow-[0_26px_75px_rgba(39,36,63,0.2)]">
              <div className="relative h-72 overflow-hidden bg-[#f6eee6]">
                <img src="/assets/excellent-pins/lovable/pin-event.jpg" alt="Colorful custom enamel event badge" className="h-full w-full object-cover object-[50%_58%] transition duration-500 hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#27243f]/75 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-6 max-w-md pr-6 text-xs font-black uppercase tracking-[0.15em] text-white">A product buyers can understand before they request a quote</p>
              </div>
              <div className="p-8">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ffd35e]">Excellent Pins &amp; Badges</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-[#ffd35e]">The problem</p>
                <h3 className="mt-3 text-3xl font-black">Custom-product buyers need clear options before anyone can quote the job.</h3>
                <p className="mt-4 leading-7 text-white/70"><strong className="text-white">What Resonate created:</strong> A product page and guided quote request that accepts the project details and artwork.</p>
                <p className="mt-3 text-sm leading-6 text-white/70"><strong className="text-white">For customers:</strong> They can understand the choices and send a complete request.</p>
                <p className="mt-2 text-sm leading-6 text-white/70"><strong className="text-white">For the owner:</strong> Jack receives the request details and attached JPG or PDF together.</p>
                <Link href="/excellent-pins" className="mt-7 inline-flex rounded-full bg-[#f05f3b] px-5 py-3 text-sm font-black text-white hover:bg-white hover:text-ink">See how it works</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-b border-[#eee5df] bg-white">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>A simple process</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">You stay in control. Keeping the information useful gets easier.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {["Show us what customers need to find", "We outline the clearest page for the business", "You review every detail before it goes live", "We publish the approved page and help when things change"].map((step, index) => (
              <li key={step} className={`lift rounded-2xl border p-5 ${index === 0 ? "border-[#ffc8b8] bg-[#fff1ec]" : index === 1 ? "border-[#f2dc92] bg-[#fff9df]" : index === 2 ? "border-[#a9dfd3] bg-[#eaf8f4]" : "border-[#d7d2ff] bg-[#f3f1ff]"}`}><span className="text-xs font-black uppercase tracking-[0.16em] text-[#f05f3b]">0{index + 1}</span><p className="mt-3 font-black leading-6 text-ink">{step}</p></li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl leading-7 text-muted">Your business stays yours. You approve what customers see, and you choose whether to send future changes yourself or use Managed Page support.</p>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#f1d8cc] bg-[linear-gradient(135deg,#fffdf9_0%,#fff1ec_52%,#f3fbf8_100%)]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-72 w-72 rounded-full border border-coral/20" aria-hidden="true" />
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center md:py-24">
          <div>
            <SectionLabel>Why I built Resonate</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Technology should adapt to the business, not the other way around.
            </h2>
          </div>
          <div className="surface-card p-7 sm:p-9">
            <p className="text-lg leading-8 text-muted">
              I&apos;m Kurtis, and I started Resonate because I think small businesses deserve technology that adapts to them,
              not the other way around.
            </p>
            <p className="mt-5 leading-7 text-muted">
              I don&apos;t start by asking which template you want. I start by asking what your customers are trying to do,
              what keeps creating extra work for you, and where better technology could make both easier.
            </p>
            <p className="mt-5 leading-7 text-muted">
              Sometimes the answer is a better webpage. Sometimes it is an online menu, a smarter quote form, easier updates,
              or something specific to the way your business works. That is the part I enjoy: finding the problem and building
              the right solution around the business.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/checkout?plan=review" className="btn-coral px-7 py-4">Tell me what&apos;s making your business harder</Link>
              <p className="text-sm font-semibold leading-6 text-muted">Let&apos;s see whether better technology can make it simpler.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="common-questions-heading" className="border-b border-[#d9eee7] bg-[linear-gradient(180deg,#f3fbf8_0%,#fffdf9_100%)]">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>Common questions</SectionLabel>
          <h2 id="common-questions-heading" className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            Clear answers about Resonate services.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">What does Resonate Solutions do?</h3>
              <p className="mt-3 leading-7 text-muted">Resonate creates mobile-friendly customer pages, online menus and service pages, customer intake forms, and managed website updates for small businesses.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">What is MenuPilot?</h3>
              <p className="mt-3 leading-7 text-muted"><Link href="/menupilot" className="font-black text-coral underline decoration-coral/30 underline-offset-4">MenuPilot online menu pages</Link> put a business&apos;s menu or services, hours, photos, location, and customer actions together in one mobile-friendly place.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">What is Managed Page?</h3>
              <p className="mt-3 leading-7 text-muted"><Link href="/portal" className="font-black text-coral underline decoration-coral/30 underline-offset-4">Managed website updates</Link> include hosting for a Resonate-hosted customer page. Request standard updates whenever your business changes. Resonate reviews the change, updates your page, and confirms when it’s complete.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">How much does a Resonate customer page cost?</h3>
              <p className="mt-3 leading-7 text-muted">Every paid customer page starts with a $399 one-time Launch build. See <Link href="/pricing" className="font-black text-coral underline decoration-coral/30 underline-offset-4">small business website pricing</Link> for the optional $17.99 hosting and $79.99 Managed Page plans.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">What is included with Webpage Hosting?</h3>
              <p className="mt-3 leading-7 text-muted">Webpage Hosting includes hosting, SSL, routine platform maintenance, and basic uptime monitoring. Content updates are not included.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">Does Resonate automatically update Google and social media?</h3>
              <p className="mt-3 leading-7 text-muted">No. Resonate updates supported Resonate-hosted pages. External profiles may be managed manually only when access and scope are confirmed with the business owner.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">What businesses does Resonate serve?</h3>
              <p className="mt-3 leading-7 text-muted">Resonate serves small businesses that need clearer customer information, an online menu or service page, or a guided form such as the <Link href="/excellent-pins" className="font-black text-coral underline decoration-coral/30 underline-offset-4">Excellent Pins customer intake example</Link>.</p>
            </article>
            <article className="surface-card p-6">
              <h3 className="text-xl font-black text-ink">Where does Resonate Solutions operate?</h3>
              <p className="mt-3 leading-7 text-muted">Resonate Solutions operates in Northwest Arkansas.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="free-page-plan" className="relative overflow-hidden bg-[linear-gradient(135deg,#f05f3b_0%,#ff7d57_48%,#e85089_100%)] text-white">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-white/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 top-4 h-60 w-60 rounded-full bg-[#ffd35e]/30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <div className="flex justify-center"><SectionLabel light>Start here</SectionLabel></div>
          <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Not sure what your customers need first?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">Start with a Free Page Plan. We review what you have, what customers need to find, and what would be most useful before you pay for a build.</p>
          <Link href="/checkout?plan=review" className="mt-9 inline-flex rounded-full bg-white px-7 py-4 font-black text-ink shadow-[0_18px_45px_rgba(97,35,37,0.25)] transition hover:-translate-y-0.5 hover:bg-[#fff5db]">Get a Free Page Plan</Link>
          <p className="mt-5 text-xs font-semibold text-white/75">No payment is required for the review.</p>
        </div>
      </section>
    </main>
  );
}
