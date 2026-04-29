import Link from "next/link";
import { IntakeForm } from "@/components/IntakeForm";
import { mailtoLink, questionsEmail } from "@/lib/contact";

const features = [
  {
    title: "Custom menu page",
    text: "A phone-friendly page shaped around the business's logo, colors, menu structure, photos, best sellers, prices, notes, and daily specials."
  },
  {
    title: "Today signal",
    text: "A simple location and hours block for food trucks, pop-ups, and small restaurants that move or change schedules."
  },
  {
    title: "QR amplifier",
    text: "Put one QR code on the truck, counter, receipt, or social profile and update the destination without reprinting anything."
  },
  {
    title: "Brand Mic Check",
    text: "Check whether the public page sounds and looks like the business: not a copied template, not a generic listing, and not a blurry menu photo."
  }
];

const sampleMenu = [
  ["The OG Smashburger", "$9.99", "/assets/mellow-moose-og-smashburger.jpg", "Local favorite"],
  ["Blazing Moose Fries", "$13.99", "/assets/mellow-moose-blazing-fries.jpg", "Best seller"],
  ["Hearty Shroom and Cheese Burger", "$11.99", "/assets/mellow-moose-hearty-shroom.jpg", "Mellow pick"]
];

const showcaseNotes = [
  "Logo, color, and menu tone become the design system.",
  "Best sellers and local favorites sit up front.",
  "QR, order, call, direction, and review actions stay obvious.",
  "Popup menus and sold-out notes can be switched when the day changes."
];

const customerView = [
  "A branded menu page that feels like the business",
  "Best sellers, local favorites, prices, and photos",
  "Order, call, directions, review, and share buttons",
  "Current hours, location, sold-out notes, and special events"
];

const ownerView = [
  "Update hours without rebuilding the page",
  "Post closing early, sold out, or weather notes",
  "Feature Happy Hour, Fry Day, combos, or daily specials",
  "Switch into popup mode when a second menu takes over"
];

const liveBadges = [
  {
    label: "Low inventory",
    title: "Warn before the rush",
    text: "Turn on a clear low-inventory signal when a best seller is almost gone.",
    image: "/assets/mellow-moose-low-inventory.jpg"
  },
  {
    label: "Closed today",
    title: "Make closed obvious",
    text: "Post a closed notice for weather, catering, maintenance, or sold-out days.",
    image: "/assets/mellow-moose-closed-sign.jpg"
  },
  {
    label: "Happy Hour",
    title: "Feature a timed special",
    text: "Promote a limited special without redesigning the whole menu page.",
    image: "/assets/mellow-moose-happy-hour.jpg"
  },
  {
    label: "Closing early",
    title: "Update the day fast",
    text: "Tell customers the current plan before they drive across town.",
    image: "/assets/mellow-moose-closing-early.jpg"
  }
];

