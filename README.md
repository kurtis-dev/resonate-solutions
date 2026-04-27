# Resonate Solutions

Resonate Solutions is a Next.js site for local business presence kits: mobile menu pages, QR codes, customer-facing links, Google profile cleanup, and practical photo support.

## File Structure

```text
app/
  checkout/page.tsx      Payment placeholder
  disclaimer/page.tsx    Disclaimer page
  globals.css            Tailwind base styles
  layout.tsx             Shared app layout
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
STRIPE_PRICE_LAUNCH_KIT
STRIPE_PRICE_UPKEEP
STRIPE_PRICE_MANAGED
NEXT_PUBLIC_SITE_URL
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

Add authentication before sharing that URL publicly.

## Positioning

Primary offer:

```text
Make your local business easier to find, choose, and trust.
```

Launch services:

- Mobile menu and customer pages
- QR codes
- Basic food, service, or product photos
- Google review link and profile cleanup
- Ongoing menu, hours, location, and link updates

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
- Build a first customer menu template once a real business signs up.
