# Resonate Solutions Launch Checklist

Use this before treating a deployment as customer-ready.

## 1. Build And Deploy

- [ ] Vercel deployment for the latest Git commit is `Ready`.
- [ ] No red build errors in Vercel logs.
- [ ] `/api/health` returns `ok: true`.
- [ ] `/api/health` shows required production checks as `true`.

## 2. Public Page Click Audit

- [ ] Header logo opens `/`.
- [ ] Header `Local Presence` opens `/`.
- [ ] Header `MenuPilot` opens `/menupilot`.
- [ ] Header `Burger Preview` opens `/m/burger-truck-preview`.
- [ ] Header `Pricing` opens `/pricing`.
- [ ] Header `Start kit` opens `/menupilot`.
- [ ] Homepage `See MenuPilot` opens `/menupilot`.
- [ ] Homepage `View burger preview` opens `/m/burger-truck-preview`.
- [ ] Homepage `Open the burger truck preview` opens `/m/burger-truck-preview`.
- [ ] MenuPilot `View launch plans` opens `/pricing`.
- [ ] MenuPilot `See full offer` opens `/`.
- [ ] Footer links open `/privacy`, `/terms`, `/disclaimer`, and `/pricing`.

## 2A. MenuPilot Product Audit

- [ ] `/m/burger-truck-preview` loads a public menu page.
- [ ] Demo menu page shows item photos, descriptions, prices, status note, hours, and location.
- [ ] Demo menu page action buttons work or use safe placeholder links.
- [ ] Demo menu item comment form submits and returns to the menu page.
- [ ] Menu item question appears in `/admin` after database setup.
- [ ] Photo and questions email link opens `questions@resonate.solutions`.
- [ ] `/api/qr/burger-truck-preview` returns a QR SVG.
- [ ] QR code points to the public menu URL configured by `NEXT_PUBLIC_SITE_URL`.
- [ ] `/admin/menus` is blocked without Basic Auth.
- [ ] `/admin/menus` creates a published menu page after database setup.
- [ ] New business appears in the existing menu pages list.
- [ ] New public menu URL opens at `/m/[customer-slug]`.

## 3. Lead Intake

- [ ] MenuPilot Soundcheck form rejects missing required fields.
- [ ] MenuPilot Soundcheck form rejects invalid email.
- [ ] MenuPilot Soundcheck form submits successfully.
- [ ] New intake appears in `intake_requests`.
- [ ] Intake appears in `/admin`.
- [ ] Spam honeypot field blocks bot-style submissions.

## 4. Payments

- [ ] `Launch Kit` opens `/checkout?plan=launch-kit`.
- [ ] `Upkeep` opens `/checkout?plan=upkeep`.
- [ ] `Managed Presence` opens `/checkout?plan=managed`.
- [ ] Checkout button redirects to Stripe Checkout when Stripe env vars are configured.
- [ ] Stripe test card success returns to `/checkout/success`.
- [ ] `checkout.session.completed` webhook creates a payment/subscription record.
- [ ] `invoice.payment_succeeded` webhook creates a payment event.
- [ ] `invoice.payment_failed` webhook creates a failed payment event.
- [ ] `customer.subscription.updated` webhook updates subscription status.
- [ ] Stripe Customer Portal plan is defined before offering self-service cancellation.

## 5. Admin And Data

- [ ] `/admin` is blocked without Basic Auth.
- [ ] `ADMIN_USERNAME` and `ADMIN_PASSWORD` are configured in Vercel.
- [ ] `/admin` shows recent Soundcheck requests.
- [ ] `/admin` shows subscription status.
- [ ] `/admin` shows payment events.
- [ ] `/admin` links to the menu page creator.
- [ ] No sensitive secrets appear in page source, logs, or `/api/health`.

## 6. Mobile Quality

- [ ] Homepage works at phone width.
- [ ] MenuPilot works at phone width.
- [ ] Pricing cards stack cleanly on phone.
- [ ] Soundcheck form is usable on phone.
- [ ] Public menu page is usable on phone.
- [ ] QR code panel does not cause horizontal scrolling.
- [ ] No text overlaps, clipped buttons, or horizontal scrolling on normal mobile widths.

## 6A. Repeatable Smoke Test

- [ ] Run `npm run build` before pushing.
- [ ] Run `npm run smoke` against local production server before pushing.
- [ ] Run `BASE_URL=https://www.resonate.solutions npm run smoke` after Vercel deploys.

## 7. Legal And Trust

- [ ] Privacy Policy exists and is reachable.
- [ ] Terms of Use exists and is reachable.
- [ ] Disclaimer exists and is reachable.
- [ ] Placeholder legal copy is reviewed before accepting real customer payments.
- [x] Support/contact email is added as `questions@resonate.solutions`.
- [ ] No income, ranking, review, or customer guarantees are stated.

## 8. Analytics And Operations

- [ ] Analytics is installed or Vercel Web Analytics is enabled.
- [ ] Error monitoring or Vercel runtime logs are checked after first submissions.
- [ ] A manual follow-up process exists for new Soundcheck requests.
- [ ] A manual process exists for failed payments.
- [ ] Database backup/retention plan is understood.

## Current Known Launch Blockers

- [ ] Connect a real Postgres database and run `database/schema.sql`.
- [ ] Add `DATABASE_URL` to Vercel.
- [ ] Create Stripe products/prices and add Stripe env vars to Vercel.
- [ ] Add Stripe webhook endpoint and `STRIPE_WEBHOOK_SECRET`.
- [ ] Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- [ ] Create the first real customer menu page.
