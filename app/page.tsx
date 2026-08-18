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

const valueCards = [
  {
    title: "Get found",
    copy: "Make your most important business information easy to open from a link, QR code, search result, or message."
  },
  {
    title: "Give the right answer",
    copy: "Put hours, services, menus, photos, directions, and next steps together so customers do not have to hunt."
  },
  {
    title: "Keep it current",
    copy: "Request standard updates whenever your business changes. Resonate reviews the change, updates your page, and confirms when it’s complete."
  }
];

const pricingCards = [
  {
    title: "Launch",
    price: "$399",
    cadence: "one-time",
    copy: "We build the approved customer page, give you a private preview, and check it before the public link goes live.",
    href: "/checkout?plan=setup",
    cta: "Start Launch",
    accent: "border-[#ffc8b8] bg-white"
  },
  {
    title: "Webpage Hosting",
    price: "$17.99",
    cadence: "per month",
    copy: "Hosting, SSL, routine platform maintenance, and basic uptime monitoring. You handle your own content updates.",
    href: "/checkout?plan=launch-hosting",
    cta: "Start Launch + Hosting",
    accent: "border-[#f2dc92] bg-[#fff9df]"
  },
  {
    title: "Managed Page",
    price: "$79.99",
    cadence: "per month",
    copy: "Hosting included. Resonate handles supported routine updates to your Resonate-hosted page when your business changes.",
    href: "/checkout?plan=launch-managed-page",
    cta: "Start Launch + Managed Page",
    accent: "border-[#27243f] bg-[#27243f] text-white",
    featured: true
  }
];

const fitCards = [
  {
    title: "Built around the business",
    copy: "A restaurant, service business, and custom-product shop should not all be forced into the same page."
  },
  {
    title: "Predictable webpage costs",
    copy: "More customers should not mean a bigger website bill. Resonate webpage pricing is not based on traffic."
  },
  {
    title: "A real person helps",
    copy: "When something needs to change, you should not have to fight another website builder alone."
  }
];

