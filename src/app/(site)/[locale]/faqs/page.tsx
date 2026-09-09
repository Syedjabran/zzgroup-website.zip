import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata = { title: "FAQs" };

const faqs = [
  [
    "Do you deliver across Pakistan?",
    "Yes, we coordinate delivery to cities throughout Pakistan. Share your city when you enquire and we will confirm details.",
  ],
  [
    "How do I get pricing?",
    "Send us the product SKU, quantity and delivery city via the contact form or WhatsApp, and our team will share pricing and availability.",
  ],
  [
    "Do you sell wholesale?",
    "Yes. We serve retailers, wholesale buyers, framing professionals, architects, designers and project buyers.",
  ],
  [
    "Can I confirm stock before ordering?",
    "Please contact us to confirm specifications, availability, pricing and delivery before placing an order.",
  ],
];

export default async function Faqs({
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
            {ur ? "خرید اور ترسیل" : "Buying & delivery"}
          </p>
          <h1>{ur ? "عمومی سوالات۔" : "Useful answers."}</h1>
          <p>
            {ur
              ? "مصنوعات، قیمتوں، اسٹاک اور پاکستان بھر میں ترسیل کے بارے میں۔"
              : "Essential information about products, pricing, stock and delivery across Pakistan."}
          </p>
        </div>
      </section>
      <div className="container page-content" style={{ maxWidth: 980 }}>
        <div className="content-panel">
          {faqs.map(([q, a], index) => (
            <div
              key={q}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: "1rem",
                borderBottom: "1px solid var(--border)",
                paddingBlock: "1.5rem",
              }}
            >
              <span className="atelier-section-label">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.35rem" }}>{q}</h3>
                <p style={{ color: "var(--grey)", marginBottom: 0 }}>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
