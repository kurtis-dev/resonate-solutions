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

The checkout placeholder is in:

```text
app/checkout/page.tsx
lib/plans.ts
components/PricingCards.tsx
```

Replace the placeholder checkout page with Stripe Checkout, Stripe Payment Links, Square invoices, or your preferred payment flow.

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
- Add Stripe Checkout or payment links.
- Replace placeholder legal pages with attorney-reviewed policies.
- Add support email and business contact information.
- Add analytics.
- Build a first customer menu template once a real business signs up.
