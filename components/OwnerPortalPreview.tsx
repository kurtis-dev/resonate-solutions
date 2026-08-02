import Link from "next/link";

const quickActions = [
  {
    title: "Update hours",
    detail: "Change regular hours, closures, or a one-day schedule."
  },
  {
    title: "Post an announcement",
    detail: "Put a clear message at the top of the customer page."
  },
  {
    title: "Request a content change",
    detail: "Send updated text, pricing, services, or menu details."
  },
  {
    title: "Add new photos",
    detail: "Upload the images customers should see next."
  }
];

const requests = [
  {
    status: "Needs details",
    title: "Holiday hours",
    detail: "Add the closing time before review can begin.",
    tone: "border-gold/40 bg-gold/10 text-[#8a5b08]"
  },
  {
    status: "In review",
    title: "New service photo",
    detail: "Resonate is checking the crop and page placement.",
    tone: "border-brand/30 bg-sage/70 text-brandDark"
  },
  {
    status: "Ready",
    title: "Updated customer message",
    detail: "Approved and ready for the next publish.",
    tone: "border-coral/30 bg-[#fff0e9] text-coral"
  }
];

function ActionIcon({ index }: { index: number }) {
  const paths = [
    <><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></>,
    <><path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 9h8M8 12h5" /></>,
    <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="m21 15-5-4-6 6" /></>
  ];

  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[index]}
    </svg>
  );
}

export function OwnerPortalPreview({ showPortalLink = false }: { showPortalLink?: boolean }) {
  return (
    <section aria-label="Owner dashboard preview" className="overflow-hidden rounded-[1.75rem] border border-line bg-[#f7f1e8] shadow-[0_28px_90px_rgba(32,35,32,0.14)]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-black text-white">R</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-coral">Owner dashboard</p>
            <h3 className="mt-1 text-xl font-black text-ink">Your customer page</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-xs font-black text-brandDark">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            Page live
          </span>
          {showPortalLink ? (
            <Link href="/portal" className="hidden rounded-full border border-line px-4 py-2 text-xs font-black text-ink hover:border-coral hover:text-coral sm:inline-flex">
              Open portal
            </Link>
          ) : null}
        </div>
      </header>

      <div className="grid border-b border-line bg-white sm:grid-cols-3">
        {[
          ["Page status", "Live", "Customers can open it now"],
          ["Open requests", "2", "One item needs your details"],
          ["Last reviewed", "Today", "Current information checked"]
        ].map(([label, value, detail], index) => (
          <div key={label} className={`px-5 py-4 sm:px-6 ${index ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">{label}</p>
            <p className="mt-2 text-2xl font-black text-ink">{value}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
        <div className="p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-coral">Request an update</p>
              <h4 className="mt-2 text-2xl font-black text-ink">What needs to change?</h4>
            </div>
            <span className="hidden text-xs font-bold text-muted sm:block">Choose one to get started</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action, index) => (
              <article key={action.title} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e9] text-coral">
                  <ActionIcon index={index} />
                </span>
                <h5 className="mt-4 font-black text-ink">{action.title}</h5>
                <p className="mt-1 text-sm leading-5 text-muted">{action.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brandDark">What customers see now</p>
                <h5 className="mt-2 text-lg font-black text-ink">Current page details</h5>
              </div>
              <span className="rounded-full border border-line bg-cream px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-muted">Reviewed today</span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="font-black text-ink">Hours</dt><dd className="mt-1 text-muted">Published</dd></div>
              <div><dt className="font-black text-ink">Main action</dt><dd className="mt-1 text-muted">Call or request</dd></div>
              <div><dt className="font-black text-ink">Announcement</dt><dd className="mt-1 text-muted">None active</dd></div>
            </dl>
          </div>
        </div>

        <aside className="border-t border-line bg-ink p-5 text-white sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-gold">Update requests</p>
          <h4 className="mt-2 text-2xl font-black">Know what happens next.</h4>
          <p className="mt-2 text-sm leading-6 text-white/65">Every request shows what Resonate needs, what is under review, and what is ready to publish.</p>
          <div className="mt-5 grid gap-3">
            {requests.map((request) => (
              <article key={request.title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${request.tone}`}>{request.status}</span>
                <h5 className="mt-3 font-black">{request.title}</h5>
                <p className="mt-1 text-sm leading-5 text-white/62">{request.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-white/55">
            Nothing changes on the public page until the request is reviewed and approved.
          </div>
        </aside>
      </div>
    </section>
  );
}
