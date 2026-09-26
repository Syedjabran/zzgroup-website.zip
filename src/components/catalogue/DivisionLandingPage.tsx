import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import type { Locale } from "@/lib/i18n";
import { primaryImage } from "@/lib/media";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { categoryPath } from "@/lib/catalogue/categories";
import {
  DIVISIONS,
  categoriesForDivision,
  divisionPath,
  type Division,
} from "@/lib/catalogue/divisions";

async function fetchDivisionProducts(brandSlug: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (
    !configuredUrl ||
    /your-project|placeholder|example\.(com|org)|localhost/i.test(configuredUrl)
  ) {
    return [];
  }
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", brandSlug)
    .eq("published", true)
    .maybeSingle();
  if (!brand) return [];
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, sku, name_en, name_ur, brands(name_en), product_images(storage_path, is_primary)",
    )
    .eq("brand_id", brand.id)
    .eq("published", true)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(12);
  return products ?? [];
}

export default async function DivisionLandingPage({
  division,
  locale,
}: {
  division: Division;
  locale: Locale;
}) {
  const ur = locale === "ur";
  const base = `/${locale}`;
  const categories = categoriesForDivision(division.slug);
  const products = (await fetchDivisionProducts(division.brandSlug)) as any[];
  const branch = division.branch;

  const branchWhatsapp = whatsappLink(
    generalMessage({ category: division.name.en }),
    branch.whatsapp,
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
        name: ur ? "پروڈکٹس" : "Products",
        item: `https://www.zzgroup.biz${base}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: division.name[locale],
        item: `https://www.zzgroup.biz${divisionPath(locale, division.slug)}`,
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

      <section className="category-hero" data-division={division.slug}>
        <div className="container category-hero__grid">
          <div className="category-hero__copy">
            <nav
              aria-label={ur ? "بریڈ کرمب" : "Breadcrumb"}
              className="category-breadcrumb"
            >
              <Link href={base}>{ur ? "ہوم" : "Home"}</Link>
              <span aria-hidden>/</span>
              <Link href={`${base}/products`}>{ur ? "پروڈکٹس" : "Products"}</Link>
              <span aria-hidden>/</span>
              <span aria-current="page">{division.name[locale]}</span>
            </nav>
            <p
              className="atelier-section-label"
              style={{ color: "var(--atelier-brass-light)" }}
            >
              {division.heroLabel[locale]}
            </p>
            <h1>{division.name[locale]}</h1>
            <p style={{ fontWeight: 600 }}>{division.tagline[locale]}</p>
            <p>{division.intro[locale]}</p>
          </div>
          <div
            className="category-hero__visual"
            role="img"
            aria-label={division.wordmark}
          >
            <span>{division.wordmark}</span>
          </div>
        </div>
      </section>

      {/* Branch selector tabs */}
      <div className="container" style={{ marginTop: "-1px" }}>
        <nav
          className="division-tabs"
          aria-label={ur ? "ڈویژنز" : "ZZ Group divisions"}
        >
          {DIVISIONS.map((d) => {
            const active = d.slug === division.slug;
            return (
              <Link
                key={d.slug}
                href={divisionPath(locale, d.slug)}
                className={`division-tab${active ? " division-tab--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {d.name[locale]}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="container category-body">
        {/* Branch contact bar */}
        <section
          className="division-contact"
          aria-label={
            ur
              ? `${division.name.ur} برانچ رابطہ`
              : `${division.name.en} branch contact`
          }
        >
          <div className="division-contact__intro">
            <p className="atelier-section-label">
              {ur ? "برانچ رابطہ" : "Branch contact"}
            </p>
            <h2>{division.name[locale]}</h2>
          </div>
          <dl className="division-contact__details">
            <div className="division-contact__item">
              <dt>{ur ? "پتہ" : "Address"}</dt>
              <dd>
                <span className="ltr">{branch.address[locale]}</span>
              </dd>
            </div>
            <div className="division-contact__item">
              <dt>{ur ? "فون / واٹس ایپ" : "Phone / WhatsApp"}</dt>
              <dd>
                <a href={`tel:${branch.phoneDial}`} className="ltr" dir="ltr">
                  {branch.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="division-contact__item">
              <dt>{ur ? "ای میل" : "Email"}</dt>
              <dd>
                <a href={`mailto:${branch.email}`} className="ltr" dir="ltr">
                  {branch.email}
                </a>
              </dd>
            </div>
          </dl>
          <div className="atelier-actions division-contact__actions">
            <a
              href={branchWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="atelier-btn"
            >
              {ur ? "واٹس ایپ پر رابطہ" : "Chat on WhatsApp"}
            </a>
            {branch.mapUrl && (
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="atelier-btn atelier-btn--ghost"
              >
                {ur ? "نقشے پر دیکھیں" : "View on Map"}
              </a>
            )}
            <Link
              href={`${base}/contact`}
              className="atelier-btn atelier-btn--ghost"
            >
              {ur ? "کوٹیشن طلب کریں" : "Request a quotation"}
            </Link>
          </div>
        </section>

        {/* Catalogue collections for this division */}
        {categories.length > 0 && (
          <section style={{ marginTop: "3rem" }}>
            <div className="category-results-heading">
              <div>
                <p className="atelier-section-label">
                  {ur ? "کیٹلاگ" : "Catalogue"}
                </p>
                <h2>{ur ? "کلیکشنز" : "Collections"}</h2>
              </div>
            </div>
            <div
              className="catalogue-paths"
              aria-label={ur ? "کلیکشنز" : "Collections"}
            >
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={categoryPath(locale, category.slug)}
                  className="catalogue-path"
                >
                  <span className="catalogue-path__division">
                    {division.wordmark}
                  </span>
                  <strong>{category.name[locale]}</strong>
                  <span className="catalogue-path__arrow" aria-hidden>
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured products for this division */}
        {products.length > 0 && (
          <section style={{ marginTop: "3rem" }}>
            <div className="category-results-heading">
              <div>
                <p className="atelier-section-label">
                  {ur ? "منتخب مصنوعات" : "Selected products"}
                </p>
                <h2>{ur ? "دستیاب مصنوعات" : "Available products"}</h2>
              </div>
            </div>
            <div className="product-grid">
              {products.map((p) => {
                const img = primaryImage(p.product_images);
                return (
                  <Link
                    key={p.id}
                    href={`${base}/products/${p.slug}`}
                    className="product-card"
                  >
                    <div className="product-card__image">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.name_en}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "grid",
                            placeItems: "center",
                            color: "var(--grey)",
                            fontSize: ".8rem",
                          }}
                        >
                          {ur ? "تصویر جلد" : "Image coming soon"}
                        </div>
                      )}
                    </div>
                    <div className="product-card__copy">
                      <strong style={{ display: "block" }}>
                        {ur && p.name_ur ? p.name_ur : p.name_en}
                      </strong>
                      <p
                        style={{
                          color: "var(--grey)",
                          fontSize: ".83rem",
                          margin: ".25rem 0 0",
                        }}
                      >
                        SKU: <span className="ltr">{p.sku}</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty / coming-soon state */}
        {categories.length === 0 && products.length === 0 && (
          <section className="category-empty-state" style={{ marginTop: "3rem" }}>
            <p className="atelier-section-label">
              {ur ? "کیٹلاگ تیاری میں" : "Catalogue in preparation"}
            </p>
            <h2>{division.name[locale]}</h2>
            <p>
              {ur
                ? "اس ڈویژن کا آن لائن کیٹلاگ تیار کیا جا رہا ہے۔ موجودہ پیداوار، صلاحیت اور سپلائی کے لیے ٹیم سے رابطہ کریں۔"
                : "The online catalogue for this division is being prepared. Contact the team for current production, capabilities and supply."}
            </p>
            <div className="atelier-actions">
              <a
                href={branchWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="atelier-btn"
              >
                {ur ? "واٹس ایپ پر رابطہ" : "Chat on WhatsApp"}
              </a>
              <Link
                href={`${base}/contact`}
                className="atelier-btn atelier-btn--ghost"
              >
                {ur ? "کوٹیشن طلب کریں" : "Request a quotation"}
              </Link>
            </div>
          </section>
        )}

        {/* Enquiry strip */}
        <section className="category-enquiry-strip" style={{ marginTop: "3rem" }}>
          <div>
            <p className="atelier-section-label">{division.wordmark}</p>
            <h2>
              {ur
                ? "نمونے یا پراجیکٹ قیمت درکار ہے؟"
                : "Need samples or project pricing?"}
            </h2>
          </div>
          <div className="atelier-actions">
            <a
              href={branchWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="atelier-btn"
            >
              {ur ? "واٹس ایپ" : "WhatsApp"}
            </a>
            <Link href={`${base}/contact`} className="atelier-btn atelier-btn--ghost">
              {ur ? "کوٹیشن طلب کریں" : "Request a quotation"}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
