import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    checks: {
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      launchKitPriceConfigured: Boolean(process.env.STRIPE_PRICE_LAUNCH_KIT),
      upkeepPriceConfigured: Boolean(process.env.STRIPE_PRICE_UPKEEP),
      managedPriceConfigured: Boolean(process.env.STRIPE_PRICE_MANAGED),
      adminProtected: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
      siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      questionsEmailConfigured: Boolean(process.env.NEXT_PUBLIC_QUESTIONS_EMAIL)
    }
  });
}
