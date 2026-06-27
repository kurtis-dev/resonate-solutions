# Resonate Solutions / MenuPilot Project Handoff

Last updated: 2026-06-27

This file is for a coworker or a fresh Codex thread that needs the full working picture quickly.

## Project Snapshot

Resonate Solutions is building MenuPilot: a customer-ready page and owner portal system for restaurants, food trucks, and local service businesses.

The public website explains the offer, collects new customer onboarding details, routes free/paid plan interest, and sends a portal-safe handoff to Zapier/Softr. The private customer app currently lives in Softr at:

```text
https://app.resonate.solutions
```

Production website:

```text
https://www.resonate.solutions
```

Current repo:

```text
C:\Users\kurti\Documents\Codex\2026-04-26\can-you-reference-your-memeories-with\resonate-solutions-repo
```

Current git branch:

```text
main
```

Recent important commits:

```text
86ba7c1 Document final onboarding health
2a6f7a4 Harden admin auth health check
afe9586 Document Softr owner email upsert requirement
36785ab Document onboarding mirror wiring
b6de048 Unify MenuPilot onboarding flow
```

## Non-Negotiable Product Direction

- Do not build shoddy prototypes just to move forward.
- Avoid placeholder claims, fake proof, fake testimonials, fake awards, and unsupported customer claims.
- Customer-facing language must be simple, direct, and easy for restaurant/service owners to understand.
- Avoid internal words in customer UI: Zapier, API, database, webhook, payment gate, automation status, provider action ID.
- The product promise is not raw customer-to-public automation. The promise is reviewed updates:
  - Customer asks once.
  - Resonate reviews.
  - Resonate routes approved updates to MenuPilot and connected channels.
  - Customer receives confirmation.
- Do not expose private customer/business data in Softr without logged-in-user filtering and `portal_access=true`.

## Current Production Health

Checked after Neon setup and production redeploy on 2026-06-27:

```json
{
  "databaseConfigured": true,
  "stripeConfigured": false,
  "stripeWebhookConfigured": false,
  "setupPriceConfigured": false,
  "corePriceConfigured": false,
  "plusPriceConfigured": false,
  "adminProtected": true,
  "adminCredentialStatus": "configured",
  "siteUrlConfigured": true,
  "questionsEmailConfigured": true,
  "softrPortalConfigured": true,
  "softrPortalUrl": "https://app.resonate.solutions",
  "onboardingHandoffConfigured": true
}
```

Interpretation:

- Website database persistence is live.
- Admin credentials are configured and no longer accepted if they are the unsafe `admin/admin` default.
- Website-to-Zapier handoff URL is configured.
- Stripe is not configured yet.

## Tech Stack

- Next.js 16 App Router
- React 18
- Tailwind CSS
- Neon Postgres via `@neondatabase/serverless`
- Stripe package installed, but live Stripe env vars are not configured
- Vercel hosting
- Softr customer portal
- Zapier automation draft for onboarding handoff

Useful commands:

```bash
npm.cmd run build
npm.cmd run dev
curl.exe -L "https://www.resonate.solutions/api/health"
```

## Core Files

Public website:

```text
app/page.tsx                         redirects to /menupilot
app/menupilot/page.tsx               main MenuPilot services page
app/menupilot/examples/page.tsx      example/customer-page explainer
app/pricing/page.tsx                 pricing page using PricingCards
components/PricingCards.tsx          pricing cards UI
lib/plans.ts                         plan data, checkout URLs, Stripe env keys
components/SiteNav.tsx               public site navigation
```

Customer onboarding and checkout:

```text
app/checkout/page.tsx                shared business-details form for free and paid paths
app/api/checkout/route.ts            persists onboarding and starts Stripe/payment fallback
app/checkout/success/page.tsx        success page after free or paid checkout
app/api/intake/route.ts              JSON intake endpoint, older direct-intake path
lib/intake.ts                        intake validation and record creation
lib/customer-onboarding.ts           onboarding record and Softr-safe mirror payloads
lib/customer-store.ts                Postgres writes for intake/onboarding/payments
```

Database:

```text
database/schema.sql                  production schema
lib/db.ts                            lazy Neon SQL client
docs/stage-4-onboarding-mirror-runbook.md
docs/customer-onboarding-softr-handoff.md
```

Admin and menu/customer pages:

```text
app/admin/page.tsx                   internal operations dashboard
app/admin/menus/page.tsx             internal menu/page creator
app/admin/menus/actions.ts           create/update admin menu records
app/dashboard/[slug]/page.tsx        owner dashboard prototype
app/dashboard/[slug]/actions.ts      owner dashboard update actions
app/m/[slug]/page.tsx                public customer menu/page
app/api/qr/[slug]/route.ts           QR image endpoint
lib/menu-store.ts                    fallback demo/customer-page data and DB helpers
```

