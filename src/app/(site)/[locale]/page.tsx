import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroVideo from "@/components/HeroVideo";
import { notFound } from "next/navigation";
import { CATALOGUE_CATEGORIES, categoryPath } from "@/lib/catalogue/categories";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const ur = loc === "ur";
  const base = `/${loc}`;

  const collections = CATALOGUE_CATEGORIES.map((category) => [
    category.name[loc],
    categoryPath(loc, category.slug),
  ]);

  const stats = [
    ur ? "۲۰۰ سے زائد ڈیزائنز" : "200+ curated designs",
    ur ? "پاکستان بھر میں ترسیل" : "Pakistan-wide delivery",
    ur ? "ریٹیل اور ہول سیل" : "Retail & wholesale",
    ur ? "پراجیکٹ معاونت" : "Project specification support",
  ];

  const audiences = [
    [
      ur ? "۰۱" : "01",
      ur ? "آرکیٹیکٹس اور ڈیزائنرز" : "Architects & Designers",
      ur
        ? "فنشز، نمونے اور پراجیکٹ اسپیسیفیکیشن معاونت۔"
        : "Finish selection, samples and specification support.",
    ],
    [
      ur ? "۰۲" : "02",
      ur ? "فریمرز اور ریٹیلرز" : "Framers & Retailers",
      ur
        ? "پروفائل رینج، لوازمات اور قابلِ اعتماد سپلائی۔"
        : "Profile ranges, accessories and dependable supply.",
    ],
    [
      ur ? "۰۳" : "03",
      ur ? "کنٹریکٹرز اور ڈیویلپرز" : "Contractors & Developers",
      ur
        ? "پراجیکٹ مقدار، سائٹ رابطہ اور ترسیل۔"
        : "Project quantities, site coordination and delivery.",
    ],
    [
      ur ? "۰۴" : "04",
      ur ? "ہول سیلرز اور ڈیلرز" : "Wholesalers & Dealers",
      ur
        ? "ہول سیل قیمتیں اور ڈیلر معاونت۔"
        : "Wholesale structures and responsive dealer support.",
    ],
  ];

  return (
    <>
      <section className="atelier-hero">
        <div className="atelier-hero__grid">
          <div className="atelier-hero__copy">
            <p className="atelier-kicker">
              {ur
                ? "لاہور · پاکستان · قائم ۲۰۱۹"
                : "Lahore · Pakistan · Since 2019"}
            </p>
            <h1 className="atelier-title">
              {ur ? (
                <>
                  جگہ کو <em>شکل دیں۔</em>
                </>
              ) : (
                <>
                  Materials that <em>shape space.</em>
                </>
              )}
            </h1>
            <p className="atelier-hero__lede">
              {ur
                ? "پیشہ ورانہ فریمنگ اور جدید انٹیریئرز کے لیے فریم مولڈنگز، وال پینلز، ڈبلیو پی سی کلیڈنگ اور آرکیٹیکچرل ٹرِمز۔"
                : "A considered collection of frame mouldings, wall panels, WPC cladding and architectural trims for professional framing and contemporary interiors."}
            </p>
            <div className="atelier-actions">
              <Link href={`${base}/products`} className="atelier-btn">
                {ur ? "کلیکشنز دیکھیں" : "View collections"}
              </Link>
              <Link
                href={`${base}/contact`}
                className="atelier-btn atelier-btn--ghost"
              >
                {ur ? "پراجیکٹ کوٹیشن" : "Request a quotation"}
              </Link>
            </div>
          </div>

          <div className="atelier-hero__media">
            <HeroVideo opacity={0.78} />
            <div className="atelier-hero__stamp">
              <strong>
                {ur ? "دو مخصوص برانڈز" : "Two specialist divisions"}
              </strong>
              <span>ZZMOLDING · ZZDECOR</span>
            </div>
          </div>
        </div>
      </section>

      <div className="atelier-stats">
        <div className="container atelier-stats__grid">
          {stats.map((stat) => (
            <div className="atelier-stat" key={stat}>
              {stat}
            </div>
          ))}
        </div>
      </div>

      <section className="atelier-section atelier-section--paper">
        <div className="container">
          <div className="atelier-heading-row">
            <div>
              <p className="atelier-section-label">
                {ur ? "۰۱ · کلیکشنز" : "01 · Collections"}
              </p>
              <p className="atelier-section-intro">
                {ur
                  ? "مواد، استعمال اور فنش کے مطابق منتخب کریں۔"
                  : "Choose by material, application and finish. Every enquiry is confirmed with current specifications and availability."}
              </p>
            </div>
            <h2 className="atelier-section-title">
              {ur
                ? "ہر سطح کے لیے درست مواد۔"
                : "The right material for every surface."}
            </h2>
          </div>

          <div className="atelier-collection-list">
            {collections.map(([label, href], index) => (
              <Link href={href} className="atelier-collection" key={label}>
                <span className="atelier-collection__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="atelier-collection__name">{label}</span>
                <span className="atelier-collection__arrow" aria-hidden>
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="atelier-brand-grid"
        aria-label={ur ? "زیڈ زی گروپ کے برانڈز" : "ZZ Group divisions"}
      >
        <article className="atelier-brand">
          <div>
            <p
              className="atelier-section-label"
              style={{ color: "var(--atelier-brass-light)" }}
            >
              ZZMOLDING
            </p>
            <h3>
              {ur ? "فریم کو فن میں بدلیں۔" : "Make the frame part of the art."}
            </h3>
            <p>
              {ur
                ? "پیشہ ورانہ فریمنگ کے لیے پروفائلز، فنشز اور لوازمات۔"
                : "Profiles, finishes and accessories selected for professional framers, galleries, retailers and wholesale buyers."}
            </p>
          </div>
          <Link
            href={`${base}/products/zzmolding`}
            className="atelier-btn atelier-btn--ghost"
          >
            {ur ? "مولڈنگز دیکھیں" : "Explore mouldings"}
          </Link>
        </article>
        <article className="atelier-brand">
          <div>
            <p className="atelier-section-label">ZZDECOR</p>
            <h3>
              {ur
                ? "دیوار کو سطح سے آگے لے جائیں۔"
                : "Turn walls into architecture."}
            </h3>
            <p>
              {ur
                ? "جدید انٹیریئرز کے لیے پینلز، کلیڈنگ اور آرکیٹیکچرل ٹرِمز۔"
                : "Wall panels, cladding, statement sheets and architectural trims for residential, commercial and hospitality interiors."}
            </p>
          </div>
          <Link
            href={`${base}/products/zzdecor`}
            className="atelier-btn atelier-btn--ghost"
          >
            {ur ? "سطحیں دیکھیں" : "Explore surfaces"}
          </Link>
        </article>
      </section>

      <section className="atelier-section atelier-section--olive">
        <div className="container">
          <div className="atelier-heading-row">
            <div>
              <p
                className="atelier-section-label"
                style={{ color: "var(--atelier-brass-light)" }}
              >
                {ur ? "۰۲ · پیشہ ورانہ معاونت" : "02 · Trade support"}
              </p>
              <p
                className="atelier-section-intro"
                style={{ color: "rgba(255,255,255,.62)" }}
              >
                {ur
                  ? "نمونے، انتخاب اور مقدار کے لیے براہ راست ہماری ٹیم سے بات کریں۔"
                  : "Speak directly with our team about samples, selection, quantities and delivery."}
              </p>
            </div>
            <h2 className="atelier-section-title" style={{ color: "#fff" }}>
              {ur
                ? "آپ کے کام کے مطابق معاونت۔"
                : "Support shaped around your work."}
            </h2>
          </div>
          <div className="atelier-audience-grid">
            {audiences.map(([number, title, copy]) => (
              <article className="atelier-audience" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="atelier-actions" style={{ marginTop: "3rem" }}>
            <Link
              href={`${base}/contact`}
              className="atelier-btn"
              style={{
                background: "var(--atelier-clay)",
                borderColor: "var(--atelier-clay)",
              }}
            >
              {ur ? "پراجیکٹ شروع کریں" : "Start a project"}
            </Link>
            <WhatsAppButton
              label={ur ? "واٹس ایپ پر بات کریں" : "Chat on WhatsApp"}
            />
          </div>
        </div>
      </section>
    </>
  );
}
