import Link from "next/link";

const products = [
  {
    name: "ReplyPilot",
    description: "Safe review reply workflows for local businesses, with 10 free trial replies and paid automation paths.",
    href: "/replypilot"
  },
  {
    name: "LeadPilot",
    description: "Planned follow-up workflows for website leads, missed calls, and contact forms.",
    href: "/replypilot"
  },
  {
    name: "InboxPilot",
    description: "Planned draft responses for common customer emails and messages.",
    href: "/replypilot"
  }
];

export default function ResonateHome() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(15,159,143,0.35),transparent_34%),linear-gradient(135deg,rgba(245,184,75,0.18),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Resonate Solutions</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
            AI systems for small businesses that need faster customer communication.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Resonate Solutions builds practical AI tools for local businesses, starting with ReplyPilot: a review reply workflow that helps owners respond professionally without adding another complicated system.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/replypilot" className="min-h-12 rounded-lg bg-brand px-6 py-3 text-center font-bold text-white hover:bg-brandDark">
              Explore ReplyPilot
            </Link>
            <Link href="/replypilot/generator" className="min-h-12 rounded-lg border border-white/25 px-6 py-3 text-center font-bold text-white hover:bg-white/10">
              Try 10 free replies
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Product pipeline</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
            Start with review replies, expand into customer communication.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <Link key={product.name} href={product.href} className="rounded-lg border border-line bg-white p-6 shadow-sm hover:border-brand">
              <h3 className="text-2xl font-black text-ink">{product.name}</h3>
              <p className="mt-3 leading-7 text-muted">{product.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