Automation:

```text
app/api/automation/route-update/route.ts
lib/channel-automation.ts
docs/menupilot-channel-automation-workflows.md
docs/zapier-softr-setup.md
```

Security:

```text
proxy.ts                             protects /admin and /dashboard
lib/admin-auth.ts                    validates admin auth config
app/api/health/route.ts              production readiness flags
```

Legal/support:

```text
app/privacy/page.tsx
app/terms/page.tsx
app/disclaimer/page.tsx
app/billing/page.tsx
lib/contact.ts
lib/portal.ts
```

## Database State

Neon/Vercel database:

```text
resonate-solutions-db
```

Schema has been run in Neon SQL Editor. Verified tables:

```text
business_integrations
business_sync_events
businesses
customer_onboarding
customer_subscriptions
intake_requests
menu_item_questions
menu_items
menu_sections
menu_variants
payment_events
```

Live smoke test completed:

- Submitted fake Free Page Plan lead through `POST /api/checkout`.
- Fake business: `Smoke Test Cafe`.
- Fake email: `smoke-test-20260627@resonate.solutions`.
- Result: `/checkout/success?plan=review&status=free-requested`.
- Verified rows in `customer_onboarding` and `intake_requests`.
- Leave smoke-test row until Zapier/Softr verification is complete, then delete/archive it.

## Customer Onboarding Flow

All four customer paths use the same business-details flow:

```text
/checkout?plan=review      Free Page Plan
/checkout?plan=setup       Launch
/checkout?plan=care        Maintain
/checkout?plan=care-plus   Managed
```

Current behavior:

1. Customer selects a plan.
2. Customer submits business details once.
3. Free Page Plan writes to Postgres and redirects to success.
4. Paid plans write/update onboarding with `payment_pending`.
5. Paid plans should continue to Stripe when Stripe env vars are configured.
6. Website sends a portal-safe mirror payload to Zapier.
7. Zapier should upsert the Softr-connected Businesses row.
8. Portal access remains false until Resonate reviews and grants access.

## Softr Status

Softr app/customer portal:

```text
https://app.resonate.solutions
```

Known Softr data fix completed:

- Added `Owner Email` field to the Softr `Businesses` table.
- Filled known owner emails:
  - Resonate Solutions -> `kurtis@resonate.solutions`
  - Excellent Pins & Badges Factory Inc. -> `excellentpins@gmail.com`
- Mellow Moose owner email is still unknown/blank.

Required Softr rules:

- Customer-facing blocks must filter to the logged-in user's linked Business or matching Owner Email.
- Private content should also require `portal_access=true`.
- All-record views belong only on Resonate admin pages.
- Test as Jack/customer user: Jack should only see Excellent Pins, not Mellow Moose or Resonate.

## Zapier Status

Draft Zap exists:

```text
New resonate.solutions signups to Softr
```

Intended final name:

```text
MenuPilot - Website onboarding mirror to Softr
```

Flow shape:

```text
Catch Hook
Find Business by Owner Email
Check if Business Record Exists
Update Existing Business Record
Create New Business Record
```

Current blocker:

- Zap remains draft/off.
- Zapier showed `This Zap is using 1 Pro feature`.
- Final field mappings still need verification.
- Do not publish until a fake payload upserts by `Owner Email` correctly and portal access stays false.

Do not print or expose the Zapier hook URL.

## Stripe / Payment Status

Stripe package exists and checkout code is written, but env vars are not configured:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_SETUP
STRIPE_PRICE_CORE
STRIPE_PRICE_PLUS
STRIPE_PAYMENT_LINK_SETUP
STRIPE_PAYMENT_LINK_CORE
STRIPE_PAYMENT_LINK_PLUS
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
```

The site currently reports Stripe false in `/api/health`.

Payment model:

- Free Page Plan: no payment.
- Launch: $399 one-time payment.
- Maintain: $79/month.
- Managed: $149/month.

Important business rule:

- Free Page Plan gives a recommendation only.
- Custom build work starts after Launch payment.
- Monthly care starts after launch and selected plan/payment.
- Card data should be handled by Stripe only, never Softr or Neon.

## Placeholder / Cleanup Audit

This is the current placeholder-style audit. It separates true cleanup from acceptable examples.

### Fixed In This Pass

- `app/menupilot/page.tsx`
  - Changed customer-facing `Free preview` to `Free Page Plan`.
  - Replaced old `id="fit-check"` with `id="free-page-plan"`.
- `components/SiteNav.tsx`
  - Updated nav link from `/menupilot#fit-check` to `/menupilot#free-page-plan`.
- `LAUNCH_CHECKLIST.md`
  - Updated old anchor reference.
  - Reworded `safe placeholder links` to `clearly labeled non-final links`.
