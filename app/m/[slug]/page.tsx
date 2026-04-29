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
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff6422] text-lg font-black text-white shadow-[0_6px_0_rgba(45,23,6,.16)]">
      {children}
    </span>
  );
}

function cleanPrice(price?: string | null) {
  if (!price) {
    return null;
  }

  return price.split("/")[0].trim();
}

function FeaturedFavoriteCard({ item, index }: { item: MenuItem; index: number }) {
  const badge = item.badge || (index === 0 ? "Best seller" : "Local favorite");

  return (
    <a
      href={`#item-${item.id}`}
      className="group overflow-hidden rounded-[1.15rem] border border-[#dfd2c3] bg-[#fffaf3] shadow-[0_16px_35px_rgba(55,34,22,.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(55,34,22,.18)]"
    >
      <div className="relative overflow-hidden bg-[#eadfce]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-[19rem] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-[19rem] items-center justify-center bg-[#f5eadc] text-5xl font-black text-[#3b261a]">MM</div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white ${index === 0 ? "bg-[#ff6422]" : index === 1 ? "bg-[#2f9c96]" : "bg-[#ffc22e] text-[#3b261a]"}`}>
          {badge}
        </span>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <h3 className="text-2xl font-black leading-tight text-[#21140d] [text-wrap:balance]">{item.name}</h3>
          {item.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#68513f]">{item.description}</p> : null}
        </div>
        {cleanPrice(item.price) ? <span className="justify-self-start rounded-full bg-[#3a2418] px-4 py-2 text-lg font-black text-white sm:justify-self-end">{cleanPrice(item.price)}</span> : null}
      </div>
    </a>
  );
}

function MellowSectionPanel({ section, orderUrl }: { section: MenuSection & { items: MenuItem[] }; orderUrl?: string | null }) {
  return (
    <section className="rounded-[1.25rem] bg-[#fffaf3] p-5 text-[#21140d] shadow-[0_14px_30px_rgba(22,10,4,.16)]">
      <h3 className="flex items-center gap-2 text-2xl font-black">
        <span className="h-2 w-2 rounded-full bg-[#ff6422]" />
        {section.name}
      </h3>
      <div className="mt-6 divide-y divide-[#e2d3c4]">
        {section.items.map((item) => (
          <a key={item.id} id={`item-${item.id}`} href={orderUrl || "#"} className="grid gap-3 py-4 transition first:pt-0 last:pb-0 hover:translate-x-1 sm:grid-cols-[auto_1fr_auto] sm:items-start">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-xl object-cover shadow-sm" /> : null}
            <div className={item.imageUrl ? "" : "sm:col-start-1 sm:col-end-3"}>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-black leading-tight">{item.name}</h4>
                {item.badge ? <span className="rounded-full bg-[#d8f0ea] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#277067]">{item.badge}</span> : null}
                {item.isSoldOut ? <span className="rounded-full bg-[#f7e5d2] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#9b3d08]">Sold out</span> : null}
              </div>
              {item.description ? <p className="mt-1 max-w-[34rem] text-sm leading-5 text-[#6f5746]">{item.description}</p> : null}
            </div>
            {cleanPrice(item.price) ? <span className="font-black text-[#ff6422]">{cleanPrice(item.price)}</span> : null}
          </a>
        ))}
      </div>
    </section>
  );
}

function MenuCard({
  item,
  isMellowMoose,
  orderUrl,
  phoneUrl
}: {
  item: MenuItem;
  isMellowMoose: boolean;
  orderUrl?: string | null;
  phoneUrl?: string | null;
}) {
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
        {isMellowMoose ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {orderUrl ? (
              <a href={orderUrl} className="rounded-full border-2 border-[#25150b] bg-[#25150b] px-4 py-2 text-center text-sm font-black text-white transition hover:-translate-y-0.5">
                Order on Clover
              </a>
            ) : null}
            {phoneUrl ? (
              <a href={phoneUrl} className="rounded-full border-2 border-[#25150b] bg-[#fff4df] px-4 py-2 text-center text-sm font-black text-[#25150b] transition hover:-translate-y-0.5 hover:bg-[#f9ce46]">
                Call to order
              </a>
            ) : null}
          </div>
        ) : null}
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
  directionsUrl,
  phoneUrl
}: {
  business: MenuBusiness;
  actionLinks: ActionLink[];
  activeMenu: ReturnType<typeof getActiveMenu>;
  groupedSections: Array<MenuSection & { items: MenuItem[] }>;
  localFavorites: MenuItem[];
  menuUrl: string;
  directionsUrl: string | null;
  phoneUrl: string | null;
}) {
  const hours = [
    ["Mon", "Closed"],
    ["Tue", "11 AM-2 PM & 4-8 PM"],
    ["Wed", "11 AM-2 PM & 4-8 PM"],
    ["Thu", "11 AM-2 PM & 4-8 PM"],
    ["Fri", "11 AM-2 PM & 4-8 PM"],
    ["Sat", "11 AM-5 PM"],
    ["Sun", "Closed"]
  ];
  const featuredItems = activeMenu.items.filter((item) => !item.isSoldOut && item.imageUrl).slice(0, 4);
  const mappedAddress = business.address || business.locationSummary || business.city || business.businessName;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mappedAddress)}&output=embed`;
  const isDosGordos = activeMenu.key === "dos-gordos";
  const todaySpecials = isDosGordos
    ? [
        { label: "Special event", title: "Dos Gordos Takeover", body: "Birria tacos, Cali fries, and the Birria Moose Burger are running today." },
        { label: "Order flow", title: "Same Clover link", body: "The order button still sends customers to the current Clover menu." },
        { label: "Back anytime", title: "Return to Mellow Moose", body: "One switch brings the page back to the regular burger menu." }
      ]
    : [
        { label: "Happy Hour", title: "$1 off regular burgers", body: "Make the deal obvious before customers reach the menu." },
        { label: "Combo", title: "2 for $22", body: "Two Mellow Moose Burgers and two fries. Mention the post at the window." },
        { label: "Fry Day", title: "Schmac Fry Special", body: "Fridays can feature the fry special right on the live menu." }
      ];

  return (
    <main className="min-h-screen bg-[#f8f0e5] text-[#2f1c12]">
      <header className="border-b border-[#e3d7ca] bg-[#fbf6ee]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={business.heroImageUrl || "/assets/mellow-moose-logo.jpg"} alt={`${business.businessName} logo`} className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-black leading-none">{business.businessName}<span className="text-[#ff6422]">.</span></span>
          </a>
          {activeMenu.orderUrl ? (
            <a href={activeMenu.orderUrl} className="rounded-full bg-[#ff6422] px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#e65318]">
              Order on Clover
            </a>
          ) : null}
        </div>
      </header>

      <section id="top" className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
        <div>
          <span className="inline-flex rounded-full bg-[#4a3324] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
            {isDosGordos ? "Special event - Siloam Springs" : "Now serving - Siloam Springs"}
          </span>
          <h1 className="mt-5 text-6xl font-black leading-[0.9] tracking-tight text-[#3a2418] [text-wrap:balance] md:text-7xl">
            {isDosGordos ? "Dos Gordos" : "Mellow Moose"}<br />
            <span className="text-white drop-shadow-[0_1px_0_rgba(58,36,24,.12)]">{isDosGordos ? "Takeover." : "Burgers."}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#4d3525]">
            {isDosGordos
              ? "Dos Gordos Takeover at Mellow Moose brings back birria tacos, Cali fries, and throwback specials from the little orange truck at Griffin's Food Court."
              : "Smash burgers, loaded fries, salads, kids meals, and rotating specials from a little orange truck at Griffin's Food Court."}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {activeMenu.orderUrl ? (
              <a href={activeMenu.orderUrl} className="rounded-full bg-[#3a2418] px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
                Order on Clover
              </a>
            ) : null}
            {actionLinks
              .filter((action) => ["Directions", "Call"].includes(action.label))
              .map((action) => (
                <a key={action.label} href={action.href} className="rounded-full border border-[#cdbdaf] bg-[#fbf6ee] px-7 py-3 text-sm font-black text-[#3a2418] transition hover:-translate-y-0.5 hover:bg-white">
                  {action.label}
                </a>
              ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#5b4331]">
            <span>Open Tue-Sat</span>
            <span>Griffin&apos;s Food Court</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[360px]">
          <div className="rounded-[2rem] border-4 border-[#ded5cb] bg-[#fffaf3] p-7 shadow-[0_16px_35px_rgba(55,34,22,.12)]">
            <img src={business.heroImageUrl || "/assets/mellow-moose-logo.jpg"} alt={`${business.businessName} logo`} className="aspect-square w-full object-contain" />
          </div>
          <span className="absolute -bottom-3 right-3 rotate-6 rounded-full bg-[#ffc22e] px-5 py-2 text-sm font-black text-[#3a2418] shadow-[0_8px_20px_rgba(55,34,22,.15)]">Hey there</span>
        </div>
      </section>

      {activeMenu.banner ? (
        <section className="mx-auto max-w-5xl px-5 pb-8">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-dashed border-[#bba995] bg-[#fffaf3] py-4 pl-16 pr-5 text-lg font-black text-[#3a2418]">
            <span className="absolute left-0 top-0 flex h-full w-10 items-center justify-center bg-[#ff6422] text-[0.62rem] font-black uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl]">
              Takeover
            </span>
            <span>{activeMenu.banner}</span>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-5xl px-5 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {todaySpecials.map((special) => (
            <article key={special.title} className="rounded-[1rem] border border-[#dfd2c3] bg-[#fffaf3] p-5 shadow-[0_10px_25px_rgba(55,34,22,.08)]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff6422]">{special.label}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-[#21140d]">{special.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#68513f]">{special.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff6422]">{isDosGordos ? "Takeover menu" : "Start here"}</p>
        <h2 className="mt-2 text-4xl font-black leading-none text-[#21140d]">{isDosGordos ? "Dos Gordos at Mellow Moose" : "Local Favorites"}</h2>
        <p className="mt-2 text-sm text-[#5b4331]">{isDosGordos ? "Throwback items running during popup mode." : "What the Burger Fam comes back for."}</p>
        <div className="mt-8 grid gap-7 md:grid-cols-2">
          {featuredItems.map((item, index) => (
            <FeaturedFavoriteCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-[#3a2418] py-16 text-white">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc22e]">{isDosGordos ? "Special event" : "The whole menu"}</p>
              <h2 className="mt-2 text-4xl font-black leading-none">{isDosGordos ? "Takeover Menu" : "Full Menu"}</h2>
              <p className="mt-2 text-sm text-[#e8d7c8]">{isDosGordos ? "Tap an item to order while the popup is active." : "Tap an item to open Clover."}</p>
            </div>
            {activeMenu.orderUrl ? (
              <a href={activeMenu.orderUrl} className="rounded-full bg-[#ff6422] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
                Order on Clover
              </a>
            ) : null}
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            {groupedSections.map((section) => (
              <MellowSectionPanel key={section.id} section={section} orderUrl={activeMenu.orderUrl} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-16 md:grid-cols-2">
        <article className="rounded-[1.25rem] border border-[#dfd2c3] bg-[#fffaf3] p-6 shadow-[0_16px_35px_rgba(55,34,22,.10)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff6422]">Find the truck</p>
          <h2 className="mt-2 text-3xl font-black text-[#21140d]">Griffin&apos;s Food Court</h2>
          <p className="mt-2 text-[#5b4331]">{business.address}</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-[#dfd2c3] bg-[#eadfce]">
            <iframe title={`${business.businessName} map`} src={mapSrc} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {directionsUrl ? <a href={directionsUrl} className="rounded-full bg-[#ff6422] px-5 py-3 text-sm font-black text-white">Get Directions</a> : null}
            {phoneUrl ? <a href={phoneUrl} className="rounded-full border border-[#cdbdaf] bg-[#fbf6ee] px-5 py-3 text-sm font-black text-[#3a2418]">Call</a> : null}
          </div>
        </article>

        <article className="rounded-[1.25rem] border border-[#dfd2c3] bg-[#fffaf3] p-6 shadow-[0_16px_35px_rgba(55,34,22,.10)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f9c96]">When we&apos;re slingin&apos;</p>
          <h2 className="mt-2 text-3xl font-black text-[#21140d]">Hours</h2>
          {business.statusNote ? (
            <p className="mt-4 rounded-xl bg-[#3a2418] px-4 py-3 text-sm font-black leading-6 text-white">
              {business.statusNote}
            </p>
          ) : null}
          <div className="mt-5 divide-y divide-[#dfd2c3]">
            {hours.map(([day, value]) => (
              <div key={day} className="grid grid-cols-[80px_1fr] py-3 text-sm">
                <span className="font-black text-[#21140d]">{day}</span>
                <span className="text-right font-bold text-[#5b4331]">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-xl bg-[#eadfce] p-4 text-sm leading-6 text-[#6f5746]">
            Food truck hours can shift with weather, events, catering, or sellouts. Check here or Facebook before you roll out, Burger Fam.
          </p>
        </article>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-8 rounded-[1.5rem] bg-[linear-gradient(135deg,#ff6422,#ffc22e)] p-7 text-[#2f1c12] shadow-[0_16px_40px_rgba(55,34,22,.14)] md:grid-cols-[minmax(0,1fr)_18rem] md:items-center md:p-9">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em]">Share the menu</p>
            <h2 className="mt-2 text-4xl font-black leading-none">Scan. Share. Smash.</h2>
            <p className="mt-4 max-w-xl leading-7">
              Drop this QR on the truck, the counter, or your story. It opens the live menu.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`/api/qr/${business.slug}`} className="rounded-full bg-[#3a2418] px-5 py-3 text-sm font-black text-white">Open QR code</a>
              {activeMenu.orderUrl ? <a href={activeMenu.orderUrl} className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#3a2418]">Order on Clover</a> : null}
            </div>
          </div>
          <div className="w-full max-w-[15.5rem] justify-self-center rounded-[1.35rem] bg-[#fff8ed] p-5 text-center shadow-[0_14px_32px_rgba(55,34,22,.18)] ring-1 ring-white/70 md:justify-self-end">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-[1rem] bg-white p-3 shadow-[inset_0_0_0_1px_rgba(58,36,24,.08)]">
              <img src={`/api/qr/${business.slug}`} alt={`QR code for ${business.businessName}`} className="h-full w-full" />
            </div>
            <p className="mt-4 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#8b4a22]">Live menu</p>
            <p className="mt-1 text-sm font-black leading-5 text-[#3a2418]">resonate.solutions</p>
            <p className="text-xs font-bold leading-5 text-[#6e4c37]">/m/mellow-moose-burgers</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <div className="rounded-[1.25rem] border border-dashed border-[#bba995] bg-[#fffaf3] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="inline-flex rounded-full bg-[#d8f0ea] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#277067]">Special event mode</p>
              <h2 className="mt-4 text-2xl font-black text-[#21140d]">{isDosGordos ? "Return to Mellow Moose Burgers" : "Dos Gordos Takeover at Mellow Moose"}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#5b4331]">
                {isDosGordos
                  ? "Popup mode is on. This control returns the live page to the regular Mellow Moose burger menu."
                  : "Flip on popup mode for taco days. The same page can surface a takeover banner and Dos Gordos menu when activated."}
              </p>
            </div>
            <a href={isDosGordos ? "/m/mellow-moose-burgers" : "?menu=dos-gordos"} className="rounded-full bg-[#2f9c96] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
              {isDosGordos ? "Back to burger menu" : "Preview popup mode"}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#3a2418] px-5 py-8 text-white">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img src={business.heroImageUrl || "/assets/mellow-moose-logo.jpg"} alt="" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-black">{business.businessName}</span>
          </div>
          <p className="text-sm text-[#e8d7c8]">Siloam Springs, AR - Formerly Dos Gordos Tacos</p>
        </div>
      </footer>
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
        directionsUrl={directionsUrl}
        phoneUrl={phoneUrl}
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
