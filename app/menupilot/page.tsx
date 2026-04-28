import Link from "next/link";
import { IntakeForm } from "@/components/IntakeForm";
import { mailtoLink, questionsEmail } from "@/lib/contact";

const features = [
  {
    title: "Menu signal page",
    text: "A clean menu that loads fast on a phone, with sections, prices, sold-out notes, photos, and daily specials."
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
    title: "Soundcheck audit",
    text: "Check the public essentials: hours, services, menu link, photos, customer links, and the details that make people choose."
  }
];

const sampleMenu = [
  ["Classic Smash Burger", "$9", "/assets/menu-photo-burger.svg", "Best seller"],
  ["Loaded Truck Fries", "$7", "/assets/menu-photo-fries.svg", "Shareable"],
  ["Craft Lemonade", "$4", "/assets/menu-photo-lemonade.svg", "Rotates"]
];

const approvalItems = [
  "Approved business name and logo",
  "Current menu items with prices",
  "3 to 8 food photos or a time to take them",
  "Hours, service location, and move-around schedule",
  "Order, review, Facebook, Instagram, or phone links",
  "Any items that sell out, rotate, or need a note"
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
            <p className="inline-flex rounded-full bg-sage px-4 py-2 text-sm font-bold text-brandDark">MenuPilot by Resonate Solutions</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] text-ink md:text-7xl">
              Tune your menu into a clear customer signal.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              For food trucks, pop-ups, coffee shops, salons, and small restaurants that need menu items, hours, location, photos, and review links to come through clearly without building a full website.
            </p>
            <p className="mt-5 max-w-2xl rounded-2xl bg-white px-5 py-4 leading-7 text-muted shadow-sm">
              Have photos already? Send menu photos, item photos, pricing, and questions to{" "}
              <a href={photoEmailLink} className="font-black text-brandDark">{questionsEmail}</a>.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pricing" className="min-h-12 rounded-full bg-brand px-6 py-3 text-center font-bold text-white shadow-soft hover:bg-brandDark">
                View launch plans
              </Link>
              <Link href="/" className="min-h-12 rounded-full border border-line bg-white px-6 py-3 text-center font-bold text-ink hover:border-brand">
                See full offer
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-line bg-white p-4 shadow-soft">
            <div className="rounded-[1.25rem] bg-cream p-5">
              <div className="border-b border-line pb-4">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-brand">Now playing</p>
                <h2 className="mt-2 text-3xl font-black text-ink">Bentonville Square</h2>
                <p className="mt-1 text-sm text-muted">11:00 AM - 2:00 PM - Near the south entrance</p>
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
              <Link href="/m/burger-truck-preview" className="mt-4 block rounded-full bg-brand px-5 py-3 text-center font-black text-white transition hover:bg-brandDark">
                View burger truck preview
              </Link>
            </div>
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
            Customers often cannot find the current menu, location, hours, or reliable link. MenuPilot gives them one lightweight signal that can sit on Google, Instagram, QR codes, receipts, and signs.
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

      <section className="bg-sage">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brandDark">Backend start</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              The first real workflow is a Soundcheck request.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Before heavy automation, Resonate needs a clean intake loop: collect the business details, identify what is hard for customers to find, and turn that into a launch kit or upkeep plan.
            </p>
          </div>
          <IntakeForm />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Real-client ready</p>
            <h2 className="mt-3 text-4xl font-black text-ink md:text-5xl">
              While we wait for approval, the burger truck version is already staged.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              This preview uses permission-safe sample copy and art. Once a business owner approves, the structure stays the same and we swap in the real menu, photos, hours, location, and links.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/m/burger-truck-preview" className="rounded-full bg-brand px-5 py-3 text-center font-black text-white shadow-soft hover:bg-brandDark">
                Open burger truck preview
              </Link>
              <a href={photoEmailLink} className="rounded-full border border-line bg-white px-5 py-3 text-center font-black text-ink hover:border-brand">
                Send menu details
              </a>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-line bg-cream p-5 shadow-soft">
            <h3 className="text-2xl font-black text-ink">Approval checklist</h3>
            <p className="mt-2 leading-7 text-muted">
              The handoff should feel easy for the owner. This is all we need before turning the preview into their actual customer page.
            </p>
            <div className="mt-5 grid gap-3">
              {approvalItems.map((item, index) => (
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
