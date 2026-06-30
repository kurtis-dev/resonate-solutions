# Free Page Plan Lead Flow

This is the current operating flow for a customer who requests the Free Page Plan from the website.

## Principle

The website/database is the source of truth. Email is the notification and customer-communication layer, not the operating system.

## Step 1: Customer submits request

Entry points:

- `/api/intake`
- `/api/checkout` when the selected plan has `paymentMode: "none"`

The request creates or updates:

- `intake_requests`
- `customer_onboarding`
- `lead_tasks`
- `ops_alerts`

The customer also receives a receipt email when Resend is configured.

## Step 2: Internal lead task is created

Table: `lead_tasks`

Default stage: `new_request`

Task title format:

```text
Review Free Page Plan - [Business Name]
```

The task is due the next day and assigned to Kurtis by default.

## Step 3: Lead is classified

The request is classified into one of these task types:

- `food_menu_page`: restaurants, food trucks, menus, popups, specials
- `custom_quote_catalog`: custom products, artwork upload, quotes, catalogs, pins/badges
- `local_service_page`: service businesses, quote/booking pages, service areas
- `free_page_review`: general request that needs manual review

This keeps the customer experience simple while giving Resonate a specific internal review path.

## Step 4: Customer receipt email

The receipt says:

- Resonate received the request.
- The free step is a review, not a generic full build.
- Kurtis will review what they sent.
- Missing information will be requested with focused follow-up questions.
- They can reply with photos, menus, examples, service lists, artwork, or links.

Environment variables:

```text
RESEND_API_KEY=
CUSTOMER_EMAIL_FROM=
CUSTOMER_EMAIL_REPLY_TO=
```

Fallbacks:

- `CUSTOMER_EMAIL_FROM` falls back to `OPS_ALERT_EMAIL_FROM`.
- `CUSTOMER_EMAIL_REPLY_TO` falls back to `NEXT_PUBLIC_QUESTIONS_EMAIL`.

Health check:

```text
/api/health -> checks.customerReceiptEmailConfigured
```

## Step 5: Kurtis reviews task

Admin queue:

```text
/admin -> Lead review tasks
```

Each task links to a lead detail page:

```text
/admin/leads/[leadTaskId]
```

The detail page shows:

- Lead context and contact info.
- Workflow type and current stage.
- Next best action.
- Review checklist.
- Stage update control.
- A focused follow-up template based on the lead type.

Best-practice review:

1. Confirm the business/request is a good fit.
2. Identify missing information.
3. Classify the customer-facing page type.
4. Decide whether the next step is a free review, paid launch proposal, or not a fit.
5. Send only the focused follow-up questions needed for that business type.
6. Move the lead stage forward.

## Recommended stages

```text
new_request
needs_info
qualified
preview_planning
proposal_sent
waiting_on_payment
active_build
launched
closed
```

## Custom quote/catalog checklist

Use for Jack / Excellent Pins and similar businesses.

Customer-facing questions should stay simple:

- What kind of pin or badge do you need?
- About how many do you need?
- Do you have artwork ready?
- When do you need them?
- How will they be used?
- Will these mainly be for children age 12 or younger?

Internal review should capture:

- Product categories.
- Artwork upload need.
- Pricing factors: type, size, quantity, finish, backing, packaging, deadline.
- Intended-use risk: resale, school/youth use, children's audience.
- Whether compliance documentation may be needed.
- Real product photos/examples available for the page.

## External handoff behavior

Softr/Zapier handoff is still attempted after local persistence, task creation, customer receipt, and owner alert. The handoff has a short timeout so a slow external automation cannot block the customer request.
