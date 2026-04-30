import Link from "next/link";
import { mailtoLink, questionsEmail } from "@/lib/contact";

const sampleMenu = [
  {
    name: "The OG Smashburger",
    price: "$9.50",
    image: "/assets/mellow-moose-og-smashburger.jpg",
    tag: "Best seller"
  },
  {
    name: "Blazing Moose Fries",
    price: "$7.00",
    image: "/assets/mellow-moose-blazing-fries.jpg",
    tag: "Local favorite"
  },
  {
    name: "Jalapeno Ranch Bacon",
    price: "$11.00",
    image: "/assets/mellow-moose-jalapeno-ranch-bacon.jpg",
    tag: "Menu pick"
  }
];

const customerView = [
  "A branded mobile menu that feels like your business",
  "Food photos, prices, best sellers, and local favorites",
  "Order, call, directions, review, and share buttons",
  "Current hours, location, specials, and sold-out notes"
];

const ownerView = [
  "Change hours without rebuilding your site",
  "Post closing early, sold out, or weather notes",
  "Feature happy hour, combo deals, or daily specials",
  "Switch into popup mode when a second menu takes over",
  "Update location when the truck moves",
  "Keep the page current without relying on Facebook"
];

const adminControls = [
  {
    title: "Low inventory warning",
    label: "Almost gone",
    text: "Turn on when an item is almost gone.",
    customerSees: "Almost out of brisket - get it before it is gone.",
    active: false
  },
  {
    title: "Sorry, we are closed",
    label: "Closed",
    text: "Use for unexpected closures.",
    customerSees: "We are closed today. Back tomorrow at 11a.",
    active: false
  },
  {
    title: "Happy Hour all day",
    label: "Special",
    text: "Promote a time-based deal.",
    customerSees: "$2 off all baskets today only.",
    active: true
  },
  {
    title: "Closing early",
    label: "Hours",
    text: "Let folks know before they drive.",
    customerSees: "Closing at 6p tonight. Last orders at 5:45p.",
    active: false
  },
  {
    title: "Sold out",
    label: "Sold out",
    text: "Mark items unavailable.",
    customerSees: "Sold out: Cowboy Burger. Back Friday.",
    active: false
  },
  {
    title: "Changed location",
    label: "Moved",
    text: "Update where the truck is parked.",
    customerSees: "Today only - parked at Memorial Park.",
    active: false
  },
  {
    title: "Daily special",
    label: "Featured",
    text: "Feature one item up top.",
    customerSees: "Today: Slammer Jammer and fries for $13.",
    active: true
  },
  {
    title: "Popup menu active",
    label: "Takeover",
    text: "Switch to a takeover menu.",
    customerSees: "Dos Gordos Takeover - tortas and tacos today.",
    active: false
  }
];

const reasons = [
  {
    title: "Facebook posts disappear",
    text: "Today&apos;s update gets buried under tomorrow&apos;s post. New customers may never see it."
  },
  {
    title: "Google is not always enough",
    text: "Hours can go stale, photos can feel random, and specials rarely get the room they need."
  },
  {
    title: "Ordering pages are not storefronts",
    text: "Clover and delivery links are useful, but they do not always explain who you are or why people should choose you."
  },
  {
    title: "Screenshots are not a menu",
    text: "Blurry paper-menu photos make it harder for customers to trust what they are reading."
  },
  {
    title: "One front door",
    text: "Link to ordering, directions, phone, reviews, socials, QR codes, and current updates from one polished page."
  },
  {
    title: "Always current",
    text: "Sold out, closing early, weather closures, popup takeovers, and location changes can be made obvious."
  }
];

const brandItems = ["Your colors", "Your photos", "Your voice", "Your story"];

const planCards = [
  {
    name: "Owner Managed",
    tag: "You drive",
    text: "For businesses that want a custom menu page and simple controls to update hours, specials, sold-out items, and status notes themselves.",
    cta: "Start your MenuPilot page",
    href: "/pricing",
    featured: false,
    items: [
      "Custom-branded MenuPilot page",
      "Self-serve admin for hours and status",
      "Sold-out, specials, and popup toggles",
      "Order, call, directions, and share buttons",
      "Email support"
    ]
  },
  {
    name: "Resonate Managed",
    tag: "We drive",
    text: "For businesses that want Resonate Solutions to handle menu changes, photo swaps, specials, and page improvements for them.",
    cta: "Send menu photos and details",
    href: `mailto:${questionsEmail}`,
    featured: true,
    items: [
      "Everything in Owner Managed",
      "We update hours, specials, and sold-out items",
      "Menu changes and price updates handled for you",
      "Photo swaps and seasonal refreshes",
      "Ongoing page improvements",
      "Priority text and email support"
    ]
  }
];

