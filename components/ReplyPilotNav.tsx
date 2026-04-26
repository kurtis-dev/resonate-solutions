import Link from "next/link";

export function ReplyPilotNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 font-bold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">R</span>
          <span>Resonate Solutions</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          <Link className="hover:text-ink" href="/replypilot">ReplyPilot</Link>
          <Link className="hover:text-ink" href="/replypilot/generator">Generator</Link>
          <Link className="hover:text-ink" href="/replypilot/pricing">Pricing</Link>
          <Link className="hover:text-ink" href="/replypilot/account">Account</Link>
        </nav>
        <Link href="/replypilot/generator" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brandDark">
          Try free
        </Link>
      </div>
    </header>
  );
}