const faqs = [
  {
    question: "What does Resonate build?",
    answer: "Customer pages, online menus, service pages, quote and intake forms, hosting, and managed updates."
  },
  {
    question: "How much does it cost?",
    answer: "Launch is $399 one-time. Optional Hosting is $17.99/month. Managed Page is $79.99/month with hosting included."
  },
  {
    question: "What happens after launch?",
    answer: "Choose Webpage Hosting when you plan to handle content changes yourself. Choose Managed Page when you want Resonate to handle supported routine updates."
  },
  {
    question: "Where should I start?",
    answer: "Start with a Free Page Plan. Resonate reviews what you have and what would be most useful before you pay for a build."
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
              Resonate builds clear, mobile-friendly pages, menus, and forms around how your business actually works, so customers can find the right answer and you have an easier way to keep it current.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/checkout?plan=review" className="btn-coral px-7 py-4">Get a Free Page Plan</Link>
              <Link href="/pricing" className="btn-outline-ink bg-white/65 px-7 py-4">See Pricing</Link>
            </div>
          </div>

          <figure className="rise-in relative mx-auto w-full max-w-[410px]">
            <div className="overflow-hidden rounded-[2.5rem] border-[8px] border-ink bg-white shadow-[0_34px_100px_rgba(68,53,120,0.2)]">
              <div className="flex items-center justify-between bg-ink px-6 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white"><span>MenuPilot</span><span className="text-[#ffd35e]">Live page</span></div>
              <div className="relative min-h-[235px] overflow-hidden">
                <img src="/assets/mellow-moose-slammer-jammer.jpg" alt="Mellow Moose smash burger" className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b12]/90 via-[#2d1b12]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="rounded-full bg-[#f05f3b] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]">Open today</span>
                  <h2 className="mt-4 text-3xl font-black">Mellow Moose Burgers</h2>
                  <p className="mt-1 text-sm text-white/80">Smash burgers &middot; Siloam Springs, AR</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 bg-[#fff7f1] p-4 text-center text-xs font-black text-ink">
                {["Menu", "Call", "Map", "Share"].map((action, index) => <span key={action} className={`rounded-xl px-2 py-3 ${index === 0 ? "bg-[#f05f3b] text-white" : "border border-[#f0d6c8] bg-white"}`}>{action}</span>)}
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

      <section id="solutions" className="scroll-mt-24 border-b border-[#d9eee7] bg-white">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>What Resonate helps with</SectionLabel>
          <h2 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Get found. Give the right answer. Keep it current.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Start with one useful customer page, then add the right level of support. The point is simple: clearer answers for customers, less upkeep for the owner.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {valueCards.map((card, index) => (
              <article key={card.title} className={`lift rounded-[1.75rem] border p-7 shadow-[0_20px_55px_rgba(46,52,49,0.08)] ${index === 0 ? "border-[#27243f] bg-[#27243f] text-white" : index === 1 ? "border-[#ffc8b8] bg-[#fff1ec]" : "border-[#a9dfd3] bg-[#eaf8f4]"}`}>
                <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? "text-[#ffd35e]" : index === 1 ? "text-coral" : "text-[#1f7566]"}`}>0{index + 1}</p>
                <h3 className={`mt-4 text-2xl font-black ${index === 0 ? "text-white" : "text-ink"}`}>{card.title}</h3>
                <p className={`mt-4 leading-7 ${index === 0 ? "text-white/72" : "text-muted"}`}>{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#f1d8cc] bg-[linear-gradient(180deg,#fff8f3_0%,#fffdf9_100%)]">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>Simple pricing path</SectionLabel>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-4xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Start with Launch. Choose how much help you want after that.</h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">Every paid Resonate page starts with a one-time build. Then choose simple hosting or Managed Page support when you want help keeping the page useful.</p>
            </div>
            <Link href="/pricing" className="btn-outline-ink shrink-0 bg-white px-6 py-3">Compare Pricing</Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingCards.map((card) => (
              <article key={card.title} className={`lift flex flex-col rounded-[1.75rem] border p-7 shadow-[0_20px_55px_rgba(46,52,49,0.08)] ${card.accent}`}>
                {card.featured ? <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffd35e]">Hosting included</p> : <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Resonate page</p>}
                <h3 className={`mt-4 text-2xl font-black ${card.featured ? "text-white" : "text-ink"}`}>{card.title}</h3>
                <p className={`mt-5 text-4xl font-black ${card.featured ? "text-white" : "text-ink"}`}>{card.price}<span className={`ml-2 text-sm font-black ${card.featured ? "text-white/70" : "text-muted"}`}>{card.cadence}</span></p>
                <p className={`mt-5 leading-7 ${card.featured ? "text-white/72" : "text-muted"}`}>{card.copy}</p>
                {card.featured ? <p className="mt-4 rounded-2xl border border-white/15 bg-white/8 p-4 text-sm font-semibold leading-6 text-white/78">Larger projects, new features, and substantial redesigns are scoped separately.</p> : null}
                <Link href={card.href} className={`mt-7 inline-flex rounded-full px-5 py-3 text-sm font-black transition ${card.featured ? "bg-[#f05f3b] text-white hover:bg-white hover:text-ink" : "border border-[#ffc8b8] bg-white text-ink hover:border-[#f05f3b] hover:bg-[#fff7f2]"}`}>{card.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-[#efe1d9] bg-white">
        <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#b9b5ff]/15 blur-3xl" aria-hidden="true" />
        <div className="container-page relative py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>Built around the business</SectionLabel>
              <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Your business shouldn&apos;t have to fit the website builder.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Most website tools start with templates and limits. Resonate starts with the business problem: what customers need to know, what they need to do next, and what keeps creating extra work for the owner.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {fitCards.map((card, index) => (
                <article key={card.title} className={`lift rounded-2xl border p-5 ${index === 0 ? "border-[#27243f] bg-[#27243f] text-white" : index === 1 ? "border-[#f2dc92] bg-[#fff9df]" : "border-[#ffc8b8] bg-[#fff1ec]"}`}>
                  <h3 className={`text-lg font-black ${index === 0 ? "text-white" : "text-ink"}`}>{card.title}</h3>
                  <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-white/72" : "text-muted"}`}>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 border-b border-[#f1d8cc] bg-[radial-gradient(circle_at_92%_8%,rgba(185,181,255,0.23),transparent_25%),radial-gradient(circle_at_8%_90%,rgba(255,211,94,0.18),transparent_27%),#fff8f3]">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>See it in action</SectionLabel>
          <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Real pages for real business questions.</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="lift overflow-hidden rounded-[1.75rem] border border-[#ffc8b8] bg-white shadow-[0_24px_70px_rgba(240,95,59,0.12)]">
              <div className="relative h-72 overflow-hidden">
                <img src="/assets/mellow-moose-slammer-jammer.jpg" alt="Mellow Moose smash burger" className="h-full w-full object-cover object-center transition duration-500 hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-6 text-xs font-black uppercase tracking-[0.15em] text-white">MenuPilot | Mellow Moose</p>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-ink">Mellow Moose Burgers</h3>
                <p className="mt-4 leading-7 text-muted">Customers can see the menu, check hours, order, call, or get directions from one mobile-friendly page.</p>
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
                <p className="absolute bottom-5 left-6 max-w-md pr-6 text-xs font-black uppercase tracking-[0.15em] text-white">Excellent Pins &amp; Badges</p>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black">Excellent Pins &amp; Badges</h3>
                <p className="mt-4 leading-7 text-white/70">Buyers can understand product options and send a quote request with project details and artwork.</p>
                <Link href="/excellent-pins" className="mt-7 inline-flex rounded-full bg-[#f05f3b] px-5 py-3 text-sm font-black text-white hover:bg-white hover:text-ink">See how it works</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 relative overflow-hidden border-b border-[#f1d8cc] bg-[linear-gradient(135deg,#fffdf9_0%,#fff1ec_52%,#f3fbf8_100%)]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-72 w-72 rounded-full border border-coral/20" aria-hidden="true" />
        <div className="container-page grid gap-8 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-center md:py-20">
          <div>
            <SectionLabel>Why I built Resonate</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">A real person starts with the problem.</h2>
          </div>
          <div className="surface-card p-7 sm:p-9">
            <p className="text-lg leading-8 text-muted">
              I&apos;m Kurtis. I built Resonate because small businesses deserve technology that adapts to them, not the other way around. I start by asking what customers are trying to do, what keeps creating extra work, and what would make the business easier to run.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="common-questions-heading" className="border-b border-[#d9eee7] bg-[linear-gradient(180deg,#f3fbf8_0%,#fffdf9_100%)]">
        <div className="container-page py-16 md:py-24">
          <SectionLabel>Common questions</SectionLabel>
          <h2 id="common-questions-heading" className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-5xl">Clear answers before you start.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="surface-card p-6">
                <h3 className="text-xl font-black text-ink">{faq.question}</h3>
                <p className="mt-3 leading-7 text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="free-page-plan" className="relative overflow-hidden bg-[linear-gradient(135deg,#f05f3b_0%,#ff7d57_48%,#e85089_100%)] text-white">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-white/20" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 top-4 h-60 w-60 rounded-full bg-[#ffd35e]/30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <div className="flex justify-center"><SectionLabel light>Start here</SectionLabel></div>
          <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Not sure what your customers need first?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">Start with a Free Page Plan. We&apos;ll review what you have, what customers need to find, and what would be most useful before you pay for a build.</p>
          <Link href="/checkout?plan=review" className="mt-9 inline-flex rounded-full bg-white px-7 py-4 font-black text-ink shadow-[0_18px_45px_rgba(97,35,37,0.25)] transition hover:-translate-y-0.5 hover:bg-[#fff5db]">Get a Free Page Plan</Link>
        </div>
      </section>
    </main>
  );
}
