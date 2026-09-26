import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound, redirect } from "next/navigation";
import { CATALOGUE_CATEGORIES, categoryPath } from "@/lib/catalogue/categories";
import {
  DIVISIONS,
  categoriesForDivision,
  divisionPath,
} from "@/lib/catalogue/divisions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products — ZZ Moulding · ZZ Decor · ZZ Industries",
  description:
    "Choose a ZZ Group division: ZZ Moulding (frame mouldings & framing supplies), ZZ Decor (wall panels, WPC cladding & architectural surfaces) or ZZ Industries (manufacturing). Each division has its own catalogue and branch contact.",
};

export default async function ProductsGateway({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    brand?: string;
    q?: string;
    type?: string;
  }>;
}) {
  const { locale } = await params;
  const { brand, type } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const ur = loc === "ur";

  // Preserve legacy deep links (?brand=&type=) → canonical category routes.
  const legacyCategory =
    CATALOGUE_CATEGORIES.find((category) => {
      if (!category.fallback || category.division !== brand) return false;
      return category.fallback.productType === type;
    }) ??
    (brand === "zzdecor" && type === "wall_panel"
      ? CATALOGUE_CATEGORIES.find((category) => category.slug === "wall-panels")
      : undefined) ??
    (brand === "zzdecor" && type === "sheet"
      ? CATALOGUE_CATEGORIES.find(
          (category) => category.slug === "marble-onyx-panels",
        )
      : undefined);
  if (legacyCategory) redirect(categoryPath(loc, legacyCategory.slug));
  // Bare brand deep link → the division page.
  if (brand && DIVISIONS.some((d) => d.slug === brand)) {
    redirect(divisionPath(loc, brand));
  }

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <p
            className="atelier-section-label"
            style={{ color: "var(--atelier-brass-light)" }}
          >
            {ur ? "پروڈکٹس · ڈویژنز" : "Products · Divisions"}
          </p>
          <h1>{ur ? "اپنی ڈویژن منتخب کریں۔" : "Choose your division."}</h1>
          <p>
            {ur
              ? "ہر ڈویژن کا اپنا کیٹلاگ اور برانچ رابطہ ہے۔ متعلقہ ڈویژن منتخب کریں تاکہ صرف اُسی کی مصنوعات دکھائی دیں۔"
              : "Each division has its own catalogue and branch contact. Pick a division to see only its products, organised by category."}
          </p>
        </div>
      </section>

      <div className="container page-content">
        <div
          className="atelier-brand-grid atelier-brand-grid--three"
          style={{ marginTop: 0 }}
        >
          {DIVISIONS.map((division) => {
            const categories = categoriesForDivision(division.slug);
            return (
              <article className="atelier-brand" key={division.slug}>
                <div>
                  <p
                    className="atelier-section-label"
                    style={{ color: "var(--atelier-brass-light)" }}
                  >
                    {division.wordmark}
                  </p>
                  <h3>{division.tagline[loc]}</h3>
                  <p>{division.intro[loc]}</p>
                  {categories.length > 0 ? (
                    <ul className="division-gateway__cats">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link href={categoryPath(loc, category.slug)}>
                            {category.name[loc]}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{
                        color: "var(--grey)",
                        fontSize: ".85rem",
                        marginTop: ".75rem",
                      }}
                    >
                      {ur
                        ? "کیٹلاگ تیاری میں — تفصیل کے لیے رابطہ کریں۔"
                        : "Catalogue in preparation — contact us for details."}
                    </p>
                  )}
                  <p
                    style={{
                      color: "var(--grey)",
                      fontSize: ".85rem",
                      marginTop: ".75rem",
                    }}
                  >
                    <span className="ltr">{division.branch.phoneDisplay}</span>
                    <span aria-hidden style={{ opacity: 0.4 }}> · </span>
                    <span className="ltr">{division.branch.address[loc]}</span>
                  </p>
                </div>
                <Link
                  href={divisionPath(loc, division.slug)}
                  className="atelier-btn atelier-btn--ghost"
                >
                  {ur
                    ? `${division.name.ur} دیکھیں`
                    : `Explore ${division.name.en}`}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
