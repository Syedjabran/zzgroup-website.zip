// ===========================================================================
// FILE: src/app/(site)/[locale]/contact/page.tsx
//
// Bidi fix: Latin text and digits inside an RTL paragraph must be isolated,
// or the browser reorders them — "+92 333 4813016" renders as
// "4813016 333 92+" in Urdu. The .ltr helper in globals.css already does
// this (direction: ltr; unicode-bidi: isolate); it was simply never applied
// on this page, though the header and footer both use it.
//
// Phone and email are also real links now, so a tap dials or composes.
// ===========================================================================

import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import ContactForm from "@/components/ContactForm";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/catalogue/categories";

export const metadata = { title: "Contact Us" };

const ADDRESS = "Shop No. 2, Kashif Center, Mission Road, Lahore, Pakistan";
const PHONE_DISPLAY = "+92 333 4813016";
const PHONE_DIAL = "+923334813016";
const EMAIL = "contact@zzgroup.biz";

export default async function Contact({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sku?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { sku, category: categorySlug } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === "ur";
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const categoryMessage = category
    ? ur
      ? `${category.name.ur} کے موجودہ کیٹلاگ، دستیابی اور قیمت کے بارے میں معلومات درکار ہیں۔`
      : `I would like the current ${category.name.en} catalogue, availability and quotation.`
    : undefined;

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <p
            className="atelier-section-label"
            style={{ color: "var(--atelier-brass-light)" }}
          >
            {ur ? "رابطہ · لاہور" : "Contact · Lahore"}
          </p>
          <h1>{ur ? "اپنا پراجیکٹ شروع کریں۔" : "Start with the material."}</h1>
          <p>
            {ur
              ? "کوٹیشن، نمونے، مصنوعات کی رہنمائی یا ہول سیل قیمتوں کے لیے ہماری ٹیم سے رابطہ کریں۔"
              : "Talk to our team about quotations, samples, product guidance or wholesale pricing."}
          </p>
        </div>
      </section>
      <div className="container page-content split-content-grid">
        <div>
          <p className="atelier-section-label">
            {ur ? "شو روم اور دفتر" : "Showroom & office"}
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem,4vw,3.5rem)",
              lineHeight: 1,
              marginTop: "1rem",
            }}
          >
            {ur ? "آئیں، بات کریں، منتخب کریں۔" : "Visit, talk, specify."}
          </h2>

          <p style={{ color: "var(--grey)", lineHeight: 2 }}>
            <span className="ltr">{ADDRESS}</span>
          </p>

          <dl
            style={{
              color: "var(--grey)",
              lineHeight: 2,
              margin: 0,
              display: "grid",
              gap: ".35rem",
            }}
          >
            <div>
              <dt style={term}>
                {ur ? "فون / واٹس ایپ" : "Phone / WhatsApp"}:
              </dt>{" "}
              <dd style={def}>
                <a
                  href={`tel:${PHONE_DIAL}`}
                  className="ltr"
                  style={link}
                  dir="ltr"
                >
                  {PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt style={term}>{ur ? "ای میل" : "Email"}:</dt>{" "}
              <dd style={def}>
                <a
                  href={`mailto:${EMAIL}`}
                  className="ltr"
                  style={link}
                  dir="ltr"
                >
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>

          <a
            href="https://share.google/SmXyo6uKvLxnf4j8J"
            target="_blank"
            rel="noopener noreferrer"
            className="atelier-btn atelier-btn--ghost"
            style={{ marginBlockStart: "1.25rem" }}
          >
            {ur ? "نقشے پر دیکھیں" : "View on Map"}
          </a>
        </div>

        <div className="content-panel">
          <p className="atelier-section-label">
            {ur ? "انکوائری" : "Project enquiry"}
          </p>
          <h2
            style={{
              marginTop: ".7rem",
              fontSize: "clamp(2rem,4vw,3.4rem)",
              lineHeight: 1,
            }}
          >
            {t.actions.requestQuote}
          </h2>
          <ContactForm
            locale={loc}
            dict={t}
            sku={sku}
            interest={category?.division}
            message={categoryMessage}
          />
        </div>
      </div>
    </>
  );
}

const term: React.CSSProperties = { display: "inline", fontWeight: 600 };
const def: React.CSSProperties = { display: "inline", margin: 0 };
const link: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  borderBottom: "1px solid currentColor",
};
