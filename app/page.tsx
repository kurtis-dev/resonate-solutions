import Link from "next/link";

const modules = [
  {
    name: "ReplyPilot",
    status: "Live module",
    description: "Generate safe review reply drafts, flag risky complaints, and support approved posting where platform access is available.",
    href: "/replypilot"
  },
  {
    name: "Review Request Flow",
    status: "Next module",
    description: "Send real customers a clean follow-up link after service so happy customers are more likely to leave honest feedback.",
    href: "/replypilot/pricing"
  },
  {
    name: "MenuPilot",
    status: "Next module",
    description: "Give food trucks and small restaurants a fast mobile menu, location, hours, QR code, and today-only updates customers can actually find.",
    href: "/menupilot"
  },
  {
    name: "Complaint Recovery",
    status: "Next module",
    description: "Turn low-star reviews into private follow-up tasks before the public reply goes out.",
    href: "/replypilot/pricing"
  },
  {
    name: "Google Profile Desk",
    status: "Planned",
    description: "Track Google Business Profile tasks like hours, services, photos, Q&A, posts, and profile completeness.",
    href: "/replypilot/pricing"
  },
  {
    name: "Weekly Reputation Report",
    status: "Planned",
    description: "Send owners a plain-English summary of new reviews, response time, rating trends, and unresolved issues.",
    href: "/replypilot/pricing"
  },
  {
    name: "Lead Follow-Up",
    status: "Planned",
    description: "Draft fast replies for missed calls, contact forms, and new inquiries so fewer prospects go cold.",
    href: "/replypilot/pricing"
  }
];

const outcomes = [
  "Know when a bad review needs attention",
  "Respond faster without sounding careless",
  "Request honest reviews from real customers",
  "Keep menus, hours, and food truck locations easy to find",
  "Track unresolved complaints and handoffs",
  "Keep Google Business Profile work from slipping",
  "Get a weekly reputation summary on phone or desktop"
];

export default function ResonateHome() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(15,159,143,0.35),transparent_34%),linear-gradient(135deg,rgba(245,184,75,0.18),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Resonate Solutions</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
            Reputation automation for local businesses that cannot babysit every review.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Resonate helps owners catch important customer feedback, draft safe replies, request honest reviews, and keep their Google presence moving without learning a complicated marketing platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/replypilot" className="min-h-12 rounded-lg bg-brand px-6 py-3 text-center font-bold text-white hover:bg-brandDark">
              Explore ReplyPilot
            </Link>
            <Link href="/replypilot/pricing" className="min-h-12 rounded-lg border border-white/25 px-6 py-3 text-center font-bold text-white hover:bg-white/10">
              View reputation plans
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">What it should automate</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
            Not just review replies. A reputation desk for the work owners miss.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            ReplyPilot is the first module, but the bigger product is a lightweight system for monitoring reviews, preparing safe responses, following up on complaints, requesting honest feedback, and surfacing Google Business Profile tasks.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.name} href={module.href} className="rounded-lg border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-soft">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-brand">{module.status}</span>
              <h3 className="mt-4 text-2xl font-black text-ink">{module.name}</h3>
              <p className="mt-3 leading-7 text-muted">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Why it is bigger</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
              The job is reputation follow-through, not AI text generation.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              A small business owner does not want another writing app. They want fewer missed reviews, fewer public mistakes, more real customer feedback, and a simple view of what needs attention this week.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <div key={outcome} className="rounded-lg border border-line bg-slate-50 p-4 font-bold text-ink">
                {outcome}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
