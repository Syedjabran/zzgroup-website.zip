import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  CATALOGUE_CATEGORIES,
  categoryPath,
  getCategoryBySlug,
} from "@/lib/catalogue/categories";
import {
  getCategoryProducts,
  type CategorySearchParams,
} from "@/lib/catalogue/queries";
import CategoryLandingPage from "@/components/catalogue/CategoryLandingPage";

interface CategoryRouteProps {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<CategorySearchParams>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ["en", "ur"].flatMap((locale) =>
    CATALOGUE_CATEGORIES.map((category) => ({
      locale,
      categorySlug: category.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: CategoryRouteProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  if (!isLocale(locale)) return {};
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  const loc = locale as Locale;
  const canonical = categoryPath(loc, category.slug);

  return {
    title: category.seoTitle[loc],
    description: category.seoDescription[loc],
    alternates: {
      canonical,
      languages: {
        en: categoryPath("en", category.slug),
        ur: categoryPath("ur", category.slug),
        "x-default": categoryPath("en", category.slug),
      },
    },
    openGraph: {
      title: category.seoTitle[loc],
      description: category.seoDescription[loc],
      url: canonical,
      locale: loc === "ur" ? "ur_PK" : "en_PK",
      alternateLocale: loc === "ur" ? ["en_PK"] : ["ur_PK"],
      images: [
        { url: "/logo-full.png", alt: `${category.name.en} — ZZ GROUP` },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryRoute({
  params,
  searchParams,
}: CategoryRouteProps) {
  const [{ locale, categorySlug }, filters] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isLocale(locale)) notFound();
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const results = await getCategoryProducts(category, filters);
  return (
    <CategoryLandingPage
      category={category}
      locale={locale as Locale}
      results={results}
      searchParams={filters}
    />
  );
}
