import { siteUrl } from "@/lib/seo";

const content = `# Resonate Solutions
> Resonate Solutions designs mobile-friendly customer pages, online menus and service pages, customer intake forms, and managed website updates for small businesses in Northwest Arkansas.

## Main pages
- [Resonate Solutions](${siteUrl}/): Small business web design, customer pages, intake forms, and managed website updates.
- [MenuPilot](${siteUrl}/menupilot): Mobile-friendly online menu and service pages.
- [MenuPilot examples](${siteUrl}/menupilot/examples): A live customer-page example and explanation of MenuPilot.
- [Managed Page](${siteUrl}/portal): Routine updates for Resonate-hosted customer pages, with hosting included.
- [Small business website pricing](${siteUrl}/pricing): Launch, Webpage Hosting, and Managed Page pricing.
- [Excellent Pins customer intake example](${siteUrl}/excellent-pins): A guided quote-request page for custom pins, badges, medals, coins, and metal emblems.

## Verified service facts
- Every paid Resonate customer page starts with a $399 one-time Launch build.
- Webpage Hosting is $17.99 per month and includes hosting, SSL, routine platform maintenance, and basic uptime monitoring. Content updates are not included.
- Managed Page is $79.99 per month and includes hosting. Request standard updates whenever your business changes. Resonate reviews the change, updates your page, and confirms when it is complete.
- Larger projects, new features, and substantial redesigns are scoped separately.
- Resonate-hosted page updates are supported. External profiles are not automatically updated and may be managed manually only when access and scope are confirmed.

## Contact
- Email: questions@resonate.solutions
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
