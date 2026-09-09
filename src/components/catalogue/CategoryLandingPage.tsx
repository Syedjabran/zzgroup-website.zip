import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type {
  CatalogueCategory,
  CategoryFacet,
} from "@/lib/catalogue/categories";
import { CATALOGUE_CATEGORIES, categoryPath } from "@/lib/catalogue/categories";
import type {
  CategoryResults,
  CategorySearchParams,
} from "@/lib/catalogue/queries";
import CategoryProductCard from "./CategoryProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";

const facetLabels: Record<CategoryFacet, Record<Locale, string>> = {
  material: { en: "Material", ur: "مواد" },
  colour: { en: "Colour", ur: "رنگ" },
  finish: { en: "Finish", ur: "فنش" },
  texture: { en: "Texture", ur: "ساخت" },
};

function pageHref(
  locale: Locale,
  category: CatalogueCategory,
  params: CategorySearchParams,
  page: number,
): string {
  const query = new URLSearchParams();
  for (const key of ["q", "material", "colour", "finish", "texture"] as const) {
    if (params[key]) query.set(key, params[key]!);
  }
  if (page > 1) query.set("page", String(page));
  const suffix = query.toString();
  return `${categoryPath(locale, category.slug)}${suffix ? `?${suffix}` : ""}`;
}

