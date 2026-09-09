import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata = { title: "About ZZ Group" };

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ur = (locale as Locale) === "ur";
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <p
            className="atelier-section-label"
            style={{ color: "var(--atelier-brass-light)" }}
          >
            {ur ? "لاہور · قائم ۲۰۱۹" : "Lahore · Established 2019"}
          </p>
          <h1>
            {ur ? "مواد اور جگہ کے درمیان۔" : "Between material and space."}
          </h1>
          <p>
            {ur
              ? "زیڈ زی گروپ پیشہ ورانہ فریمنگ اور آرکیٹیکچرل انٹیریئرز کے لیے دو مخصوص برانڈز کو یکجا کرتا ہے۔"
              : "ZZ Group brings two specialist brands together for professional framing, retail distribution and architectural interiors."}
          </p>
        </div>
      </section>
      <div className="container page-content">
        <div className="split-content-grid">
          <div>
            <p className="atelier-section-label">
              {ur ? "ہم کون ہیں" : "Who we are"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem,3vw,2.8rem)",
                lineHeight: 1.08,
                marginTop: "1rem",
              }}
            >
              ZZMOLDING
              <br />
              ZZDECOR
            </p>
          </div>
          <div className="content-panel">
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.6rem)", marginTop: 0 }}>
              {ur ? "ہماری کہانی" : "A dependable source, built in Lahore."}
            </h2>
            <p>
              {ur
                ? "زیڈزی گروپ ۲۰۱۹ میں لاہور میں قائم ہوا، اس مقصد کے ساتھ کہ معیاری فریمنگ اور آرائشی مصنوعات کو وسیع انتخاب، مسابقتی قیمتوں اور ذمہ دار سروس کے ذریعے مزید قابلِ رسائی بنایا جائے۔"
                : "ZZ Group was established in Lahore in 2019 with a clear objective: make quality framing and decorative interior products more accessible through wider choice, competitive pricing and responsive service. Our portfolio includes more than 200 frame-moulding designs alongside wall panels, WPC cladding, decorative surfaces, trims and accessories."}
            </p>
            <hr
              style={{
                border: 0,
                borderTop: "1px solid var(--atelier-line)",
                marginBlock: "2rem",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "2rem",
              }}
            >
              <div>
                <p className="atelier-section-label">
                  {ur ? "مشن" : "Mission"}
                </p>
                <p>
                  {ur
                    ? "پاکستان بھر میں معیاری مصنوعات، ذمہ دار سروس اور قابلِ اعتماد ترسیل فراہم کرنا۔"
                    : "Provide quality framing and architectural décor products with responsive service and reliable delivery across Pakistan."}
                </p>
              </div>
              <div>
                <p className="atelier-section-label">{ur ? "وژن" : "Vision"}</p>
                <p>
                  {ur
                    ? "فریمنگ اور ڈیزائن کے پیشہ ور افراد کے لیے پہلا قابلِ اعتماد ذریعہ بننا۔"
                    : "Become a trusted first-choice source for framing professionals, retailers, architects and designers."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
