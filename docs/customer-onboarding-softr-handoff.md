# Customer Onboarding And Softr Handoff

This is the source-of-truth flow for new MenuPilot customers from the website into operations and Softr.

## Customer-Facing Flow

All four paths use the same onboarding shape:

1. Customer chooses Free Page Plan, Launch, Maintain, or Managed.
2. Customer enters business and contact details once.
3. Free Page Plan submits immediately.
4. Paid plans create an onboarding record, then continue to Stripe.
5. Stripe webhook updates the same onboarding record after payment.
6. Resonate reviews the customer, creates or confirms the customer page, and grants portal access when ready.

Customer-facing pages should not mention Softr, Zapier, webhooks, internal table names, payment gates, or automation status.

## Website Source Of Truth

The website writes to:

```text
customer_onboarding
```

This table should become the shared onboarding source for Softr-visible customer records.

Key fields:

- `business_name`
- `contact_name`
- `email`
- `phone`
- `business_type`
- `city`
- `current_menu_link`
- `main_need`
- `plan_id`
- `plan_name`
- `payment_status`
- `onboarding_status`
- `portal_access`

The website database keeps the full onboarding record. Softr should receive only the portal-safe mirror fields:

- `portalCustomerId`
- `businessName`
- `ownerEmail`
- `contactName`
- `businessType`
- `city`
- `currentMenuLink`
- `mainNeed`
- `planId`
- `planName`
- `paymentStatus`
- `onboardingStatus`
- `portalAccess`

Do not mirror these into Softr:

- Stripe customer, subscription, checkout session, webhook, or payment event IDs.
- Raw private notes.
- Passwords, API keys, OAuth tokens, refresh tokens, or channel credentials.
- Bank, card, tax, legal, or credential recovery information.
- Any field a customer does not need to see in the portal.

## Softr Connection Options

Best case:

1. Softr reads from the same database or an Airtable/Google Sheet table that mirrors `customer_onboarding`.
2. Softr filters customer-facing pages by logged-in user email.
3. Resonate controls `portal_access` before customers can see private portal content.

Security rule:

- Customer-facing Softr pages must never show the raw Businesses table without a logged-in-user filter.
- Business/profile blocks should filter to the logged-in user's linked Business record, or to a business owner email field matching the logged-in user's email.
- Customer portal content should also require `portal_access = true`.
- Admin-only pages may show all records, but only to the Resonate admin user group.
- The website database remains the full source of truth; Softr should receive only the portal-safe mirror fields.

Practical no-code bridge:

1. Configure `SOFTR_INTAKE_WEBHOOK_URL` or `ZAPIER_INTAKE_WEBHOOK_URL`.
2. The website sends the onboarding payload whenever:
   - Free Page Plan is submitted.
   - Paid checkout is started.
   - Stripe confirms payment.
3. Zapier upserts the row into Softr's connected source table.

## Required Zapier Upsert Behavior

Use customer email plus business name as the matching key where possible.

If the row exists:

- Update plan and payment fields.
- Preserve existing business details unless the website sends better values.
- Do not create a duplicate customer.

If the row does not exist:

- Create the customer onboarding row.
- Set `portal_access` to false by default.
- Set `onboarding_status` from the website payload.

## Payment-First Edge Cases

- If customer pays for Launch first, status should become `paid_needs_review`.
- If customer starts Maintain or Managed before Launch exists, flag it for review before portal access.
- If payment succeeds but business details are sparse, status should remain review-needed before build work starts.
- If the same email submits Free Page Plan first and pays later, merge into the same customer record.

## What Still Requires Manual Setup

- Run `database/schema.sql` in the production database.
- Add `DATABASE_URL` in Vercel.
- Add Stripe environment variables in Vercel.
- Add `SOFTR_INTAKE_WEBHOOK_URL` or `ZAPIER_INTAKE_WEBHOOK_URL` in Vercel.
- Build the Zapier step that writes the payload into Softr's connected data source.
- Confirm Softr user permissions filter by customer email and `portal_access`.

## Current Softr Security Review

Observed in the Softr Studio preview:

- The Users table has `Email`, `Role`, and linked `Business` fields.
- Kurtis is an Admin linked to Resonate Solutions.
- Jack is a Customer linked to Excellent Pins & Badges Factory Inc.
- The Businesses table currently includes Mellow Moose Burgers, Resonate Solutions, and Excellent Pins & Badges Factory Inc.
- The customer-facing Business Profile block rendered multiple businesses in one portal view during preview.

Required correction:

1. On every customer-facing business/profile/review/update block, set the data filter to the current logged-in user's linked Business record.
2. If the block cannot use the linked Business relation, add an `Owner Email` or `Portal Email` field to the Businesses table and filter where that field equals the logged-in user's email.
3. Add `portal_access = true` as a second condition before private portal pages are visible.
4. Keep all-record tables only on Resonate admin pages.
5. Test as Jack's customer user after publishing. Jack should see only Excellent Pins records. He should not see Mellow Moose or Resonate Solutions.
