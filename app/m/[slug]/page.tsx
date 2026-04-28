import { notFound } from "next/navigation";
import { getMenuBusiness, publicMenuUrl, type MenuBusiness, type MenuItem, type MenuSection } from "@/lib/menu-store";
import { mailtoLink, questionsEmail } from "@/lib/contact";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ menu?: string }>;
};

type ActionLink = {
  label: string;
  href: string;
  style: string;
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

function getActiveMenu(business: MenuBusiness, requestedMenu?: string) {
  const activeKey = requestedMenu || business.activeMenuKey || "default";
  const variant = business.menuVariants?.find((candidate) => candidate.key === activeKey);

  if (!variant || variant.items.length === 0) {
    return {
      key: business.activeMenuKey || "default",
      label: business.businessName,
      banner: business.popupBanner,
      orderUrl: business.orderingUrl,
      sections: business.sections,
      items: business.items
    };
  }

  return {
    key: variant.key,
    label: variant.label,
    banner: variant.banner,
    orderUrl: variant.orderUrl || business.orderingUrl,
    sections: variant.sections,
    items: variant.items
  };
}

function IconBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff7a1a] text-lg font-black text-[#2d1706] shadow-[0_6px_0_rgba(45,23,6,.16)]">
      {children}
    </span>
  );
}

