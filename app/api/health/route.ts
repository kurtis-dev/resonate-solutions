import { NextResponse } from "next/server";
import { adminCredentialStatus, hasConfiguredAdminAuth } from "@/lib/admin-auth";
import { customerPortalUrl } from "@/lib/portal";

export async function GET() {
  return NextResponse.json({
    ok: true,
    checks: {
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      setupPriceConfigured: Boolean(process.env.STRIPE_PRICE_SETUP),
      corePriceConfigured: Boolean(process.env.STRIPE_PRICE_CORE),
      plusPriceConfigured: Boolean(process.env.STRIPE_PRICE_PLUS),
      adminProtected: hasConfiguredAdminAuth(),
      adminCredentialStatus: adminCredentialStatus(),
      siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      questionsEmailConfigured: Boolean(process.env.NEXT_PUBLIC_QUESTIONS_EMAIL),
      softrPortalConfigured: Boolean(customerPortalUrl),
      softrPortalUrl: customerPortalUrl,
      onboardingHandoffConfigured: Boolean(process.env.SOFTR_INTAKE_WEBHOOK_URL || process.env.ZAPIER_INTAKE_WEBHOOK_URL),
      opsAlertDatabaseConfigured: Boolean(process.env.DATABASE_URL),
      opsAlertEmailConfigured: Boolean(process.env.RESEND_API_KEY && (process.env.OPS_ALERT_EMAIL_TO || process.env.ADMIN_ALERT_EMAIL)),
      opsAlertSmsConfigured: Boolean(
        process.env.TWILIO_ACCOUNT_SID &&
          process.env.TWILIO_AUTH_TOKEN &&
          process.env.TWILIO_FROM_PHONE &&
          process.env.OPS_ALERT_SMS_TO
      ),
      opsAlertWebhookConfigured: Boolean(process.env.ZAPIER_ALERT_WEBHOOK_URL || process.env.OPS_ALERT_WEBHOOK_URL)
    }
  });
}
