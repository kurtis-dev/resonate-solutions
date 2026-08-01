import Link from "next/link";
import { plans } from "@/lib/plans";
import { questionsEmail } from "@/lib/contact";
import { customerPortalUrl } from "@/lib/portal";

const paidPlans = plans.filter((plan) => plan.paymentMode !== "none");
const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || "";

export default function BillingPage() {
  return (
    <main className="bg-cream">
      <section className="border-b border-line bg-[#fffaf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-6xl">
              Billing for your Resonate page.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Pay the one-time Launch setup, start Webpage Hosting, choose monthly care, or manage an existing subscription through Stripe secure checkout.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-coral/25 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Secure payments</p>
            <p className="mt-3 leading-7 text-muted">
              Debit cards, credit cards, and supported wallets are handled by Stripe. Resonate does not collect card numbers in the website or customer app.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {paidPlans.map((plan) => (
            <article key={plan.id} className={`flex min-h-full flex-col rounded-[1.75rem] border-2 bg-white p-6 shadow-sm ${plan.highlighted ? "border-coral" : "border-line"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-ink">{plan.name}</h2>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-coral">{plan.limit}</p>
                </div>
                <p className="text-right text-3xl font-black text-ink">
                  {plan.price}
                  {plan.billingPeriod ? <span className="block text-sm font-bold text-muted">/{plan.billingPeriod}</span> : null}
                </p>
              </div>
              <p className="mt-5 leading-7 text-muted">{plan.description}</p>
              <div className="flex-1" />
              <Link href={plan.checkoutUrl} className={`mt-7 rounded-full px-5 py-3 text-center font-black shadow-sm transition ${plan.highlighted ? "bg-coral text-white hover:bg-ink" : "bg-ink text-white hover:bg-coral"}`}>
                {plan.paymentMode === "payment" ? "Pay Launch setup" : `Start ${plan.name}`}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[1.75rem] border border-coral/25 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Launch with hosting</p>
          <h2 className="mt-3 text-2xl font-extrabold text-ink">Pay $416.99 today, then $17.99 per month.</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted">
            One Stripe checkout includes the $399 one-time Launch payment and the first $17.99 Webpage Hosting charge. Only hosting renews after the first payment.
          </p>
          <Link href="/checkout?plan=launch-hosting" className="mt-6 inline-flex rounded-full bg-coral px-5 py-3 font-black text-white transition hover:bg-ink">
            Pay Launch + Hosting together
          </Link>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <section className="rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-ink">Manage billing</h2>
            <p className="mt-3 leading-7 text-muted">
              Use Stripe to update the card on file, view subscription details, or handle billing changes after a monthly plan is active.
            </p>
            {portalUrl ? (
              <a href={portalUrl} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-black text-white transition hover:bg-coral">
                Open Stripe billing portal
              </a>
            ) : (
              <a href={`mailto:${questionsEmail}?subject=Resonate billing help`} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-black text-white transition hover:bg-coral">
                Ask for billing help
              </a>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-ink">Customer portal</h2>
            <p className="mt-3 leading-7 text-muted">
              Your MenuPilot customer portal lives at app.resonate.solutions. Portal access is opened after Resonate reviews the business record and connects it to the right account.
            </p>
            <a href={customerPortalUrl} className="mt-6 inline-flex rounded-full border border-lm¹×kh‘éì¶»§q«^w[›Ü›X[ˆÏ‚ˆÛX™[‚ˆ]Ûˆ\OHœÝX›Z]ˆÛ\ÜÓ˜[YOHœ›Ý[™YY[™ËXÛÜ˜[MHKLÈ^XÙ[\ˆ›ÛX›XÚÈ^]Ú]HÚYÝË\ÛÙÝ™\Ž˜™ËZ[šÈ‚ˆØ]Û•^BˆØ]Û‚ˆÙ›Ü›O‚ˆ]ˆÛ\ÜÓ˜[YOH›]MˆÜšYØ\LÈ›Ý[™YLž›Ü™\ˆ›Ü™\‹[[™H™ËXÜ™X[HM^\ÛHXY[™ËMˆ^[]]Y‚ˆÚ\Ñœ™YHÈ
ˆÝ›Û™ÈÛ\ÜÓ˜[YOH^Z[šÈ“›È^[Y[\È™\]Z\™Y›ÜˆHœ™YHYÙH[‹ÜÝ›Û™ÏˆZYZ[ÛÜšÈ™YÚ[œÈÛ›HY\ˆ[ÝHÚÛÜÙH][˜ÚÜ‚ˆ
Hˆ
ˆ‚ˆÝ›Û™ÈÛ\ÜÓ˜[YOH^Z[šÈ‘Xš][™Ü™Y]Ø\™È\™HXØÙ\Y›ÝYÚÝš\KÜÝ›Û™Ïˆ™\ÛÛ˜]HÙ\È›ÝÛÛXÝÜˆÝÜ™HØ\™[X™\œÈÛˆ\ÈÙXœÚ]KÜ‚ˆÚ\Ó][˜ÚÜÝ[™ÈÈÝ›Û™ÈÛ\ÜÓ˜[YOH^Z[šÈ•Ù^Nˆ	M‹ŽNKÜÝ›Û™ÏˆÜÝ[™È[ˆ™[™]ÜÈ]	MËŽNH\ˆ[ÛÈH	ÎNH][˜ÚÚ\™ÙHÙ\È›Ý™\X]Üˆˆ[BˆÏ‚ˆ
_BˆY\ˆ™]šY]ËÝ\ÝÛY\ˆÜ[XØÙ\ÜÈ\È[™Y]\œ™\ÛÛ˜]KœÛÛ][ÛœËˆ[ÛHš[[™È\ÈX[˜YÙYÙXÝ\™[H›ÝYÚÝš\KÜ‚ˆÙ]‚ˆ]ˆÛ\ÜÓ˜[YOH›]N›^›^XÛÛØ\LÈÛN™›^\›ÝÈ‚ˆ[šÈ™YH‹ÜšXÚ[™ÈˆÛ\ÜÓ˜[YOHœ›Ý[™YY[›Ü™\ˆ›Ü™\‹[[™HMHKLÈ^XÙ[\ˆ›ÛX›XÚÈ^Z[šÈ˜XÚÈÈšXÚ[™ÏÓ[šÏ‚ˆÈZ\Ñœ™YHÈ[šÈ™YH‹ØÚXÚÛÝ]Ü[\™]šY]ÈˆÛ\ÜÓ˜[YOHœ›Ý[™YY[›Ü™\ˆ›Ü™\‹[[™HMHKLÈ^XÙ[\ˆ›ÛX›XÚÈ^Z[šÈ”™\]Y\Ýœ™YHYÙH[Ó[šÏˆˆ[BˆÙ]‚ˆÜÙXÝ[Û‚ˆÛXZ[‚ˆ
NÂŸB