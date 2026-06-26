import { NextResponse } from "next/server";

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
      adminProtected: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
      siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      questionsEmailConfigured: Boolean(process.env.NEXT_PUBLIC_QUESTIONS_EMAIL),
      softrPortalConfigured: Boolean(process.env.NEXT_PUBLIC_SOFTR_PORTAL_URL),
      onboardingHandoffConfigured: Boolean(process.env.SOFTR_INTAKE_WEBHOOK_URL || process.env.ZAPIER_INTAKE_WEBHOOK_URL)
    }
  });
}
