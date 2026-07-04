import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/calculators/registry";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const calculatorRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/calculators/${slug}`,
    lastModified: now,
  }));

  return [{ url: SITE_URL, lastModified: now }, ...calculatorRoutes];
}
