import { notFound } from "next/navigation";
import { getMenuBusiness, publicMenuUrl } from "@/lib/menu-store";
import { mailtoLink, questionsEmail } from "@/lib/contact";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const business = await getMenuBusiness(slug);

  if (!business) {
    return {
      title: "Menu not found | Resonate Solutions"
    };
  }

  return {
    title: `${business.businessName} menu`,
    description: business.description || `${business.businessName} menu, hours, location, and customer links.`
  };
}

function actionUrl(kind: "directions" | "phone", value?: string | null) {
  if (!value) {
    return null;
  }

  if (kind === "directions") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
  }

  return `tel:${value.replace(/[^0-9+]/g, "")}`;
}

function isFavoriteBadge(value?: string | null) {
  if (!value) {
    return false;
  }

  const badge = value.toLowerCase();
  return ["best", "popular", "favorite", "seller", "signature"].some((term) => badge.includes(term));
}

export default async function PublicMenuPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getMenuBusiness(slug);

  if (!business) {
    notFound();
  }

  const menuUrl = publicMenuUrl(business.slug);
  const directionsUrl = actionUrl("directions", business.address || business.locationSummary);
  const phoneUrl = actionUrl("phone", business.phone);
  const heroImage = business.heroImageUrl || "/assets/menu-photo-bowl.svg";
  const isMellowMoose = business.slug === "mellow-moose-burgers";
  const sectionIds = new Set(business.sections.map((section) => section.id));
  const groupedSections = business.sections
    .map((section) => ({
      ...section,
      items: business.items.filter((item) => item.sectionId === section.id)
    }))
    .filter((section) => section.items.length > 0);
  const unsectionedItems = business.items.filter((item) => !item.sectionId || !sectionIds.has(item.sectionId));
  const favoriteItems = business.items
    .filter((item) => !item.isSoldOut && isFavoriteBadge(item.badge))
    .slice(0, 4);
  const fallbackFavorites = business.items.filter((item) => !item.isSoldOut).slice(0, 3);
  const localFavorites = favoriteItems.length ? favoriteItems : fallbackFavorites;
  const photoEmailLink = mailtoLink(
    `Photos or questions for ${business.businessName}`,
    `Business/menu page: ${menuUrl}\n\nAttach photos or ask a question here.`
  );

  const actionLinks = [
    directionsUrl ? { label: "Directions", href: directionsUrl, style: "bg-ink text-white" } : null,
    business.orderingUrl ? { label: isMellowMoose ? "Order on Clover" : "Order", href: business.orderingUrl, style: "bg-brand text-white" } : null,
    business.reviewUrl ? { label: "Reviews", href: business.reviewUrl, style: "border border-line bg-white text-ink" } : null,
    business.facebookUrl ? { label: "Facebook", href: business.facebookUrl, style: "border border-line bg-white text-ink" } : null,
    business.instagramUrl ? { label: "Instagram", href: business.instagramUrl, style: "border border-line bg-white text-ink" } : null,
    phoneUrl ? { label: "Call", href: phoneUrl, style: "border border-line bg-white text-ink" } : null,
    { label: "Ask", href: photoEmailLink, style: "border border-line bg-white text-ink" }
  ].filter(Boolean) as { label: string; href: string; style: string }[];

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-soft">
          <div className={`relative min-h-[420px] ${isMellowMoose ? "bg-[#62d3ca]" : "bg-ink"}`}>
            {isMellowMoose ? (
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#62d3ca_0%,#62d3ca_48%,#2d6b34_49%,#184821_72%,#0f2e19_100%)]" />
            ) : null}
            <img
              src={heroImage}
              alt={`${business.businessName} featured menu item`}
              className={`absolute inset-0 h-full w-full ${isMellowMoose ? "object-contain p-10 sm:p-14" : "object-cover"}`}
            />
            <div className={`absolute inset-0 ${isMellowMoose ? "bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(16,27,31,.68))]" : "bg-[linear-gradient(180deg,rgba(16,27,31,.1),rgba(16,27,31,.76))]"}`} />
            <div className="relative flex min-h-[420px] flex-col justify-end p-5 sm:p-8">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  <p className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-black text-brandDark">{business.businessType}</p>
                  {isMellowMoose ? (
                    <p className="inline-flex rounded-full bg-[#f4d15f] px-4 py-2 text-sm font-black text-ink">Best of Siloam 2026</p>
                  ) : null}
                </div>
                <h1 className="mt-4 text-5xl font-black leading-none text-white sm:text-7xl">{business.businessName}</h1>
                {business.city ? <p className="mt-3 text-lg font-bold text-white/90">{business.city}</p> : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_340px] md:p-8">
            <div>
              {business.description ? <p className="max-w-3xl text-lg leading-8 text-muted">{business.description}</p> : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {business.hoursSummary ? (
                  <div className="rounded-2xl bg-cream p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-brand">Hours</p>
                    <p className="mt-1 font-bold text-ink">{business.hoursSummary}</p>
                  </div>
                ) : null}
                {business.locationSummary ? (
                  <div className="rounded-2xl bg-cream p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-brand">Location</p>
                    <p className="mt-1 font-bold text-ink">{business.locationSummary}</p>
                  </div>
                ) : null}
              </div>
              {business.statusNote ? (
                <p className={`mt-5 rounded-2xl px-4 py-3 font-bold ${isMellowMoose ? "bg-[#f4d15f] text-ink" : "bg-sage text-brandDark"}`}>{business.statusNote}</p>
              ) : null}
            </div>

            <div className={`rounded-2xl border border-line p-4 ${isMellowMoose ? "bg-[#f6efe3]" : "bg-cream"}`}>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Quick links</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {actionLinks.map((action) => (
                  <a key={action.label} href={action.href} className={`rounded-full px-4 py-3 text-center text-sm font-black transition hover:-translate-y-0.5 hover:shadow-sm ${action.style}`}>
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-5">
        {localFavorites.length ? (
          <div className="mb-10 rounded-[1.75rem] border border-line bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Local favorites</p>
                <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Start with what people come back for.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted">
                Best sellers, popular picks, and owner-recommended items can sit up front so first-time customers have an easy starting point.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {localFavorites.map((item, index) => (
                <a key={item.id} href={`#item-${item.id}`} className="group overflow-hidden rounded-2xl border border-line bg-cream shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-soft">
                  <div className="relative">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-brandDark shadow-sm">#{index + 1}</span>
                    {item.price ? <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-black text-coral shadow-sm">{item.price}</span> : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-ink">{item.name}</h3>
                    </div>
                    {item.description ? <p className="mt-2 max-h-12 overflow-hidden text-sm leading-6 text-muted">{item.description}</p> : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brandDark">{item.badge || "Favorite"}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-muted">View details</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Current menu</p>
            <h2 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Browse before you order</h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              This page is designed around {business.businessName}: its menu, photos, customer actions, and the details people need before they choose.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white px-5 py-4 shadow-sm">
            <p className="text-sm leading-6 text-muted">
              Menu questions and photo updates go to{" "}
              <a href={photoEmailLink} className="font-black text-brandDark">{questionsEmail}</a>.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {[...groupedSections, ...(unsectionedItems.length ? [{ id: "more", name: "More", sortOrder: 99, items: unsectionedItems }] : [])].map((section) => (
              <section key={section.id} id={section.id}>
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
                  <h3 className="text-2xl font-black text-ink">{section.name}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-muted">{section.items.length} items</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <article id={`item-${item.id}`} key={item.id} className={`group scroll-mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-soft ${item.isSoldOut ? "opacity-65" : ""}`}>
                      {item.imageUrl ? (
                        <div className="relative">
                          <img src={item.imageUrl} alt={item.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                          {item.price ? <span className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 font-black text-coral shadow-sm">{item.price}</span> : null}
                        </div>
                      ) : null}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-xl font-black text-ink">{item.name}</h4>
                          {!item.imageUrl && item.price ? <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-sm font-black text-coral">{item.price}</span> : null}
                        </div>
                        {item.description ? <p className="mt-2 leading-7 text-muted">{item.description}</p> : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.badge ? <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-brandDark">{item.badge}</span> : null}
                          {item.isSoldOut ? <span className="rounded-full bg-cream px-3 py-1 text-xs font-black text-coral">Sold out</span> : null}
                        </div>
                        <details className="mt-5 rounded-2xl border border-line bg-cream p-4">
                          <summary className="cursor-pointer font-black text-ink transition hover:text-brandDark">Ask about this item</summary>
                          <form action="/api/menu-comments" method="POST" className="mt-4 grid gap-3">
                            <input type="hidden" name="businessSlug" value={business.slug} />
                            <input type="hidden" name="businessName" value={business.businessName} />
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="itemName" value={item.name} />
                            <input type="hidden" name="returnTo" value={`/m/${business.slug}`} />
                            <input name="customerName" placeholder="Name, optional" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
                            <input name="customerEmail" type="email" placeholder="Email, optional" className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
                            <textarea name="comment" required rows={3} placeholder={`Question or comment about ${item.name}`} className="rounded-xl border border-line bg-white px-3 py-2 text-sm" />
                            <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-black text-white transition hover:bg-brandDark">Send comment</button>
                          </form>
                        </details>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-[1.75rem] border border-line bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="mb-5 rounded-2xl bg-sage p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brandDark">Made for this business</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {isMellowMoose
                  ? "Built around the moose logo, Colorado mountain feel, real item photos, Clover ordering, and the menu customers ask for before they order."
                  : "Colors, photos, menu sections, quick links, and updates can be tuned to match the owner's real brand and customer flow."}
              </p>
            </div>
            {isMellowMoose ? (
              <div className="mb-5 overflow-hidden rounded-2xl border border-line bg-white">
                <img src="/assets/mellow-moose-best-of-siloam.jpg" alt="Best of Siloam Springs 2026 Burger Local winner badge" className="w-full object-cover" />
              </div>
            ) : null}
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Share this menu</p>
            <img src={`/api/qr/${business.slug}`} alt={`QR code for ${business.businessName}`} className="mt-4 aspect-square w-full rounded-2xl border border-line bg-white p-3" />
            <p className="mt-4 break-all text-sm leading-6 text-muted">{menuUrl}</p>
            <a href={`/api/qr/${business.slug}`} className="mt-5 block rounded-full bg-ink px-5 py-3 text-center font-black text-white transition hover:-translate-y-0.5 hover:shadow-sm">Open QR code</a>
            <a href={photoEmailLink} className="mt-3 block rounded-full border border-line px-5 py-3 text-center font-black text-ink transition hover:border-brand">Send photos or updates</a>
          </aside>
        </div>
      </section>
    </main>
  );
}
