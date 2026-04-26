# ReplyPilot

ReplyPilot is a production-ready Next.js SaaS starter for AI-assisted review reply workflows. It includes a homepage, generator tool, pricing page, login placeholder, usage-limit placeholder, Stripe checkout placeholders, and legal placeholder pages.

## File Structure

```text
app/
  api/generate/route.ts      Placeholder generation API route
  disclaimer/page.tsx        Disclaimer page
  globals.css                Tailwind base styles
  layout.tsx                 Shared app layout
  page.tsx                   Homepage
  privacy/page.tsx           Privacy Policy
  replypilot/page.tsx        ReplyPilot product homepage
  replypilot/account/page.tsx Account and usage-limit placeholder
  replypilot/checkout/page.tsx Stripe checkout placeholder
  replypilot/generator/page.tsx Review reply generator tool
  replypilot/login/page.tsx  Login/account placeholder
  replypilot/pricing/page.tsx Pricing page
  terms/page.tsx             Terms of Use
components/
  Footer.tsx
  Nav.tsx
  PricingCards.tsx
lib/
  plans.ts                   Pricing and checkout destination placeholders
  reply-generator.ts         Placeholder reply logic
package.json
tailwind.config.ts
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## OpenAI Integration

The exact connection point is in:

```text
app/api/generate/route.ts
```

Replace `generatePlaceholderReplies(input)` with a server-side OpenAI Responses API call. Keep validation, account usage checks, and rate limiting server-side before calling OpenAI.

## Stripe Integration

The exact checkout placeholder is in:

```text
lib/plans.ts
components/PricingCards.tsx
app/replypilot/checkout/page.tsx
```

Replace the placeholder checkout page with real Stripe Checkout links, or change the button to call your own `/api/checkout` route that creates a Stripe Checkout session.

## Positioning

ReplyPilot is positioned as the first product from Resonate Solutions:

```text
ReplyPilot by Resonate Solutions
Safe review reply workflows for local businesses.
```

The free tier offers 10 total trial replies. Paid tiers can add saved business rules, mobile-friendly review triage, approval workflow, managed review replies, and platform posting support where customer-authorized access is available.

## Usage Limits

The current free trial limit is 10 total generations and is a front-end placeholder using `localStorage`:

```text
app/replypilot/generator/page.tsx
```

For production, move usage tracking to your database and enforce limits in `app/api/generate/route.ts`.

## Vercel Deployment

1. Push this project to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Choose **Add New Project**.
4. Import the GitHub repo.
5. Framework preset should auto-detect **Next.js**.
6. Click **Deploy**.
7. After deployment, open **Settings > Domains**.
8. Add your domain, for example:

```text
resonate.solutions
```

9. Follow Vercel's DNS instructions. If you keep DNS in Squarespace, update the records there.

## Production Checklist

- Add real authentication.
- Add database-backed accounts and usage limits.
- Add OpenAI API generation in the API route.
- Add Stripe Checkout or Stripe Billing.
- Replace placeholder legal pages with attorney-reviewed policies.
- Add support email and business contact information.
- Add analytics and error monitoring.