export default function MenuPilotPage() {
  const photoEmailLink = mailtoLink(
    "MenuPilot photos and menu details",
    "Attach menu photos, food photos, pricing, hours, location, and any updates you want included."
  );

  return (
    <main>
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#4d8b72,#e8a93a,#d97856)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_0.85fr] md:py-28">
          <div className="self-center">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] text-ink md:text-7xl">
              Menu pages that feel like the business, not the platform.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              For food trucks, pop-ups, coffee shops, salons, and small restaurants that need menu items, hours, location, photos, and review links to come through clearly without looking like everyone else's hosted menu.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl bg-white px-5 py-4 leading-7 text-muted shadow-sm">
              Have photos already? Send menu photos, item photos, pricing, and questions to{" "}
              <a href={photoEmailLink} className="font-black text-brandDark">{questionsEmail}</a>.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pricing" className="min-h-12 rounded-full bg-brand px-6 py-3 text-center font-bold text-white shadow-soft hover:bg-brandDark">
                View monthly plans
              </Link>
              <Link href="/menupilot/examples" className="min-h-12 rounded-full border border-line bg-white px-6 py-3 text-center font-bold text-ink hover:border-brand">
                See MenuPilot examples
              </Link>
              <Link href="/m/mellow-moose-burgers" className="min-h-12 rounded-full border border-line bg-white px-6 py-3 text-center font-bold text-ink hover:border-brand">
                View example menu
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-line bg-white p-4 shadow-soft">
            <div className="rounded-[1.25rem] bg-cream p-5">
              <div className="border-b border-line pb-4">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-brand">Now playing</p>
                <h2 className="mt-2 text-3xl font-black text-ink">Mellow Moose Burgers</h2>
                <p className="mt-1 text-sm text-muted">Griffin&apos;s Food Court - Siloam Springs</p>
              </div>
              <div className="mt-5 grid gap-3">
                {sampleMenu.map(([item, price, image, note]) => (
                  <div key={item} className="grid grid-cols-[76px_1fr] gap-3 rounded-2xl border border-line bg-white p-3">
                    <img src={image} alt={item} className="h-20 w-20 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-bold text-ink">{item}</span>
                        <span className="font-black text-coral">{price}</span>
                      </div>
                      <span className="mt-2 inline-flex rounded-full bg-sage px-3 py-1 text-xs font-black text-brandDark">{note}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-ink p-4 text-white">
                <p className="text-sm font-bold">Quick actions</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm font-bold">
                  <span className="rounded-full bg-white/10 px-3 py-2">Get directions</span>
                  <span className="rounded-full bg-white/10 px-3 py-2">Leave review</span>
                  <span className="rounded-full bg-white/10 px-3 py-2">Order link</span>
                  <span className="rounded-full bg-white/10 px-3 py-2">Share menu</span>
                </div>
              </div>
              <Link href="/m/mellow-moose-burgers" className="mt-4 block rounded-full bg-brand px-5 py-3 text-center font-black text-white transition hover:bg-brandDark">
                View Mellow Moose menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Two sides of the product</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
              Customers see a clean menu. Owners get control behind it.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              MenuPilot is not just a pretty page. It is a customer-facing menu plus an owner workflow for the details that change during real business life.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.5rem] border border-line bg-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-brand">What the customer sees</p>
                  <h3 className="mt-2 text-3xl font-black text-ink">The public menu</h3>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-brandDark shadow-sm">Mobile first</span>
              </div>
              <div className="mt-6 grid gap-3">
                {customerView.map((item) => (
                  <div key={item} className="rounded-2xl bg-white p-4 font-bold text-ink shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-[1.5rem] border border-line bg-ink p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-gold">What you see</p>
                  <h3 className="mt-2 text-3xl font-black">The owner controls</h3>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">Live updates</span>
              </div>
              <div className="mt-6 grid gap-3">
                {ownerView.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/10 p-4 font-bold text-white">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Why it fits</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Discovery gets noisy for a lot of small businesses.
            </h2>
            <p className="mt-5 leading-7 text-muted">
            Customers often cannot find the current menu, location, hours, or reliable link. MenuPilot gives them one lightweight signal that can sit on Google, Instagram, QR codes, receipts, and signs while still feeling like the business they came looking for.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-ink">{feature.title}</h3>
              <p className="mt-3 leading-7 text-muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Admin-side signals</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              One click can change what customers need to know today.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Specials and status notes do not have to live on the menu every day. MenuPilot can give the owner simple switches for low inventory, closed notices, happy hour, popup menus, and early closing alerts.
            </p>
            <div className="mt-6 rounded-[1.25rem] border border-line bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brandDark">Owner control idea</p>
              <p className="mt-3 leading-7 text-muted">
                The public page stays polished. Behind it, the business can choose which signal is active, add a short note, and turn it off when the day changes.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {liveBadges.map((badge) => (
              <article key={badge.label} className="group overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  <img
                    src={badge.image}
                    alt={`${badge.label} menu status example`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-brandDark shadow-sm">
                    {badge.label}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-ink">{badge.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{badge.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sage">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Start with a Mic Check.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Before heavy automation, Resonate needs a clean intake loop: collect the business details, identify what is hard for customers to find, and recommend the low monthly or high monthly plan that actually fits.
            </p>
          </div>
          <IntakeForm />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              Show the custom work without taking over the customer page.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Mellow Moose gets a real customer menu they can share. MenuPilot gets a smaller showcase that explains what Resonate customized: brand color, menu structure, food photos, action links, QR code, and popup-ready controls.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/m/mellow-moose-burgers" className="rounded-full bg-brand px-5 py-3 text-center font-black text-white shadow-soft hover:bg-brandDark">
                Open Mellow Moose
              </Link>
              <a href={photoEmailLink} className="rounded-full border border-line bg-white px-5 py-3 text-center font-black text-ink hover:border-brand">
                Send menu details
              </a>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-line bg-cream p-5 shadow-soft">
            <h3 className="text-2xl font-black text-ink">What the example proves</h3>
            <div className="mt-5 grid gap-3">
              {showcaseNotes.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-black text-brandDark">{index + 1}</span>
                  <span className="font-bold text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
