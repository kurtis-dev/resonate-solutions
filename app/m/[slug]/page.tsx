import { notFound } from "next/navigation";
import { getMenuBusiness, publicMenuUrl } from "@/lib/menu-store";

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

export default async function PublicMenuPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getMenuBusiness(slug);

  if (!business) {
    notFound();
  }

  const menuUrl = publicMenuUrl(business.slug);
  const directionsUrl = actionUrl("directions", business.address || business.locationSummary);
  const phoneUrl = actionUrl("phone", business.phone);
  const heroImage = business.heroImageUrl || "/assets/menu-bowl.svg";
  const section = business.sections[0];

  return (
    <main className="bg-cream">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-soft">
          <img src={heroImage} alt={`${business.businessName} menu item`} className="h-80 w-full object-cover lg:h-full" />
        </div>
        <div className="self-center rounded-[1.75rem] border border-line bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">{business.businessType}</p>
          <h1 className="mt-3 text-5xl font-black leading-none text-ink md:text-7xl">{business.businessName}</h1>
          {business.description ? <p className="mt-5 text-lg leading-8 text-muted">{business.description}</p> : null}
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
            <p className="mt-5 rounded-2xl bg-sage px-4 py-3 font-bold text-brandDark">{business.statusNote}</p>
          ) : null}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {directionsUrl ? <a href={directionsUrl} className="rounded-full bg-ink px-5 py-3 text-center font-black text-white">Directions</a> : null}
            {business.orderingUrl ? <a href={business.orderingUrl} className="rounded-full bg-brand px-5 py-3 text-center font-black text-white">Order</a> : null}
            {business.reviewUrl ? <a href={business.reviewUrl} className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Reviews</a> : null}
            {business.instagramUrl ? <a href={business.instagramUrl} className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Instagram</a> : null}
            {phoneUrl ? <a href={phoneUrl} className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Call</a> : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{section?.name || "Menu"}</p>
              <h2 className="mt-2 text-4xl font-black text-ink">Current menu</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {business.items.map((item) => (
                <article key={item.id} className={`overflow-hidden rounded-2xl border border-line bg-white shadow-sm ${item.isSoldOut ? "opacity-60" : ""}`}>
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-44 w-full object-cover" /> : null}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-black text-ink">{item.name}</h3>
                      {item.price ? <span className="font-black text-coral">{item.price}</span> : null}
                    </div>
                    {item.description ? <p className="mt-2 leading-7 text-muted">{item.description}</p> : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.badge ? <span className="rounded-full bg-sage px-3 py-1 text-xs font-black text-brandDark">{item.badge}</span> : null}
                      {item.isSoldOut ? <span className="rounded-full bg-cream px-3 py-1 text-xs font-black text-coral">Sold out</span> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-[1.75rem] border border-line bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Share this menu</p>
            <img src={`/api/qr/${business.slug}`} alt={`QR code for ${business.businessName}`} className="mt-4 aspect-square w-full rounded-2xl border border-line bg-white p-3" />
            <p className="mt-4 break-all text-sm leading-6 text-muted">{menuUrl}</p>
            <a href={`/api/qr/${business.slug}`} className="mt-5 block rounded-full bg-ink px-5 py-3 text-center font-black text-white">Open QR code</a>
          </aside>
        </div>
      </section>
    </main>
  );
}
