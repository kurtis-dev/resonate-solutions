import Link from "next/link";
import { getPlanById } from "@/lib/plans";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string; status?: string }>;
}) {
  const params = await searchParams;
  const planId = params.plan || "setup";
  const plan = getPlanById(planId) || getPlanById("setup");
  const isFree = plan?.paymentMode === "none";
  const isOneTime = plan?.paymentMode === "payment";
  const isHosting = plan?.id === "hosting";
  const isLaunchHosting = plan?.id === "launch-hosting";
  const isManagedPage = plan?.id === "managed-page";
  const isLaunchManagedPage = plan?.id === "launch-managed-page";
  const heading = isFree
    ? "Request your free page plan."
    : isLaunchManagedPage
      ? "Launch with a fully managed page."
      : isLaunchHosting
        ? "Launch your page with hosting."
        : isManagedPage
          ? "Start Managed Page."
          : isHosting
            ? "Start Webpage Hosting."
            : isOneTime
              ? "Start your page/menu setup."
              : "Start monthly page care.";
  const intro = isFree
    ? "Add the business details once. Resonate will review the business, recommend the right MenuPilot setup, and tell you what is needed before any paid build starts."
    : isLaunchManagedPage
      ? "Your first Stripe invoice includes the $399 Launch payment and the first $79.99 Managed Page charge. Future invoices include only $79.99 per month; hosting is already included."
      : isLaunchHosting
        ? "Your first Stripe invoice includes the $399 Launch payment and the first $17.99 hosting charge. Future invoices include only $17.99 per month for Webpage Hosting."
        : "Add the business details once, then continue to secure payment. Resonate uses this to match your order to the right page, menu, or services setup.";
  const buttonText = isFree
    ? "Send free page plan request"
    : isLaunchManagedPage
      ? "Pay $478.99 today, then $79.99/month"
      : isLaunchHosting
        ? "Pay $416.99 today, then $17.99/month"
        : "Continue to secure Stripe checkout";
  const statusMessage =
    params.status === "missing-stripe"
      ? "Secure checkout is not connected yet. Resonate can still send a Stripe payment link or invoice when your plan is ready."
      : params.status === "missing-email"
        ? "Please enter your email so Resonate can match your payment to your business details."
      : params.status === "cancelled"
        ? "Checkout was cancelled. You can restart when ready."
        : params.status === "checkout-error"
          ? "Checkout could not start. Please try again or contact Resonate for help."
          : "";

  return (
    <main className="mx-auto flex max-w-2xl overflow-x-hidden px-4 py-12 sm:px-5 sm:py-16">
      <section className="w-full overflow-hidden rounded-[1.75rem] border border-line bg-white p-5 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">{isFree ? "Free Page Plan" : "Checkout"}</p>
        <h1 className="mt-3 text-4xl font-black text-ink">{heading}</h1>
        <p className="mt-4 leading-7 text-muted">
          You selected <strong>{plan?.name}</strong>. {intro}
        </p>
        {statusMessage ? <p className="mt-5 rounded-2xl bg-[#fff0e9] px-4 py-3 text-sm font-bold text-coral">{statusMessage}</p> : null}
        {!isFree ? (
          <div className="mt-5 rounded-2xl border border-line bg-cream px-4 py-3 text-sm leading-6 text-muted" aria-label="Order summary">
            <strong className="text-ink">Order summary: </strong>
            {isLaunchManagedPage
              ? "$478.99 today, then $79.99 per month for Managed Page. Hosting is included."
              : isLaunchHosting
                ? "$416.99 today, then $17.99 per month for Webpage Hosting."
                : `${plan?.price}${plan?.billingPeriod ? " per month" : " one-time"}.`}
          </div>
        ) : null}
        <form action="/api/checkout" method="POST" className="mt-8 grid gap-4">
          <input type="hidden" name="plan" value={plan?.id || "setup"} />
          <input type="hidden" name="startedAt" value={Date.now().toString()} />
          <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
          <input tabIndex={-1} autoComplete="off" name="companyWebsite" className="hidden" aria-hidden="true" />
          <input tabIndex={-1} autoComplete="off" name="confirmEmail" className="hidden" aria-hidden="true" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Business name
              <input required name="businessName" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Contact name
              <input required name="contactName" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Email
              <input required name="email" type="email" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" placeholder="owner@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Phone
              <input name="phone" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Business type
              <input required name="businessType" placeholder="Restaurant, food truck, salon, lawn care..." className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              City or service area
              <input required name="city" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-ink">
            Current website, menu, social, or Google profile link
            <input name="currentMenuLink" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink">
            What do you need built or maintained?
            <select required name="mainNeed" className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal">
              <option>We need a food menu</option>
              <option>We need a services list</option>
              <option>We need both menu and services</option>
              <option>We need a simple business page</option>
              <option>We need an existing page/menu cleaned up</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink">
            Anything Resonate should know before starting?
            <textarea name="notes" rows={4} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
          </label>
          <button type="submit" className="rounded-full bg-coral px-5 py-3 text-center font-black text-white shadow-soft hover:bg-ink">
            {buttonText}
          </button>
        </form>
        <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-cream p-4 text-sm leading-6 text-muted">
          {isFree ? (
            <p><strong className="text-ink">No payment is required for the Free Page Plan.</strong> Paid build work begins only after you choose Launch.</p>
          ) : (
            <>
              <p><strong className="text-ink">Debit and credit cards are accepted through Stripe.</strong> Resonate does not collect or store card numbers on this website.</p>
              {isLaunchHosting ? <p><strong className="text-ink">Today: $416.99.</strong> Hosting then renews at $17.99 per month; the $399 Launch charge does not repeat.</p> : null}
              {isLaunchManagedPage ? <p><strong className="text-ink">Today: $478.99.</strong> Managed Page then renews at $79.99 per month, with hosting included; the $399 Launch charge does not repeat.</p> : null}
            </>
          )}
          <p>After review, customer portal access is handled at app.resonate.solutions. Monthly billing is managed securely through Stripe.</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Back to pricing</Link>
          {!isFree ? <Link href="/checkout?plan=review" className="rounded-full border border-line px-5 py-3 text-center font-black text-ink">Request Free Page Plan</Link> : null}
        </div>
      </section>
    </main>
  );
}