- `README.md`
  - Removed outdated wording that called plan destinations placeholders.

### Customer-Facing Items To Review Before Real Paid Launch

- `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/disclaimer/page.tsx`
  - These are basic service policies, not attorney-reviewed legal documents.
  - They are not fake, but they are lightweight. Treat as launch risk before taking real paid customers at scale.
- `app/menupilot/examples/page.tsx` and `app/m/[slug]/page.tsx`
  - Mellow Moose / Dos Gordos examples are product examples and may be okay, but verify all public-facing claims/details with the business owner before using them as sales proof.
- `app/api/automation/route-update/route.ts`
  - `GET` returns an example Mellow Moose request. This is useful for developer discovery but is public. Consider requiring auth or removing the public example once Zapier is configured.

### Internal/Admin Examples That Are Probably Fine

- `app/admin/menus/page.tsx`
  - Form input placeholders such as `Mellow Moose Burgers`, `https://...`, and menu examples are internal admin UX helpers, not final public content.
- `app/checkout/page.tsx` and `components/IntakeForm.tsx`
  - Form placeholders like `owner@example.com` and `Restaurant, food truck...` are standard input hints. They are not database placeholders.
- Docs under `docs/`
  - `owner@example.com`, `Smoke Test Cafe`, and `https://example.com/menu` are examples in setup docs. Keep them in docs unless publishing docs publicly.
- `docs/stripe-billing-setup.md`
  - Stripe `sk_test_...` and test Payment Link examples are correct because Stripe setup should begin in test mode.

### Possibly Legacy / Needs Decision

- `components/IntakeForm.tsx`
  - JSON intake form component exists, but current primary customer path is `/checkout?plan=...`.
  - Search whether it is imported before changing it. If unused, either remove it or intentionally keep it as an alternate intake component.
- `app/api/intake/route.ts`
  - Still supports direct JSON intake and sends Zapier handoff. Useful, but make sure it is intentionally supported.
- `public/assets/menupilot-process/`
  - Untracked screenshot asset folder exists. Decide whether to commit these as website proof assets, move them, or delete them.

## Open Work, Ordered

1. Finish Zapier onboarding mirror.
   - Verify fake payload is caught.
   - Map to Softr Businesses by `Owner Email`.
   - Ensure `portalAccess=false`.
   - Test customer visibility in Softr.
   - Publish only after mappings pass.

2. Stripe setup.
   - Create Stripe account/products/prices or payment links.
   - Add Vercel env vars.
   - Test in Stripe test mode.
   - Configure webhook.
   - Verify `/api/health` Stripe flags.

3. Softr app UX hardening.
   - Make customer views feel like Resonate/MenuPilot, not generic Softr.
   - Category-first update request flows.
   - Customer-friendly status labels.
   - Permission filters on every customer-facing data block.

4. Website proof/screenshots.
   - Use real Softr customer-login screenshots once app UI is ready.
   - Replace static/recycled graphics with truthful product proof.
   - Do not show internal admin tools as customer-facing product.

5. Placeholder/legal cleanup.
   - Attorney-review or stronger legal templates before real paid scale.
   - Remove public developer examples from API GET endpoints if not needed.
   - Verify Mellow Moose/Dos Gordos claims before treating them as live sales examples.

6. Channel automation.
   - Use `/api/automation/route-update` as the route planner.
   - First automate MenuPilot/website updates.
   - Then Facebook draft/post validation.
   - Then Google Business Profile post.
   - Treat GBP special hours as high-risk, validate-only first.
   - DoorDash/Uber/Grubhub/etc. are managed-support/manual until proven.

## Parallel Work Suggestions

Good coworker paths that can run in parallel:

- Stripe owner: configure test products/prices, payment links, webhook, and billing portal.
- Softr owner: verify data permissions, style login/app pages, and finish customer update request UI.
- Zapier owner: finish onboarding mirror, then route planner workflow.
- Website owner: refine examples page, add Softr screenshots, remove non-final proof visuals.
- Legal/ops owner: replace lightweight policies, define cancellation/refund/support terms.

## Verification Checklist Before Claiming Ready

- `npm.cmd run build` passes.
- `/api/health` shows database, site URL, questions email, Softr portal, handoff, and admin auth as true/configured.
- Stripe flags true before paid plans are advertised as live card checkout.
- Free Page Plan creates rows in `customer_onboarding` and `intake_requests`.
- Paid plan start creates/updates `customer_onboarding` before Stripe checkout.
- Stripe webhook updates payment/subscription status.
- Zapier creates/updates exactly one Softr row by Owner Email.
- Softr customer sees only their own business records.
- No public page relies on fake claims, fake social proof, or unapproved customer details.
