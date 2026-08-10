import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  "/",
  "/menupilot",
  "/menupilot/examples",
  "/portal",
  "/pricing",
  "/excellent-pins",
  "/excellent-pins/library",
  "/m/mellow-moose-burgers"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({ url: absoluteUrl(path) }));
}
