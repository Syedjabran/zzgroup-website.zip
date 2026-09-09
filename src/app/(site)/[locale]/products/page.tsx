import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { primaryImage } from "@/lib/media";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { CATALOGUE_CATEGORIES, categoryPath } from "@/lib/catalogue/categories";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collections | Frame Mouldings & Wall Panels Pakistan",
  description:
    "Browse ZZ Group frame mouldings, framing supplies, wall panels, WPC cladding, decorative surfaces and architectural trims across Pakistan.",
};

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    brand?: string;
    q?: string;
    type?: string;
    material?: string;
    colour?: string;
  }>;
}) {
  const { locale } = await params;
  const { brand, q, type, material, colour } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === "ur";
  const base = `/${loc}`;

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

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id, slug, sku, name_en, name_ur, colour, colour_family, material, core_material, product_type, brands(slug, name_en), product_images(storage_path, is_primary)",
    )
    .eq("published", true)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(60);

  if (brand) {
    const { data: b } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brand)
      .single();
    if (b) query = query.eq("brand_id", b.id);
  }
  if (q) query = query.or(`name_en.ilike.%${q}%,sku.ilike.%${q}%`);
  if (type) query = query.eq("product_type", type);
  if (material) query = query.ilike("core_material", material);
  if (colour) query = query.eq("colour_family", colour);

  const { data: products } = await query;

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <p
            className="atelier-section-label"
            style={{ color: "var(--atelier-brass-light)" }}
          >
            {ur ? "کلیکشنز · کیٹلاگ" : "Collections · Catalogue"}
          </p>
          <h1>{ur ? "ہر سطح کے لیے مواد" : "Materials for every surface."}</h1>
          <p>
            {ur
              ? "فریم مولڈنگز، وال پینلز اور آرکیٹیکچرل ٹرِمز کو مواد، رنگ اور استعمال کے مطابق دریافت کریں۔"
              : "Explore frame mouldings, wall panels and architectural trims by material, colour and application. Specifications and current pricing are confirmed by our team."}
          </p>
        </div>
      </section>

      <div className="container page-content">
        <div
          className="catalogue-paths"
          aria-label={ur ? "مصنوعات کی اقسام" : "Browse by collection"}
        >
          {CATALOGUE_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={categoryPath(loc, category.slug)}
              className="catalogue-path"
            >
              <span className="catalogue-path__division">
                {category.division.toUpperCase()}
              </span>
              <strong>{category.name[loc]}</strong>
              <span className="catalogue-path__arrow" aria-hidden>
                ↗
              </span>
            </Link>
          ))}
        </div>

        <form className="catalogue-filters">
          {brand && <input type="hidden" name="brand" value={brand} />}
          {type && <input type="hidden" name="type" value={type} />}
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder={t.actions.searchProducts}
            className="admin-input"
            style={{ maxWidth: 280 }}
          />
          <label className="filter-label">
            {ur ? "مواد" : "Material"}
            <select
              name="material"
              defaultValue={material ?? ""}
              className="admin-input"
            >
              <option value="">{ur ? "تمام مواد" : "All materials"}</option>
              {[
                "MDF",
                "Polystyrene (PS)",
                "PVC",
                "WPC",
                "SPC",
                "Marble",
                "Onyx",
                "Solid wood",
              ].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-label">
            {ur ? "رنگ" : "Colour"}
            <select
              name="colour"
              defaultValue={colour ?? ""}
              className="admin-input"
            >
              <option value="">{ur ? "تمام رنگ" : "All colours"}</option>
              {[
                "White",
                "Off-white / ivory",
                "Grey",
                "Charcoal",
                "Black",
                "Natural oak",
                "Walnut",
                "Gold",
                "Silver / chrome",
                "Bronze",
                "Marble white",
                "Onyx",
              ].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <button className="btn-primary">{t.actions.searchProducts}</button>
          <Link href={`${base}/products`} className="btn-secondary">
            {t.actions.clearFilters}
          </Link>
        </form>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          <Link
            href={`${base}/products?brand=zzmolding`}
            className="btn-secondary"
          >
            All ZZMOLDING
          </Link>
          <Link
            href={`${base}/products?brand=zzdecor`}
            className="btn-secondary"
          >
            All ZZDECOR
          </Link>
        </div>

        {!products || products.length === 0 ? (
          <p style={{ color: "var(--grey)" }}>
            {ur
              ? "ابھی کوئی مصنوعات دستیاب نہیں۔ جلد شامل کی جائیں گی۔"
              : "No products to show yet. New products are added regularly — please check back or contact us."}
          </p>
        ) : (
          <div className="product-grid">
            {products.map((p: any) => {
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
                    <p
                      style={{
                        fontSize: ".72rem",
                        color: "var(--zz-aged-bronze)",
                        margin: 0,
                        letterSpacing: ur ? 0 : ".1em",
                        textTransform: ur ? "none" : "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      {p.brands?.name_en}
                    </p>
                    <strong style={{ display: "block", marginTop: ".2rem" }}>
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
        )}
      </div>
    </>
  );
}
