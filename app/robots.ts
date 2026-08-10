import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";

const privatePaths = ["/admin/", "/dashboard/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privatePaths
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl
  };
}
