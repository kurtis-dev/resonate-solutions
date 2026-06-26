# MenuPilot Channel Automation Workflows

Last updated: 2026-06-19

## Product Rule

MenuPilot is not customer-direct-to-public automation. A customer sends one clear request, Resonate reviews it, then the approved change is routed to the right channel.

Customer-facing promise:

> Ask once. We review it. Then we update the customer page and the approved channels that make sense for the business.

Internal rule:

- Do not publish raw customer text.
- Do not make live external changes without access, permission, payment status, owner approval, and approved public copy.
- Every external action must write back status, proof, error notes, and confirmation state.

## Sources Of Truth

Stripe owns payment truth.

Softr owns customer-facing intake, business profile, update requests, account visibility, and status views.

Google Sheets owns the current operations queue and audit trail:

- `Update Desk`
- `Channel Automation Matrix 2026-06-19`
- `Automation Gates`
- `Build Log`
- `Operating Bible`

The website explains the product and receives Free Page Plan interest. It should not become the private operations queue.

## Softr View Plan

Customer views:

- `Home`: clear next action, recent request status, billing/access reminders in plain language.
- `Business Info`: business details, public links, channels connected or still needed.
- `Request Update`: category-first request path.
- `Photos & Files`: menu photos, logo, food/service photos, proof/source material.
- `Billing`: launch payment, monthly plan, manage card/subscription.
- `Support`: ask a question without creating a public update.

Admin/internal views:

- `Update Review`: new requests needing review.
- `Approved To Send`: requests that have passed permission, payment, copy, and destination checks.
- `Channel Issues`: access missing, automation failed, owner review needed.
- `Completed Updates`: proof, provider URL, customer confirmation status.

Customer-facing labels should avoid `Zapier`, `API`, `Provider Action ID`, `Payment Gate`, `Automation Status`, and internal table names.

## Request Categories

Use one backend `Update Requests` table, but ask focused questions based on category.

Recommended customer categories:

- Hours or closed date
- Menu item or price
- Sold out or unavailable item
- Special, event, or announcement
- Photo or file
- Ordering, booking, or link change
- Website/page wording
- Other

Required common fields:

- Business
- Requested by
- Request type
- What should change?
- Where should this change appear?
- When should it go live?
- Effective date
- End date, if temporary
- Proof/source material, when prices, menu items, hours, or public claims are involved

## Approval Gates

Required before external action:

- `Permission Verified = Yes`
- `Payment Gate = OK` or owner override
- `Approval Status = Approved`
- `Public Copy Approved = Yes`
- Destination channel is selected
- Channel access is verified or the task is marked manual-assisted
- Exact go-live timing is known when the request affects hours, closures, availability, or specials

## First-Wave Workflows

### 0. Route Planner Webhook

Use this before any external publishing workflow.

Endpoint:

```text
POST /api/automation/route-update
```

Purpose:

- Turn one customer update request into channel-specific tasks.
- Separate auto-ready tasks from validate-first and manual-support tasks.
- Block unsafe work when payment, permission, approval, public copy, or channel access is missing.
- Give Zapier a structured response it can use to create task rows in Google Sheets, Airtable, Softr, or another operations table.

Security:

- Set `ZAPIER_WEBHOOK_SECRET` in Vercel.
- Zapier should send the same value as either:
  - `x-zapier-secret`
  - `Authorization: Bearer YOUR_SECRET`

Recommended Zapier trigger:

1. Softr form submission or Google Sheets `Update Desk` row created/updated.
2. Zapier Webhooks by Zapier -> POST to `/api/automation/route-update`.
3. Loop over returned `tasks`.
4. Create one operations task per returned task.
5. Notify Resonate only when a task is blocked, manual-support, or ready-to-send.

Example request:

```json
{
  "businessName": "Mellow Moose Burgers",
  "requestType": "hours",
  "whatShouldChange": "Closing two hours early for the storm. Back tomorrow at 11.",
  "plan": "managed",
  "paymentStatus": "ok",
  "permissionVerified": true,
  "approvalStatus": "approved",
  "publicCopyApproved": true,
  "requestedChannels": ["MenuPilot page", "Google Business Profile", "Facebook Page", "DoorDash"],
  "connectedChannels": ["Google Business Profile", "Facebook Page"]
}
```

Expected behavior:

- MenuPilot page can become auto-ready when approved.
- Google Business Profile hours changes become `validate_first` with status `ready_for_validation`; Zapier should not treat them as normal `ready_to_send` tasks.
- Facebook Page can become auto-ready when connected and copy-approved.
- DoorDash becomes `manual_support`.

### 1. MenuPilot / Website Update

Use first because Resonate controls the destination.

Flow:

1. Customer submits request in Softr.
2. Request lands in Update Desk.
3. Resonate reviews details, payment, source material, and public copy.
4. Approved change updates the MenuPilot page or website content.
5. Result writes back with preview/live URL, completion notes, and confirmation status.

Safe test:

- Change one approved text/link/menu detail on a test or Resonate-owned page.

### 2. Facebook Page Post

Flow:

1. Google Sheets `Update Desk` trigger.
2. Filter gates: Facebook selected, approved, public copy approved, payment OK, permission verified.
3. Facebook Pages action creates the page post from `Approved Public Copy`.
4. Google Sheets writeback updates result status, provider URL/ID if available, run time, owner review flag, and customer confirmation status.

Current state:

- Draft Zap exists as `369175236`.
- It is not tested, published, or turned on.

Safe test:

- Use a Resonate-owned page and one owner-approved post.

### 3. Google Business Profile Post

Flow:

1. Approved Update Desk row routes to GBP post draft.
2. API/Zapier request creates a post only after GBP account/location access is confirmed.
3. Write back provider status, errors, and customer confirmation state.

Safe test:

- Use Resonate Solutions GBP only after exact post copy is approved.

### 4. Google Business Profile Special Hours

Treat as high-risk.

Flow:

1. Normalize exact date, time, timezone, and open/closed state.
2. Run validate-only/API test first.
3. Only run live update after explicit approval.
4. Write back result and confirmation state.

Safe test:

- Validate-only first against Resonate GBP.
- One live special-hours test only after exact owner approval.

### 5. Instagram Business Media

Flow:

1. Approved asset and caption.
2. Publish through Instagram Business action only after Meta access is confirmed.
3. Write back result and customer confirmation state.

Safe test:

- Use Resonate/test account if available.

## Manual-Assisted Channels

These should be supported as managed work, not sold as proven instant automation yet:

- DoorDash
- Uber Eats
- Grubhub
- Apple Business / Apple Maps
- Bing Places
- Yelp
- Tripadvisor
- OpenTable / Resy / Tock
- Square / Toast / Shopify / ChowNow

For these channels, create an internal task with proof, access status, completion notes, and customer confirmation.

## Website Messaging

Good public phrasing:

- `Where updates go`
- `One request can become the right update in the right place.`
- `MenuPilot page`
- `Google profile`
- `Facebook + Instagram`
- `Ordering + delivery`
- `Managed support`
- `Review first`

Avoid:

- `Push-button everywhere`
- `Automatic DoorDash updates`
- `Zapier route`
- `API sync`
- `Database workflow`

## Next Build Steps

1. Mirror channel categories into Softr customer-facing update choices.
2. Create admin views for approved-to-send, blocked, failed, and completed updates.
3. Complete one safe website update writeback test.
4. Complete one Facebook draft Zap validation without publishing.
5. Prepare GBP post route, then GBP special-hours validate-only route.
6. Capture polished app screenshots once Softr UI is visually ready.
7. Add those screenshots/proofs to the public website.
