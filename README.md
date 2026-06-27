# Resonate Solutions

Resonate Solutions is a Next.js site for MenuPilot, a customer-ready page/app layer for food menus, service lists, QR-ready public links, customer-facing actions, hours, photos, and practical local business support.

## File Structure

```text
app/
  admin/page.tsx         Internal operations dashboard
  admin/menus/page.tsx   Internal menu page creator
  api/qr/[slug]/route.ts QR code image endpoint
  billing/page.tsx       Customer billing and Stripe checkout entry point
  checkout/page.tsx      Payment placeholder
  disclaimer/page.tsx    Disclaimer page
  globals.css            Tailwind base styles
  layout.tsx             Shared app layout
  m/[slug]/page.tsx      Public customer menu pages
  menupilot/page.tsx     Services page for pages, menus, and service lists
  page.tsx               Homepage
  pricing/page.tsx       Pricing page
  privacy/page.tsx       Privacy Policy
  terms/page.tsx         Terms of Use
components/
  Footer.tsx
  PricingCards.tsx
  SiteNav.tsx
lib/
  menu-store.ts          Business, menu, and QR data helpers
  plans.ts               Pricing and checkout destination placeholders
package.json
tailwind.config.ts
```

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Payment Integration

The checkout and payment tracking code is in:

```text
app/checkout/page.tsx
app/api/checkout/route.ts
app/api/stripe/webhook/route.ts
lib/plans.ts
components/PricingCards.tsx
```

The app is set up for Stripe Checkout. Add these Vercel environment variables:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_SETUP
STRIPE_PRICE_CORE
STRIPE_PRICE_PLUS
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_QUESTIONS_EMAIL
```

For the quickest no-code start, create Stripe Payment Links and add these fallback variables:

```text
STRIPE_PAYMENT_LINK_SETUP
STRIPE_PAYMENT_LINK_CORE
STRIPE_PAYMENT_LINK_PLUS
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
```

If both Checkout price IDs and Payment Links are configured, the site uses Stripe Checkout first. If Checkout is not configured but a Payment Link exists, `/api/checkout` redirects to the matching Stripe Payment Link.

The Softr Billing page can link customers to:

```text
https://www.resonate.solutions/billing
https://www.resonate.solutions/checkout?plan=setup
https://www.resonate.solutions/checkout?plan=care
https://www.resonate.solutions/checkout?plan=care-plus
```

Full setup notes:

```text
docs/stripe-billing-setup.md
```

## Zapier Automation

The first safe automation layer is the update route planner:

```text
POST /api/automation/route-update
```

Zapier can call this endpoint after a Softr update request or Google Sheets `Update Desk` row. The endpoint returns channel-specific tasks such as auto-ready, validate-first, manual-support, or blocked. Use it before publishing to external channels so payment, permission, approval, public copy, and access gates stay in place.

Configure:

```text
ZAPIER_WEBHOOK_SECRET
ZAPIER_INTAKE_WEBHOOK_URL
SOFTR_INTAKE_WEBHOOK_URL
NEXT_PUBLIC_SOFTR_PORTAL_URL=https://app.resonate.solutions
```

Setup notes:

```text
docs/customer-onboarding-softr-handoff.md
docs/menupilot-channel-automation-workflows.md
docs/zapier-softr-setup.md
```

## Database

The database schema is in:

```text
database/schema.sql
```

Use a Postgres database such as Neon, Vercel Postgres, or Supabase. Add `DATABASE_URL` in Vercel, then run the schema SQL in your database.

The first internal operations view is:

```text
/admin
```

Customer onboarding records are stored in:

```text
customer_onboarding
```

Free Page Plan, Launch, Maintain, and Managed all create or update this same onboarding record. Softr should read only a portal-safe mirror of this record, or receive that limited mirror through Zapier using `SOFTR_INTAKE_WEBHOOK_URL` or `ZAPIER_INTAKE_WEBHOOK_URL`.

Customer portal access should live at:

```text
https://app.resonate.solutions
```

The website `/portal` route redirects to the configured Softr portal URL.

The first internal menu builder is:

```text
/admin/menus
```

It creates public customer menu pages at:

```text
/m/[customer-slug]
```

Each public menu page includes a QR image at:

```text
/api/qr/[customer-slug]
```

Customers can ask about menu items from the public menu page. Business owners can send menu photos and questions to:

```text
questions@resonate.solutions
```

Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD` before sharing any `/admin` URL.

## Positioning

Primary offer:

```text
Make your local business easier to find, choose, and trust.
```

Current product direction:

```text
MenuPilot by Resonate Solutions: customer-ready pages, menus, and service lists for local service businesses.
```

Launch services and plans:

- Free Page Plan before payment
- Launch: one-time page, menu, or services-list build after payment, with a private preview before public launch
- Maintain: monthly care for occasional edits and link checks
- Managed: monthly care with unlimited standard updates and priority help
- Mobile menu and customer pages
- QR codes
- Basic food, service, or product photos
- Google review link and profile cleanup
- Ongoing menu, hours, location, and link updates

Customer build workflow:

```text
docs/resonate-local-pages-customer-workflow.md
```

## Vercel Deployment

1. Push this project to GitHub.
2. Vercel will deploy the connected `main` branch automatically.
3. After deployment, open **Settings > Domains** in Vercel.
4. Add `resonate.solutions`.
5. Follow Vercel DNS instructions in Squarespace.

## Production Checklist

- Add contact form or lead capture.
- Connect Stripe price IDs and webhook secret.
- Connect a Postgres database and run `database/schema.sql`.
- Add authentication for `/admin`.
- Replace placeholder legal pages with attorney-reviewed policies.
- Add support email and business contact information.
- Add analytics.
- Create the first real customer menu page in `/admin/menus`.
- Print or save the QR code from `/api/qr/[customer-slug]`.
