import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-bold text-ink">Resonate Solutions</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            AI-assisted customer communication tools for local businesses. ReplyPilot provides generated draft replies only; users are responsible for reviewing and editing before posting.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm font-medium text-muted">
          <Link className="hover:text-ink" href="/privacy">Privacy</Link>
          <Link className="hover:text-ink" href="/terms">Terms</Link>
          <Link className="hover:text-ink" href="/disclaimer">Disclaimer</Link>
          <Link className="hover:text-ink" href="/replypilot/pricing">Pricing</Link>
        </nav>
      </div>
    </footer>
  );
}
