import QRCode from "qrcode";
import { getMenuBusiness, publicMenuUrl } from "@/lib/menu-store";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const business = await getMenuBusiness(slug);

  if (!business) {
    return new Response("Menu not found.", { status: 404 });
  }

  const svg = await QRCode.toString(publicMenuUrl(business.slug), {
    type: "svg",
    margin: 2,
    width: 720,
    color: {
      dark: "#202320",
      light: "#ffffff"
    }
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    }
  });
}
