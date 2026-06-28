# Operations Alert Notifications

Last updated: 2026-06-27

This is the phone-ping lane for Resonate/MenuPilot events that need fast attention.

## Purpose

Use this for owner/operator alerts, not customer-facing data sync.

Separate lanes:

- `ZAPIER_INTAKE_WEBHOOK_URL`: mirrors website onboarding into Softr/Zapier.
- `ZAPIER_ALERT_WEBHOOK_URL`: sends Kurtis operational alerts by SMS/email/push.

## Environment Variables

Add in Vercel:

```text
ZAPIER_ALERT_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
ZAPIER_WEBHOOK_SECRET=...
```

`OPS_ALERT_WEBHOOK_URL` is also supported as an alternate name, but prefer `ZAPIER_ALERT_WEBHOOK_URL`.

Health check flag:

```text
/api/health -> checks.opsAlertWebhookConfigured
```

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

## Recommended Zapier Setup

Zap name:

```text
MenuPilot - Ops alerts to Kurtis
```

Steps:

1. Trigger: Webhooks by Zapier -> Catch Hook.
2. Optional filter: require header `x-zapier-secret` matches `ZAPIER_WEBHOOK_SECRET`.
3. Paths by `eventType`:
   - `customer_signup`: high-priority text.
   - `paid_plan_started`: high-priority text.
   - `payment_completed`: high-priority text.
   - `customer_question`: normal-priority text or email.
4. Action: SMS by Zapier, Twilio, Gmail, or Slack.

Suggested SMS body:

```text
MenuPilot alert: {{title}}
{{businessName}} - {{contactName}}
{{email}} {{phone}}
{{message}}
Admin: {{actionUrl}}
```

## Recommended Alert Rules

- Text immediately for signups and payments.
- Text or email for public questions.
- Do not send alerts for casual page views yet; add analytics separately if needed.
- Do not send card/bank data through Zapier or SMS.