function CheckLine({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className={dark ? "font-black text-gold" : "font-black text-brand"}>✓</span>
      <span>{children}</span>
    </li>
  );
}

function PhonePreview() {
  return (
    <div className="relative mx-auto max-w-[360px] rounded-[2.35rem] border-[7px] border-ink bg-white shadow-soft">
      <div className="absolute -right-5 -top-4 rotate-3 rounded-full bg-gold px-4 py-2 text-sm font-black text-ink shadow-sm">
        Live preview
      </div>
      <div className="flex items-center justify-between rounded-t-[1.85rem] bg-ink px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">
        <span>9:41</span>
        <span>Sample menu</span>
        <span>...</span>
      </div>
      <div className="bg-[linear-gradient(135deg,#4d8b72,#dce9df)] px-6 py-7 text-ink">
        <span className="rounded-full bg-ink px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
          Open today - 11a-8p
        </span>
        <h2 className="mt-4 text-3xl font-black leading-none">Mellow Moose Burgers</h2>
        <p className="mt-2 text-sm font-semibold">Smash burgers - Siloam Springs, AR</p>
        <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs font-black">
          {["Order", "Map", "Call", "Share"].map((action) => (
            <span key={action} className="rounded-2xl bg-white/95 px-2 py-3 shadow-sm">
              {action}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-b-[1.85rem] bg-cream px-5 py-5">
        <div className="flex items-end justify-between">
          <h3 className="text-lg font-black text-ink">Local Favorites</h3>
          <span className="text-xs font-black uppercase tracking-[0.12em] text-brandDark">See all</span>
        </div>
        <div className="mt-4 grid gap-3">
          {sampleMenu.map((item) => (
            <div key={item.name} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm">
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-sage px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-brandDark">
                  {item.tag}
                </span>
                <p className="mt-1 truncate font-black text-ink">{item.name}</p>
              </div>
              <span className="rounded-full bg-ink px-3 py-2 text-sm font-black text-white">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MenuPilotPage() {
  const photoEmailLink = mailtoLink(
    "MenuPilot photos and menu details",
    "Attach menu photos, food photos, pricing, hours, location, and any updates you want included."
  );

  return (
    <main className="bg-cream">
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-black text-white">M</span>
            <span>
              <span className="block text-lg font-black leading-none text-ink">MenuPilot</span>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-muted">by Resonate Solutions</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-bold text-muted md:flex">
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
            <a href="#controls" className="hover:text-ink">Controls</a>
            <a href="#why" className="hover:text-ink">Why it matters</a>
            <a href="#plans" className="hover:text-ink">Plans</a>
          </nav>
          <Link href="/pricing" className="rounded-full bg-brand px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-brandDark">
            Start your page
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#4d8b72,#dce9df,#e8a93a,#d97856)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_0.85fr] lg:py-24">
          <div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-ink md:text-7xl">
              Menu pages that feel like <span className="text-brand">your business</span>, not the platform.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              Give customers one clean place to find your menu, hours, location, specials, food photos, and order links without sending them hunting through social posts or blurry menu screenshots.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/m/mellow-moose-burgers" className="rounded-full bg-brand px-7 py-4 text-center font-black text-white shadow-soft transition hover:bg-brandDark">
                See example menu
              </Link>
              <Link href="/pricing" className="rounded-full border border-line bg-white px-7 py-4 text-center font-black text-ink shadow-sm transition hover:border-brand">
                View monthly plans
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-muted">
              {["Mobile-first", "Custom branded", "Update in one click"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="text-brand">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <PhonePreview />
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">How it works</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
              One polished page out front. Real controls behind it.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-line bg-cream p-7 shadow-sm">
              <span className="inline-flex rounded-full bg-sage px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-brandDark">
                What customers see
              </span>
              <h3 className="mt-5 text-3xl font-black text-ink">A branded mobile menu</h3>
              <ul className="mt-6 grid gap-4 text-muted">
                {customerView.map((item) => (
                  <CheckLine key={item}>{item}</CheckLine>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.75rem] bg-ink p-7 text-white shadow-soft">
              <span className="inline-flex rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink">
                What owners control
              </span>
              <h3 className="mt-5 text-3xl font-black">Real updates, no rebuild</h3>
              <ul className="mt-6 grid gap-4 text-white/90">
                {ownerView.map((item) => (
                  <CheckLine key={item} dark>{item}</CheckLine>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="controls" className="border-y border-line bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Admin controls</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
                One click can change what customers need to know today.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">
                Your public menu stays polished. Behind it, you can turn on the right signal for the day.
              </p>
            </div>
            <div className="rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-muted shadow-sm">
              Try the toggles - this is how the admin side should feel.
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {adminControls.map((control) => (
              <article
                key={control.title}
                className={`group rounded-[1.5rem] border-2 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${
                  control.active ? "border-brand" : "border-line hover:border-brand"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${
                      control.active ? "bg-brand text-white" : "bg-sage text-brandDark"
                    }`}>
                      {control.label}
                    </span>
                    <h3 className="mt-4 text-xl font-black leading-tight text-ink">{control.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-muted">{control.text}</p>
                  </div>
                  <span className={`mt-1 h-7 w-12 rounded-full p-1 transition ${
                    control.active ? "bg-brand" : "bg-line group-hover:bg-brand"
                  }`}>
                    <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      control.active ? "translate-x-5" : "group-hover:translate-x-5"
                    }`} />
                  </span>
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-line bg-cream p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted">Customer sees</p>
                  <p className="mt-2 text-sm font-bold leading-5 text-ink">{control.customerSees}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Why MenuPilot</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
              Customers should not have to dig to know if you are open.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted">
              Food trucks and small restaurants change hours, locations, specials, and availability often. People deserve one current place to check before they drive over.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title} className="rounded-[1.5rem] border border-line bg-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage text-lg font-black text-brandDark">+</span>
                <h3 className="mt-5 text-xl font-black text-ink">{reason.title}</h3>
                <p className="mt-3 leading-7 text-muted" dangerouslySetInnerHTML={{ __html: reason.text }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-gold">Custom branding</p>
            <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
              This is not one menu template for everyone.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-white/80">
              Your page should use your logo, colors, menu style, food photos, voice, and customer experience. MenuPilot is designed around your business - not around Resonate Solutions.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {brandItems.map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-black text-white">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-cream p-6 text-ink shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brandDark">Brand kit sample</p>
                <h3 className="mt-2 text-3xl font-black">Mellow Moose Burgers</h3>
              </div>
              <span className="rounded-full bg-sage px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-brandDark">Live customer</span>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3">
              {[
                ["Sage", "bg-brand"],
                ["Cream", "bg-cream border border-line"],
                ["Gold", "bg-gold"],
                ["Coral", "bg-coral"]
              ].map(([name, color]) => (
                <div key={name}>
                  <div className={`h-20 rounded-2xl ${color}`} />
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-muted">{name}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {sampleMenu.map((item) => (
                <img key={item.name} src={item.image} alt={item.name} className="aspect-square rounded-2xl object-cover shadow-sm" />
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm text-muted">
              Menu voice: <span className="font-black text-ink">current, easy to scan, and unmistakably yours.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand">Plans</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink md:text-5xl">
              Two ways to run your MenuPilot page.
            </h2>
            <p className="mt-4 leading-7 text-muted">Pick the level of help you want. We build the page either way.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {planCards.map((plan) => (
              <article key={plan.name} className={`rounded-[1.75rem] border-2 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${
                plan.featured ? "border-brand" : "border-line"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-3xl font-black text-ink">{plan.name}</h3>
                  <span className="rounded-full bg-sage px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-brandDark">{plan.tag}</span>
                </div>
                <p className="mt-4 leading-7 text-muted">{plan.text}</p>
                <ul className="mt-7 grid gap-3 text-muted">
                  {plan.items.map((item) => (
                    <CheckLine key={item}>{item}</CheckLine>
                  ))}
                </ul>
                <div className="mt-8">
                  <p className="text-3xl font-black text-ink">Monthly plan</p>
                  <p className="mt-1 text-sm text-muted">
                    {plan.featured ? "Quoted based on update frequency and menu size." : "Setup fee plus low monthly. Custom quoted per business."}
                  </p>
                </div>
                <Link href={plan.href} className={`mt-7 block rounded-full px-6 py-4 text-center font-black shadow-sm transition ${
                  plan.featured ? "bg-ink text-white hover:bg-brandDark" : "bg-brand text-white hover:bg-brandDark"
                }`}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="rounded-[2rem] bg-[linear-gradient(135deg,#4d8b72,#dce9df,#e8a93a)] p-8 shadow-soft md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-4xl font-black leading-tight text-ink md:text-5xl">Let&apos;s build your front door.</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/80">
                  Send your menu, a few food photos, and your hours. We will send back a custom MenuPilot page that actually looks like your business.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/pricing" className="rounded-full bg-ink px-7 py-4 text-center font-black text-white shadow-sm transition hover:bg-brandDark">
                  Start your MenuPilot page
                </Link>
                <a href={photoEmailLink} className="rounded-full border border-line bg-white px-7 py-4 text-center font-black text-ink shadow-sm transition hover:border-brand">
                  Send menu details
                </a>
              </div>
            </div>
          </div>
          <footer className="mt-12 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <p className="font-black text-ink">MenuPilot <span className="font-normal text-muted">by Resonate Solutions</span></p>
            <p>Custom menu pages for local food businesses. Built in Northwest Arkansas.</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