export default function CategoryLandingPage({
  category,
  locale,
  results,
  searchParams,
}: {
  category: CatalogueCategory;
  locale: Locale;
  results: CategoryResults;
  searchParams: CategorySearchParams;
}) {
  const ur = locale === "ur";
  const base = `/${locale}`;
  const related = CATALOGUE_CATEGORIES.filter(
    (candidate) => candidate.slug !== category.slug,
  ).slice(0, 3);
  const hasFilters = results.unfilteredTotal > 0;
  const hasActiveFilters = Boolean(
    searchParams.q ||
    searchParams.material ||
    searchParams.colour ||
    searchParams.finish ||
    searchParams.texture,
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: ur ? "ہوم" : "Home",
        item: `https://www.zzgroup.biz${base}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ur ? "کلیکشنز" : "Collections",
        item: `https://www.zzgroup.biz${base}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name[locale],
        item: `https://www.zzgroup.biz${categoryPath(locale, category.slug)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="category-hero" data-category={category.slug}>
        <div className="container category-hero__grid">
          <div className="category-hero__copy">
            <nav
              aria-label={ur ? "بریڈ کرمب" : "Breadcrumb"}
              className="category-breadcrumb"
            >
              <Link href={base}>{ur ? "ہوم" : "Home"}</Link>
              <span aria-hidden>/</span>
              <Link href={`${base}/products`}>
                {ur ? "کلیکشنز" : "Collections"}
              </Link>
              <span aria-hidden>/</span>
              <span aria-current="page">{category.name[locale]}</span>
            </nav>
            <p
              className="atelier-section-label"
              style={{ color: "var(--atelier-brass-light)" }}
            >
              {category.heroLabel[locale]}
            </p>
            <h1>{category.name[locale]}</h1>
            <p>{category.intro[locale]}</p>
          </div>
          <div
            className="category-hero__visual"
            role="img"
            aria-label={
              ur
                ? `${category.name.ur} کے لیے برانڈڈ بصری نمونہ`
                : `Branded material study for ${category.name.en}`
            }
          >
            <span>{category.division.toUpperCase()}</span>
            <strong>
              {String(
                CATALOGUE_CATEGORIES.findIndex(
                  (item) => item.slug === category.slug,
                ) + 1,
              ).padStart(2, "0")}
            </strong>
          </div>
        </div>
      </section>

      <div className="container category-body">
        <div className="category-results-heading">
          <div>
            <p className="atelier-section-label">
              {ur ? "منتخب کلیکشن" : "Selected collection"}
            </p>
            <h2>{ur ? "دستیاب مصنوعات" : "Available products"}</h2>
          </div>
          {results.unfilteredTotal > 0 && (
            <p role="status" aria-live="polite" className="category-count">
              {results.total}{" "}
              {ur ? "نتائج" : results.total === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        {hasFilters && (
          <form
            className="category-filters"
            aria-label={ur ? "کٹیگری فلٹرز" : `${category.name.en} filters`}
          >
            <label className="filter-label category-filter--search">
              {ur ? "تلاش" : "Search this category"}
              <input
                name="q"
                defaultValue={searchParams.q ?? ""}
                className="admin-input"
                placeholder={ur ? "نام یا کوڈ" : "Name or SKU"}
              />
            </label>
            {category.facets.map((facet) => {
              const values = results.facets[facet];
              if (values.length === 0) return null;
              return (
                <label className="filter-label" key={facet}>
                  {facetLabels[facet][locale]}
                  <select
                    name={facet}
                    defaultValue={searchParams[facet] ?? ""}
                    className="admin-input"
                  >
                    <option value="">
                      {ur
                        ? `تمام ${facetLabels[facet].ur}`
                        : `All ${facetLabels[facet].en.toLowerCase()}`}
                    </option>
                    {values.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
            <button className="atelier-btn">
              {ur ? "نتائج دکھائیں" : "Apply filters"}
            </button>
            {hasActiveFilters && (
              <Link
                href={categoryPath(locale, category.slug)}
                className="atelier-btn atelier-btn--ghost"
              >
                {ur ? "فلٹر صاف کریں" : "Clear"}
              </Link>
            )}
          </form>
        )}

        {results.items.length > 0 ? (
          <>
            <div className="product-grid" aria-label={category.name[locale]}>
              {results.items.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
            {results.pageCount > 1 && (
              <nav
                className="category-pagination"
                aria-label={ur ? "نتائج کے صفحات" : "Result pages"}
              >
                {results.page > 1 && (
                  <Link
                    href={pageHref(
                      locale,
                      category,
                      searchParams,
                      results.page - 1,
                    )}
                  >
                    {ur ? "پچھلا" : "Previous"}
                  </Link>
                )}
                <span>
                  {ur
                    ? `صفحہ ${results.page} از ${results.pageCount}`
                    : `Page ${results.page} of ${results.pageCount}`}
                </span>
                {results.page < results.pageCount && (
                  <Link
                    href={pageHref(
                      locale,
                      category,
                      searchParams,
                      results.page + 1,
                    )}
                  >
                    {ur ? "اگلا" : "Next"}
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <section className="category-empty-state">
            <p className="atelier-section-label">
              {hasActiveFilters
                ? ur
                  ? "کوئی مماثل نتیجہ نہیں"
                  : "No matching results"
                : ur
                  ? "آن لائن کلیکشن تیار ہو رہی ہے"
                  : "Online selection in preparation"}
            </p>
            <h2>
              {hasActiveFilters
                ? ur
                  ? "فلٹر تبدیل کر کے دوبارہ کوشش کریں۔"
                  : "Try a different filter combination."
                : category.name[locale]}
            </h2>
            <p>
              {hasActiveFilters
                ? ur
                  ? "فلٹر صاف کریں یا موجودہ دستیابی کے لیے ہماری ٹیم سے رابطہ کریں۔"
                  : "Clear the filters or ask our team about current availability."
                : category.empty[locale]}
            </p>
            <div className="atelier-actions">
              <Link
                href={`${base}/contact?category=${category.slug}`}
                className="atelier-btn"
              >
                {ur ? "کوٹیشن طلب کریں" : "Request a quotation"}
              </Link>
              <WhatsAppButton
                label={
                  ur
                    ? "موجودہ کیٹلاگ طلب کریں"
                    : "Ask for the current catalogue"
                }
                category={category.name.en}
              />
            </div>
          </section>
        )}

        {results.items.length > 0 && (
          <section className="category-enquiry-strip">
            <div>
              <p className="atelier-section-label">
                {category.division.toUpperCase()}
              </p>
              <h2>
                {ur
                  ? "نمونے یا پراجیکٹ قیمت درکار ہے؟"
                  : "Need samples or project pricing?"}
              </h2>
            </div>
            <div className="atelier-actions">
              <Link
                href={`${base}/contact?category=${category.slug}`}
                className="atelier-btn"
              >
                {ur ? "کوٹیشن طلب کریں" : "Request a quotation"}
              </Link>
              <WhatsAppButton
                label={ur ? "واٹس ایپ" : "WhatsApp"}
                category={category.name.en}
              />
            </div>
          </section>
        )}

        <section className="related-categories">
          <p className="atelier-section-label">
            {ur ? "متعلقہ کلیکشنز" : "Related collections"}
          </p>
          <div>
            {related.map((item) => (
              <Link key={item.slug} href={categoryPath(locale, item.slug)}>
                {item.name[locale]} <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