function MenuCard({ item, isMellowMoose }: { item: MenuItem; isMellowMoose: boolean }) {
  const hasImage = Boolean(item.imageUrl);

  return (
    <article
      id={`item-${item.id}`}
      className={`group scroll-mt-6 overflow-hidden rounded-[1.4rem] border bg-white shadow-[0_14px_35px_rgba(41,22,5,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(41,22,5,.14)] ${
        isMellowMoose ? "border-[#f0d1a8]" : "border-line"
      } ${item.isSoldOut ? "opacity-65" : ""}`}
    >
      {hasImage ? (
        <div className="overflow-hidden border-b border-[#f0d1a8] bg-[#fff8ed]">
          <img src={item.imageUrl || ""} alt={item.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h4 className="max-w-[17rem] text-xl font-black leading-tight text-[#25150b]">{item.name}</h4>
          {item.price ? <span className="shrink-0 rounded-full bg-[#ffe5b8] px-3 py-1 text-sm font-black text-[#9b3d08]">{item.price}</span> : null}
        </div>
        {item.description ? <p className="mt-3 text-[0.95rem] leading-6 text-[#68513f]">{item.description}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.badge ? <span className="rounded-full bg-[#d5f0dd] px-3 py-1 text-xs font-black text-[#246038]">{item.badge}</span> : null}
          {item.isSoldOut ? <span className="rounded-full bg-[#f7e5d2] px-3 py-1 text-xs font-black text-[#9b3d08]">Sold out</span> : null}
        </div>
      </div>
    </article>
  );
}

function MellowMooseShell({
  business,
  actionLinks,
  activeMenu,
  groupedSections,
  localFavorites,
  menuUrl,
  photoEmailLink
}: {
  business: MenuBusiness;
  actionLinks: ActionLink[];
  activeMenu: ReturnType<typeof getActiveMenu>;
  groupedSections: Array<MenuSection & { items: MenuItem[] }>;
  localFavorites: MenuItem[];
  menuUrl: string;
  photoEmailLink: string;
}) {
  return (
    <main className="min-h-screen bg-[#f7ead7] text-[#25150b]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(22,169,157,.22),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(255,122,26,.25),transparent_26%),linear-gradient(135deg,#fff4df_0%,#f7ead7_42%,#d6efe2_100%)]" />

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border-4 border-[#25150b] bg-[#fff7ea] p-5 shadow-[12px_12px_0_#25150b] sm:p-7">
            <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-center">
              <div className="rounded-[1.5rem] border-4 border-[#25150b] bg-[#5ed4ce] p-5 shadow-[8px_8px_0_rgba(37,21,11,.18)]">
                <img src={business.heroImageUrl || "/assets/mellow-moose-logo.jpg"} alt={`${business.businessName} logo`} className="mx-auto aspect-square w-full max-w-[260px] object-contain" />
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border-2 border-[#25150b] bg-[#ff7a1a] px-4 py-2 text-sm font-black text-[#25150b]">Griffin&apos;s Food Court</span>
                  <span className="rounded-full border-2 border-[#25150b] bg-[#f9ce46] px-4 py-2 text-sm font-black text-[#25150b]">Best of Siloam 2026</span>
                </div>
                <h1 className="mt-5 max-w-[13ch] text-5xl font-black leading-[0.94] tracking-tight text-[#25150b] [text-wrap:balance] sm:text-6xl lg:text-7xl">
                  {business.businessName}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5b4331]">
                  Smashed fresh beef burgers, loaded fries, salads, kids meals, and rotating specials from Siloam Springs.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {activeMenu.orderUrl ? (
                    <a href={activeMenu.orderUrl} className="rounded-full border-2 border-[#25150b] bg-[#25150b] px-6 py-3 text-center font-black text-white shadow-[5px_5px_0_#ff7a1a] transition hover:-translate-y-0.5">
                      Order on Clover
                    </a>
                  ) : null}
                  {actionLinks
                    .filter((action) => ["Directions", "Call"].includes(action.label))
                    .map((action) => (
                      <a key={action.label} href={action.href} className="rounded-full border-2 border-[#25150b] bg-white px-6 py-3 text-center font-black text-[#25150b] transition hover:-translate-y-0.5 hover:bg-[#f9ce46]">
                        {action.label}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="rounded-[2rem] border-4 border-[#25150b] bg-[#f9ce46] p-5 shadow-[8px_8px_0_#25150b]">
              <div className="grid grid-cols-[auto_1fr] gap-4">
                  <IconBadge>H</IconBadge>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em]">Open this week</p>
                  <p className="mt-1 text-lg font-black leading-snug">{business.hoursSummary}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
                  <IconBadge>M</IconBadge>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em]">Find the truck</p>
                  <p className="mt-1 text-lg font-black leading-snug">{business.address}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border-4 border-[#25150b] bg-white shadow-[8px_8px_0_#25150b]">
              <img src="/assets/mellow-moose-food-truck.jpg" alt="Mellow Moose Burgers bright orange food truck" className="h-64 w-full object-cover" />
            </div>
          </aside>
        </div>
      </section>

      {activeMenu.banner ? (
        <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <div className="rounded-[1.5rem] border-4 border-[#25150b] bg-[#ff7a1a] px-5 py-4 text-lg font-black text-white shadow-[8px_8px_0_#25150b]">
            {activeMenu.banner}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight [text-wrap:balance] sm:text-5xl">
              Local favorites
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5b4331]">
              Best sellers, owner picks, and photographed specials sit up front so customers can choose fast.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actionLinks
              .filter((action) => !["Directions", "Call"].includes(action.label))
              .map((action) => (
                <a key={action.label} href={action.href} className="rounded-full border-2 border-[#25150b] bg-white px-4 py-2 text-sm font-black text-[#25150b] transition hover:-translate-y-0.5 hover:bg-[#d5f0dd]">
                  {action.label}
                </a>
              ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {localFavorites.map((item, index) => (
            <a key={item.id} href={`#item-${item.id}`} className="group overflow-hidden rounded-[1.5rem] border-4 border-[#25150b] bg-white shadow-[8px_8px_0_rgba(37,21,11,.9)] transition hover:-translate-y-1">
              {item.imageUrl ? (
                <div className="overflow-hidden bg-[#fff4df]">
                  <img src={item.imageUrl} alt={item.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
                </div>
              ) : (
                <div className="flex h-28 items-center justify-center bg-[#fff4df] text-4xl font-black">MM</div>
              )}
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f9ce46] px-3 py-1 text-xs font-black">#{index + 1}</span>
                  {item.price ? <span className="text-sm font-black text-[#9b3d08]">{item.price}</span> : null}
                </div>
                <h3 className="text-xl font-black leading-tight [text-wrap:balance]">{item.name}</h3>
                {item.badge ? <p className="mt-3 inline-flex rounded-full bg-[#d5f0dd] px-3 py-1 text-xs font-black text-[#246038]">{item.badge}</p> : null}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-[1fr_310px]">
        <div className="space-y-10">
          <div>
            <h2 className="text-4xl font-black leading-[1.02] tracking-tight [text-wrap:balance] sm:text-5xl">Full menu</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5b4331]">
              Built from the current menu and real item photos. Prices and specials can be changed when the truck changes.
            </p>
          </div>

          {groupedSections.map((section) => (
            <section key={section.id} id={section.id}>
              <div className="mb-4 flex items-center justify-between gap-4 border-b-4 border-[#25150b] pb-3">
                <h3 className="text-3xl font-black leading-tight [text-wrap:balance]">{section.name}</h3>
                <span className="rounded-full border-2 border-[#25150b] bg-white px-3 py-1 text-sm font-black">{section.items.length} items</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <MenuCard key={item.id} item={item} isMellowMoose />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="h-fit rounded-[1.75rem] border-4 border-[#25150b] bg-[#fff7ea] p-5 shadow-[8px_8px_0_#25150b] lg:sticky lg:top-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#246038]">Share this menu</p>
          <img src={`/api/qr/${business.slug}`} alt={`QR code for ${business.businessName}`} className="mt-4 aspect-square w-full rounded-2xl border-2 border-[#25150b] bg-white p-3" />
          <p className="mt-4 break-all text-sm leading-6 text-[#5b4331]">{menuUrl}</p>
          <a href={`/api/qr/${business.slug}`} className="mt-5 block rounded-full border-2 border-[#25150b] bg-[#25150b] px-5 py-3 text-center font-black text-white transition hover:-translate-y-0.5">Open QR code</a>
          <a href={photoEmailLink} className="mt-3 block rounded-full border-2 border-[#25150b] bg-white px-5 py-3 text-center font-black text-[#25150b] transition hover:-translate-y-0.5 hover:bg-[#f9ce46]">Send updates</a>
          <div className="mt-5 rounded-2xl border-2 border-[#25150b] bg-[#d5f0dd] p-4">
            <p className="text-sm font-black">Your brand, not a listing template.</p>
            <p className="mt-2 text-sm leading-6 text-[#5b4331]">
              Logos, colorways, photos, QR codes, ordering links, and special menus can be tuned to the business.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default async function PublicMenuPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams || Promise.resolve({ menu: undefined })]);
  const business = await getMenuBusiness(slug);

  if (!business) {
    notFound();
  }

  const activeMenu = getActiveMenu(business, query.menu);
  const menuUrl = publicMenuUrl(business.slug);
  const directionsUrl = actionUrl("directions", business.address || business.locationSummary);
  const phoneUrl = actionUrl("phone", business.phone);
  const isMellowMoose = business.brandTheme === "mellow-moose" || business.slug === "mellow-moose-burgers";
  const sectionIds = new Set(activeMenu.sections.map((section) => section.id));
  const groupedSections = activeMenu.sections
    .map((section) => ({
      ...section,
      items: activeMenu.items.filter((item) => item.sectionId === section.id)
    }))
    .filter((section) => section.items.length > 0);
  const unsectionedItems = activeMenu.items.filter((item) => !item.sectionId || !sectionIds.has(item.sectionId));
  const sectionsWithMore = [...groupedSections, ...(unsectionedItems.length ? [{ id: "more", name: "More", sortOrder: 99, items: unsectionedItems }] : [])];
  const favoriteItems = activeMenu.items
    .filter((item) => !item.isSoldOut && isFavoriteBadge(item.badge))
    .slice(0, 4);
  const fallbackFavorites = activeMenu.items.filter((item) => !item.isSoldOut).slice(0, 4);
  const localFavorites = favoriteItems.length ? favoriteItems : fallbackFavorites;
  const photoEmailLink = mailtoLink(
    `Photos or menu updates for ${business.businessName}`,
    `Business/menu page: ${menuUrl}\n\nAttach photos, menu updates, or questions here.`
  );

  const actionLinks = [
    directionsUrl ? { label: "Directions", href: directionsUrl, style: "bg-ink text-white" } : null,
    activeMenu.orderUrl ? { label: isMellowMoose ? "Order on Clover" : "Order", href: activeMenu.orderUrl, style: "bg-brand text-white" } : null,
    business.reviewUrl ? { label: "Reviews", href: business.reviewUrl, style: "border border-line bg-white text-ink" } : null,
    business.facebookUrl ? { label: "Facebook", href: business.facebookUrl, style: "border border-line bg-white text-ink" } : null,
    business.instagramUrl ? { label: "Instagram", href: business.instagramUrl, style: "border border-line bg-white text-ink" } : null,
    phoneUrl ? { label: "Call", href: phoneUrl, style: "border border-line bg-white text-ink" } : null
  ].filter(Boolean) as ActionLink[];

  if (isMellowMoose) {
    return (
      <MellowMooseShell
        business={business}
        actionLinks={actionLinks}
        activeMenu={activeMenu}
        groupedSections={sectionsWithMore}
        localFavorites={localFavorites}
        menuUrl={menuUrl}
        photoEmailLink={photoEmailLink}
      />
    );
  }

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-soft">
          <div className="relative min-h-[420px] bg-ink">
            <img src={business.heroImageUrl || "/assets/resonate-logo-flat.png"} alt={`${business.businessName} featured menu item`} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,27,31,.1),rgba(16,27,31,.76))]" />
            <div className="relative flex min-h-[420px] flex-col justify-end p-5 sm:p-8">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-black text-brandDark">{business.businessType}</p>
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
              {activeMenu.banner || business.statusNote ? <p className="mt-5 rounded-2xl bg-sage px-4 py-3 font-bold text-brandDark">{activeMenu.banner || business.statusNote}</p> : null}
            </div>

            <div className="rounded-2xl border border-line bg-cream p-4">
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
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {sectionsWithMore.map((section) => (
              <section key={section.id} id={section.id}>
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-line pb-3">
                  <h3 className="text-2xl font-black text-ink">{section.name}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-muted">{section.items.length} items</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <MenuCard key={item.id} item={item} isMellowMoose={false} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-[1.75rem] border border-line bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Share this menu</p>
            <img src={`/api/qr/${business.slug}`} alt={`QR code for ${business.businessName}`} className="mt-4 aspect-square w-full rounded-2xl border border-line bg-white p-3" />
            <p className="mt-4 break-all text-sm leading-6 text-muted">{menuUrl}</p>
            <a href={`/api/qr/${business.slug}`} className="mt-5 block rounded-full bg-ink px-5 py-3 text-center font-black text-white transition hover:-translate-y-0.5 hover:shadow-sm">Open QR code</a>
            <a href={photoEmailLink} className="mt-3 block rounded-full border border-line px-5 py-3 text-center font-black text-ink transition hover:border-brand">Send updates</a>
          </aside>
        </div>
      </section>
    </main>
  );
}
