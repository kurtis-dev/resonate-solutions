# Resonate Solutions

Resonate Solutions is a Next.js site for MenuPilot: custom mobile menu pages, QR codes, customer-facing links, food photos, hours, specials, and practical local business support.

## File Structure

```text
app/
  admin/page.tsx         Internal operations dashboard
  admin/menus/page.tsx   Internal menu page creator
  api/qr/[slug]/route.ts QR code image endpoint
  checkout/page.tsx      Payment placeholder
  disclaimer/page.tsx    Disclaimer page
  globals.css            Tailwind base styles
  layout.tsx             Shared app layout
  m/[slug]/page.tsx      Public customer menu pages
  menupilot/page.tsx     MenuPilot product page
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
STRIPE_PRICE_CORE
STRIPE_PRICE_PLUS
STRIPE_PRICE_DESIGN
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_QUESTIONS_EMAIL
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
Resonate Local: customer-ready pages for local service businesses.
```

Launch services:

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
