# Stripe Billing Setup

This site is ready for Stripe without collecting card numbers in Resonate code.

## Recommended Order

1. Create or finish the Resonate Solutions Stripe account.
2. Stay in Stripe test mode while building.
3. Create products and prices:
   - `Launch` - one-time payment, `$399`
   - `Maintain` - monthly subscription, `$79/mo`
   - `Managed` - monthly subscription, `$149/mo`
4. Add Stripe values in Vercel environment variables.
5. Link Softr Billing buttons to `https://www.resonate.solutions/billing` or the plan-specific checkout URLs.
6. Link customer portal/sign-in buttons to `https://app.resonate.solutions` or the website redirect `https://www.resonate.solutions/portal`.
7. Draft Zapier payment workflows before taking live payments.
8. Connect the Resonate business bank account before processing real customer payments.

## Environment Variables

Use full Stripe Checkout when these are available:

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SETUP=price_...
STRIPE_PRICE_CORE=price_...
STRIPE_PRICE_PLUS=price_...
NEXT_PUBLIC_SITE_URL=https://resonate.solutions
NEXT_PUBLIC_SOFTR_PORTAL_URL=https://app.resonate.solutions
```

Use Stripe Payment Links as the lighter no-code fallback:

```text
STRIPE_PAYMENT_LINK_SETUP=https://buy.stripe.com/test_...
STRIPE_PAYMENT_LINK_CORE=https://buy.stripe.com/test_...
STRIPE_PAYMENT_LINK_PLUS=https://buy.stripe.com/test_...
```

If both Checkout price IDs and Payment Links are configured, the website uses Stripe Checkout first.

Optional customer portal link:

```text
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/...
```

## Website Routes

```text
/pricing
/checkout?plan=setup
/checkout?plan=care
/checkout?plan=care-plus
/billing
/checkout/success
/api/checkout
/api/stripe/webhook
```

## Softr App Setup

Add buttons on the Softr Billing page:

- `Pay Launch setup` -> `https://www.resonate.solutions/checkout?plan=setup`
- `Start Maintain` -> `https://www.resonate.solutions/checkout?plan=care`
- `Start Managed` -> `https://www.resonate.solutions/checkout?plan=care-plus`
- `Manage billing` -> `https://www.resonate.solutions/billing`
- `Customer portal` -> `https://app.resonate.solutions`

Do not collect debit or credit card numbers in Softr forms.

## Zapier Workflows To Draft

Keep every Zap off until a controlled test is approved.

1. Stripe Checkout Session Completed -> Update customer/payment status.
2. Stripe Invoice Payment Succeeded -> Set subscription status active.
3. Stripe Invoice Payment Failed -> Set payment gate to paused/past due.
4. Stripe Subscription Canceled -> Pause ongoing update requests.
5. Payment status changed -> Notify Resonate owner.

The source of truth for money is Stripe. Google Sheets and Softr should mirror operational status only.
