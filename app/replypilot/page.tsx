import Link from "next/link";
import { PricingCards } from "@/components/PricingCards";

const channels = ["Google", "Yelp", "Facebook", "TripAdvisor"];
const needCases = [
  {
    title: "Reviews shape buying decisions",
    text: "Future customers read public replies before they call, book, or visit. A calm response can make the business look active, accountable, and trustworthy."
  },
  {
    title: "Owners are too busy to respond",
    text: "Many businesses know reviews matter, but replying consistently gets pushed aside during the daily rush."
  },
  {
    title: "Negative reviews are risky",
    text: "A defensive reply can make the situation worse. ReplyPilot drafts cautious responses that avoid blame, private details, and promises the business did not approve."
  },
  {
    title: "Agencies need faster workflows",
    text: "Teams managing reviews for several clients need repeatable drafts, approval steps, and clean handoff instead of starting from scratch every time."
  }
];

const automationSteps = [
  ["Free copy/paste", "Generate 10 trial replies and post them yourself."],
  ["Approval workflow", "Save business rules, draft replies faster, and keep a human approval step before posting."],
  ["Managed review replies", "Resonate Solutions can draft or prepare replies on a monthly schedule so owners do less of the work."],
  ["Platform access where available", "Automate supported channels and provide approval-ready replies for platforms with limited access."]
];

const ownerWorkflow = [
  ["Open on your phone", "Paste a review while you are between customers, at home, or scrolling late at night."],
  ["Tap the situation", "Choose positive, neutral, complaint, or high-risk so ReplyPilot keeps the reply appropriate."],
  ["Approve the safest draft", "Get clean options that follow your saved business rules and avoid risky promises."],
  ["Post or hand off", "Copy it yourself, send it to a manager, or use connected posting support where available."]
];

export default function ReplyPilotPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(15,159,143,0.35),transparent_34%),linear-gradient(135deg,rgba(245,184,75,0.18),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_0.9fr] md:py-28">
          <div className="self-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">ReplyPilot by Resonate Solutions</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              Review replies handled before they become a chore.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              ReplyPilot helps local businesses respond professionally to customer reviews with safe AI drafts, approval workflows, and posting support where platform access is available.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/replypilot/generator" className="min-h-12 rounded-lg bg-brand px-6 py-3 text-center font-bold text-white hover:bg-brandDark">
                Try 10 free replies
              </Link>
              <Link href="/replypilot/pricing" className="min-h-12 rounded-lg border border-white/25 px-6 py-3 text-center font-bold text-white hover:bg-white/10">
                View pricing
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-soft backdrop-blur">
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-sm font-bold text-ink">Incoming review</p>
                  <p className="text-xs text-muted">4 stars · Local business</p>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">Approval-ready</span>
              </div>
              <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-muted">
                “Great service and friendly staff. The wait was a little long, but the food was excellent.”
              </p>
              <div className="mt-5 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-lg border border-line p-4">
                    <p className="text-sm leading-6 text-ink">
                      Thank you for your review. We are glad you enjoyed the food and service, and we appreciate your patience while our team works to improve wait times.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-4">
          {channels.map((channel) => (
            <div key={channel} className="rounded-lg border border-line bg-white p-5 text-center font-bold text-ink shadow-sm">
              {channel} reviews
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Why businesses need it</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
            ReplyPilot is built for the review work owners keep putting off.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {needCases.map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-black text-ink">{item.title}</h3>
              <p className="mt-3 leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-3">
          {[
            ["Paste the review", "Add the customer review, business type, star rating, and optional manager name."],
            ["Choose the tone", "Pick professional, warm, apologetic, short, or friendly replies for different situations."],
            ["Copy or download", "Get three polished draft options, then copy or download the best one."]
          ].map(([title, text], index) => (
            <article key={title} className="rounded-lg border border-line p-6">
              <span className="text-sm font-black text-brand">0{index + 1}</span>
              <h2 className="mt-4 text-2xl font-black text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Built for busy owners</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Simple enough to use from a phone after closing time.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              ReplyPilot should feel less like a technical tool and more like a guided review assistant. The owner should be able to triage a review, approve a safe reply, and move on.
            </p>
          </div>
          <div className="grid gap-4">
            {ownerWorkflow.map(([title, text], index) => (
              <article key={title} className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-sm font-black text-ink">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">More than a text box</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
              Start manual, then remove more work as the customer upgrades.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              The free tool proves value with 10 trial replies. Paid workflows can add business rules, safe reply controls, approval steps, and posting support for eligible connected platforms.
            </p>
          </div>
          <div className="grid gap-4">
            {automationSteps.map(([title, text], index) => (
              <article key={title} className="grid gap-4 rounded-lg border border-line bg-white p-5 shadow-sm sm:grid-cols-[64px_1fr]">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 text-sm font-black text-brand">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-black text-ink">{title}</h3>
                  <p className="mt-2 leading-7 text-muted">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Simple pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">Start free, upgrade when you want less manual review work.</h2>
        </div>
        <PricingCards />
        <div className="mt-8 rounded-lg border border-brand/25 bg-brand/5 p-6">
          <h3 className="text-2xl font-black text-ink">Managed review replies</h3>
          <p className="mt-3 max-w-3xl leading-7 text-muted">
            For businesses that want more help, Resonate Solutions can offer a managed monthly service: draft replies on a schedule, prepare approval-ready responses, and post where customer-authorized platform access is available.
          </p>
          <p className="mt-4 font-bold text-brand">Suggested launch offer: from $149/month.</p>
        </div>
      </section>
    </main>
  );
}
