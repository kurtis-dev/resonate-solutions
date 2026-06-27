# Stage 4 Onboarding Mirror Runbook

Use this when wiring the live website to Zapier and the Softr customer portal.

## Goal

When a customer submits any entry path:

- Free Page Plan: `/checkout?plan=review`
- Launch: `/checkout?plan=setup`
- Maintain: `/checkout?plan=care`
- Managed: `/checkout?plan=care-plus`

the website should create/update the internal onboarding record and send only the portal-safe mirror to Zapier. Zapier then upserts the customer/business row used by Softr.

## Current Live Health Check

Checked on 2026-06-26:

```json
{
  "databaseConfigured": false,
  "stripeConfigured": false,
  "stripeWebhookConfigured": false,
  "setupPriceConfigured": false,
  "corePriceConfigured": false,
  "plusPriceConfigured": false,
  "adminProtected": true,
  "siteUrlConfigured": false,
  "questionsEmailConfigured": false,
  "softrPortalConfigured": true,
  "softrPortalUrl": "https://app.resonate.solutions",
  "onboardingHandoffConfigured": false
}
```

This means the production site is ready in code, but Vercel still needs the production environment variables before real customer intake can persist and hand off.

## Required Vercel Environment Variables

Minimum for Stage 4:

```text
DATABASE_URL=...
NEXT_PUBLIC_SITE_URL=https://www.resonate.solutions
NEXT_PUBLIC_QUESTIONS_EMAIL=questions@resonate.solutions
NEXT_PUBLIC_SOFTR_PORTAL_URL=https://app.resonate.solutions
ZAPIER_INTAKE_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
```

Optional but recommended:

```text
ZAPIER_WEBHOOK_SECRET=choose-a-long-random-value
```

Stripe can be added in the next stage if needed:

```text
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SETUP=price_...
STRIPE_PRICE_CORE=price_...
STRIPE_PRICE_PLUS=price_...
```

## Zap 1: Website Onboarding Mirror To Softr Source

Create a Zap named:

```text
MenuPilot - Website onboarding mirror to Softr
```

Trigger:

- App: Webhooks by Zapier
- Event: Catch Hook

Copy the generated Catch Hook URL into Vercel as:

```text
ZAPIER_INTAKE_WEBHOOK_URL
```

If using `ZAPIER_WEBHOOK_SECRET`, add a Zapier filter step that requires the incoming header:

```text
x-zapier-secret
```

to match the Vercel value.

## Incoming Payload Shape

The website sends this shape:

```json
{
  "eventType": "customer_intake_submitted",
  "customer": {
    "portalCustomerId": "cust-owner-smoke-test-cafe",
    "businessName": "Smoke Test Cafe",
    "ownerEmail": "owner@example.com",
    "contactName": "Test Owner",
    "businessType": "Restaurant",
    "city": "Bentonville",
    "currentMenuLink": "https://example.com/menu",
    "mainNeed": "We need a food menu",
    "planId": "review",
    "planName": "Free Page Plan",
    "paymentStatus": "not_required",
    "onboardingStatus": "intake_received",
    "portalAccess": false
  },
  "softr": {
    "action": "upsert_customer_onboarding",
    "permissionEmail": "owner@example.com",
    "portalAccess": false,
    "visibilityRule": "logged_in_user_email_matches_owner_email_and_portal_access_is_true"
  }
}
```

Paid plan starts use:

```text
eventType = paid_plan_started
paymentStatus = pending
onboardingStatus = payment_pending
```

Stripe completion later uses:

```text
eventType = payment_completed
paymentStatus = paid
onboardingStatus = paid_needs_review or subscription_active
```

## Zapier Upsert Logic

Important 2026-06-27 finding:

- Zapier did not see an `Owner Email` field in the Softr-connected `Businesses` table during setup.
- Add `Owner Email` to `Businesses` before publishing this Zap.
- Do not use `Business Name` as the match field for real customers; it is not unique enough and can create duplicate or incorrect updates.

Use this matching order:

1. Find existing row by `portalCustomerId`.
2. If that is not available, find by `ownerEmail` + `businessName`.
3. If no row exists, create one.

Map only portal-safe fields:

| Zapier field | Payload source |
|---|---|
| Portal Customer ID | `customer.portalCustomerId` |
| Business Name | `customer.businessName` |
| Owner Email | `customer.ownerEmail` |
| Contact Name | `customer.contactName` |
| Business Type | `customer.businessType` |
| City / Service Area | `customer.city` |
| Current Link | `customer.currentMenuLink` |
| Main Need | `customer.mainNeed` |
| Plan ID | `customer.planId` |
| Plan Name | `customer.planName` |
| Payment Status | `customer.paymentStatus` |
| Onboarding Status | `customer.onboardingStatus` |
| Portal Access | `customer.portalAccess` |

Do not map:

- Stripe customer IDs
- Stripe subscription IDs
- Stripe checkout session IDs
- raw notes
- API keys
- OAuth tokens
- passwords
- card or bank information

## Softr Access Rule

Do not automatically grant portal access from the first customer submission.

Stage 4 should create/update the lead/customer row with:

```text
portalAccess = false
```

After Resonate reviews the business:

1. Create or confirm the Softr user.
2. Link the Softr user to the correct Business.
3. Set portal access true only when the customer should see private portal content.

## End-To-End Test

After the Zap URL is in Vercel and production redeploys:

1. Open:

```text
https://www.resonate.solutions/api/health
```

Expected:

```text
databaseConfigured = true
onboardingHandoffConfigured = true
```

2. Submit a test Free Page Plan:

```text
https://www.resonate.solutions/checkout?plan=review
```

Use a clearly fake test business and email.

3. Confirm the website lands on:

```text
/checkout/success?plan=review&status=free-requested
```

4. In Zapier history, confirm the payload arrived.

5. In the Softr-connected source table, confirm one row exists with:

```text
Business Name = test business
Owner Email = test email
Plan Name = Free Page Plan
Payment Status = not_required
Onboarding Status = intake_received
Portal Access = false
```

6. Confirm Softr portal does not show that row to an unrelated customer user.

7. Delete or archive the fake test row after validation.
