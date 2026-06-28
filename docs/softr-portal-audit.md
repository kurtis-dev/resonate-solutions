# Softr Portal Audit

Last audited: 2026-06-27

This audit covers the live Softr customer portal, separate from the website repo placeholder scan.

## Portal URLs

Current Softr live app:

```text
https://reba51313.softr.app
```

Desired branded portal:

```text
https://app.resonate.solutions
```

Current custom-domain status:

- `https://app.resonate.solutions/start` did not resolve during audit (`ERR_NAME_NOT_RESOLVED`).
- Customers can use the Softr URL today, but the branded app domain still needs Softr domain setup plus DNS.

## Security And Visibility

Verified in Softr preview as Jack Chou:

- Jack is linked to `Excellent Pins & Badges Factory Inc.`.
- Main customer pages showed Jack's user identity and his business, not all businesses.
- The earlier multi-business exposure risk appears improved in Jack preview.

Still required:

- Verify every customer-facing block is filtered by the logged-in user's linked Business or owner email.
- Add `portal_access = true` as a filter/visibility condition before private portal content is shown.
- Keep all-record views only on Resonate admin-only pages.
- Retest with a non-admin customer after every publish.

## Customer-Facing Blockers

### `Files & Photos`

Visible error in Jack preview:

```text
Field not found: wkgG0
```

This should be fixed before sending the portal to customers. It likely means a deleted/renamed Softr database field is still referenced by a list/detail block.

### Softr Branding

The portal still shows the Softr badge:

```text
Free AI No Code App Builder | Portals | Internal Tools
```

This is acceptable for internal testing, but not for a professional customer launch if it can be removed on the selected Softr plan.

### Public Start Page

The public intake route exists:

```text
https://reba51313.softr.app/start
```

Cleanup needed:

- `Business Name` placeholder currently says `Your name`; use `Business name`.
- Button says `Request onboarding`; use clearer customer language such as `Send business details`.
- The page currently asks for too little information for downstream work.
- Add or confirm fields for phone, city/service area, current website/menu link, main need, and preferred plan/source.

## Product UX Gaps

### Quick Update

Current Quick Update page is functional but still feels like one broad form.

It asks for:

- Update type
- When it should go live
- Details
- Short summary
- Start/end dates
- Temporary/permanent
- Notes
- Upload
- Where customers should see it

Recommended next state:

- Keep the first choice simple.
- After the customer chooses an update type, show only the follow-up fields needed for that type.
- Examples:
  - Hours/closed date: date, exact hours, temporary/permanent, affected channels.
  - Menu item/price: item name, old price, new price, effective date, photo/proof.
  - Sold out/unavailable: item, return date if known, affected channels.
  - Special/announcement: text, start date, end date, image, affected channels.
  - Link/order/booking: current link, new link, where it should appear.

### Business Info

The page is clear enough for a first pass, but it currently reads like a checklist of information Resonate needs rather than a guided edit flow.

Recommended next state:

- Break into sections: business basics, hours/location, menu/services, links, photos.
- Let customers see what Resonate has on file.
- Let customers request changes from each section.

### Billing

The billing copy is practical, but it does not yet connect to Stripe or a customer billing portal.

Required before paid launch:

- Stripe products/prices or payment links configured.
- Billing page buttons connected to the correct payment/support path.
- Clear status for paid, pending, failed, paused, and cancelled.

## Data Cleanup

Prototype/test records visible in Softr data:

- `TEST - Codex Intake`
- `Test - Resonate holiday Hours`
- `Resonate Facebook sandbox test 1`
- Multiple Mellow Moose test upload records
- Blank or incomplete Mellow Moose business owner fields

Recommended:

- Keep sandbox records only if filtered to admin-only views.
- Archive/delete test records before sending customer screenshots.
- Do not show Mellow Moose test data inside Jack/customer views.

## Page And Naming Cleanup

Softr page list includes generated/detail pages:

- `Submitted Assets details`
- `File Submission details`
- `Files & Photos details`
- `Onboarding flow`

These may be technically necessary, but they should not appear in customer navigation or customer-facing labels unless renamed/polished.

Recommended customer labels:

- `Quick Update`
- `Assets`
- `Business Info`
- `Brand`
- `Review`
- `Support`
- `Billing`

Avoid customer-facing labels such as:

- `Onboarding flow`
- `Submitted Assets details`
- `File Submission details`
- `Database`
- `Workflow`
- `Zapier`

## Recommended Fix Order

1. Fix `Files & Photos` broken field reference.
2. Confirm all customer-facing blocks filter by current user/business and `portal_access`.
3. Connect `app.resonate.solutions` in Softr and DNS.
4. Polish `/start` intake wording and required fields.
5. Convert Quick Update from catch-all form to type-specific follow-up flows.
6. Remove Softr badge if the plan supports it.
7. Clean or hide sandbox/test records.
8. Connect Billing to Stripe once Stripe env vars and products are ready.

