import type { MetadataRoute } from "next";
import { CATALOGUE_CATEGORIES, categoryPath } from "@/lib/catalogue/categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zzgroup.biz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/contact",
    "/gallery",
    "/faqs",
  ];
  const staticEntries = ["en", "ur"].flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/products" ? 0.9 : 0.7,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${route}`,
          ur: `${SITE_URL}/ur${route}`,
        },
      },
    })),
  );

  const categoryEntries = CATALOGUE_CATEGORIES.flatMap((category) =>
    (["en", "ur"] as const).map((locale) => ({
      url: `${SITE_URL}${categoryPath(locale, category.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: {
        languages: {
          en: `${SITE_URL}${categoryPath("en", category.slug)}`,
          ur: `${SITE_URL}${categoryPath("ur", category.slug)}`,
        },
      },
    })),
  );

  return [...staticEntries, ...categoryEntries];
}
