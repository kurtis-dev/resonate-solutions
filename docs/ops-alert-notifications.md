# Operations Alert Notifications

Last updated: 2026-06-27

This is the phone-ping lane for Resonate/MenuPilot events that need fast attention.

Decision update: internal owner alerts should be first-party in the app, not dependent on Zapier. Zapier can still be used later for outside platform automations, but signups, payments, and customer questions should be logged in Neon and sent directly by the app.

## Purpose

Use this for owner/operator alerts, not customer-facing data sync.

Separate lanes:

- `ZAPIER_INTAKE_WEBHOOK_URL`: mirrors website onboarding into Softr/Zapier.
- First-party ops alerts: saves `ops_alerts`, emails Kurtis, and texts high-priority events when SMS is configured.
- `ZAPIER_ALERT_WEBHOOK_URL`: optional legacy/future fallback for operational alerts.

## Environment Variables

Add in Vercel:

```text
RESEND_API_KEY=
OPS_ALERT_EMAIL_TO=kurtis@resonate.solutions
OPS_ALERT_EMAIL_FROM=Resonate Solutions <onboarding@resend.dev>

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE=
OPS_ALERT_SMS_TO=
```

`OPS_ALERT_EMAIL_FROM` should move to a verified `@resonate.solutions` sender after the Resend domain is verified. Until then, `onboarding@resend.dev` can be used for testing.

`ZAPIER_ALERT_WEBHOOK_URL` and `OPS_ALERT_WEBHOOK_URL` are still supported as optional fallback webhook destinations, but they are no longer the preferred internal-alert path.

Health check flag:

```text
/api/health -> checks.opsAlertDatabaseConfigured
/api/health -> checks.opsAlertEmailConfigured
/api/health -> checks.opsAlertSmsConfigured
/api/health -> checks.opsAlertWebhookConfigured
```

Database:

```text
database/schema.sql -> ops_alerts
```

Run the current schema in Neon after deploying this change so alerts can be stored for admin review.

## Events Sent

### New signup

Triggered when a customer submits the website onboarding/checkout form.

Event types:

```text
customer_signup
paid_plan_started
```

Payload includes:

- business name
- contact name
- email
- phone
- plan name
- admin URL

### Payment completed

Triggered by Stripe webhook after checkout session completion.

Event type:

```text
payment_completed
```

Payload includes customer/business details plus Stripe session metadata.

### Customer question

Triggered when someone submits a public MenuPilot page question/comment.

Event type:

```text
customer_question
```

Payload includes:

- business name
- customer name/email, if provided
- item name
- comment
- admin URL

## First-Party Alert Flow

The app now calls `notifyOpsAlert` from:

- website checkout/free-page flow
- public intake API
- public MenuPilot item questions
- Stripe checkout completion webhook

For every alert:

1. Normalize safe alert fields.
2. Save an `ops_alerts` record when `DATABASE_URL` is configured.
3. Send email through Resend when `RESEND_API_KEY` and `OPS_ALERT_EMAIL_TO` are configured.
4. Send SMS through Twilio only when `priority` is `high` and all Twilio env vars are configured.
5. Optionally send the same payload to Zapier if a Zapier alert webhook is configured.

Do not send card/bank data through email, SMS, Zapier, or logs.

## Parked Zapier Draft

Zap name:

```text
MenuPilot - Ops alerts to Kurtis
```

Current draft status as of 2026-06-27:

- Draft Zap exists in Zapier as `MenuPilot - Ops alerts to Kurtis`.
- Trigger is `Webhooks by Zapier -> Catch Hook`.
- JSON sample payload was received and selected for field mapping.
- Email action to `kurtis@resonate.solutions` was mapped and tested successfully with fake sample data.
- High-priority path condition was tested successfully: continue when `priority` exactly matches `high`.
- SMS action is not complete yet because Zapier requires connecting/verifying `SMS by Zapier`.
- Zap is not published yet. Zapier reports this Zap uses Pro features: Webhooks, Paths, and SMS/multi-step routing.
- Do not add the webhook URL to Vercel production until the Zap can be published and the SMS decision is final.

If Zapier is revived later, use these steps:

1. Trigger: Webhooks by Zapier -> Catch Hook.
2. Optional filter: require header `x-zapier-secret` matches `ZAPIER_WEBHOOK_SECRET`.
3. Paths by `eventType`:
   - `customer_signup`: high-priority text.
   - `paid_plan_started`: high-priority text.
   - `payment_completed`: high-priority text.
   - `customer_question`: normal-priority email, with optional text.
4. Action 1: send email to Kurtis.
5. Action 2: send SMS/push for high-priority alerts.

Use Gmail, Email by Zapier, or another email app for the email copy. Use SMS by Zapier, Twilio, Gmail carrier email-to-text, or Slack/mobile push for the phone ping.

Suggested SMS body:

```text
MenuPilot alert: {{title}}
{{businessName}} - {{contactName}}
{{email}} {{phone}}
{{message}}
Admin: {{actionUrl}}
```

Suggested email subject:

```text
MenuPilot alert: {{title}} - {{businessName}}
```

Suggested email body:

```text
Event: {{eventType}}
Priority: {{priority}}
Business: {{businessName}}
Contact: {{contactName}}
Email: {{email}}
Phone: {{phone}}
Plan: {{planName}}

{{message}}

Admin: {{actionUrl}}
Created: {{createdAt}}
```

## Recommended Alert Rules

- Email every signup, payment, and customer question.
- Text immediately for signups, paid plan starts, and payments.
- Email customer questions by default; add SMS for questions later if volume stays low.
- Do not send alerts for casual page views yet; add analytics separately if needed.
- Do not send card/bank data through Zapier or SMS.
