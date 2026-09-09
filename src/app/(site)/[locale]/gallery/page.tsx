import { createClient } from "@/lib/supabase-server";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Project Gallery" };

export default async function Gallery({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ur = (locale as Locale) === "ur";
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("gallery_projects")
    .select("id, title_en, title_ur, city, project_type")
    .eq("published", true)
    .order("display_order");

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <p
            className="atelier-section-label"
            style={{ color: "var(--atelier-brass-light)" }}
          >
            {ur ? "تنصیب اور ترغیب" : "Installation & inspiration"}
          </p>
          <h1>{ur ? "پراجیکٹ گیلری۔" : "Projects in context."}</h1>
          <p>
            {ur
              ? "فریمنگ اور انٹیریئر سطحوں کو حقیقی جگہوں میں دیکھیں۔"
              : "See framing and interior-surface materials considered in real spaces."}
          </p>
        </div>
      </section>
      <div className="container page-content">
        {!projects || projects.length === 0 ? (
          <div
            className="content-panel"
            style={{
              minHeight: 300,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <p className="atelier-section-label">
                {ur ? "آرکائیو تیار ہو رہا ہے" : "Archive in progress"}
              </p>
              <h2
                style={{
                  fontSize: "clamp(2rem,4vw,3.4rem)",
                  margin: ".7rem 0",
                }}
              >
                {ur
                  ? "پراجیکٹس جلد شامل ہوں گے۔"
                  : "Project stories are being prepared."}
              </h2>
              <p style={{ color: "var(--grey)" }}>
                {ur
                  ? "اس دوران مصنوعات اور نمونوں کے لیے ہم سے رابطہ کریں۔"
                  : "In the meantime, contact us for product guidance and samples."}
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              marginTop: "1rem",
            }}
          >
            {projects.map((p: any) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-soft)",
                    aspectRatio: "4/3",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--grey)",
                  }}
                >
                  {ur ? "تصویر" : "Image"}
                </div>
                <div style={{ padding: ".75rem" }}>
                  <strong>{ur && p.title_ur ? p.title_ur : p.title_en}</strong>
                  {p.city && (
                    <p
                      style={{
                        color: "var(--grey)",
                        fontSize: ".85rem",
                        margin: ".25rem 0 0",
                      }}
                    >
                      {p.city}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
