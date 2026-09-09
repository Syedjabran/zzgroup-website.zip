import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const ur = locale === "ur";
  const year = new Date().getFullYear();

  const links = [
    { href: base, label: t.nav.home },
    {
      href: `${base}/products`,
      label: ur ? "تمام کلیکشنز" : "All collections",
    },
    { href: `${base}/products/zzmolding`, label: "ZZMOLDING" },
    { href: `${base}/products/zzdecor`, label: "ZZDECOR" },
    { href: `${base}/gallery`, label: ur ? "پراجیکٹس" : "Projects" },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/faqs`, label: t.nav.faqs },
  ];

  return (
    <footer className="site-footer">
      <div className="container site-footer__masthead">
        <p className="site-footer__wordmark">ZZ GROUP</p>
        <p className="site-footer__strap">
          {ur ? "فریم۔ سطح۔ جگہ۔" : "Frame. Surface. Space."}
        </p>
      </div>

      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__title">
            {ur ? "برانڈ ہاؤس" : "The brand house"}
          </p>
          <p style={{ maxWidth: "38ch" }}>
            {ur
              ? "زیڈ زی مولڈنگ اور زیڈ زی ڈیکور — پاکستان بھر میں فریمنگ اور آرکیٹیکچرل سطحوں کے لیے ایک قابلِ اعتماد ذریعہ۔"
              : "ZZMOLDING and ZZDECOR — one dependable source for professional framing and architectural surfaces across Pakistan."}
          </p>
          <Link
            href={`${base}/contact`}
            className="atelier-btn"
            style={{ marginTop: "1rem" }}
          >
            {ur ? "پراجیکٹ شروع کریں" : "Start a project"}
          </Link>
        </div>

        <div>
          <p className="site-footer__title">{ur ? "دریافت کریں" : "Explore"}</p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: ".55rem",
            }}
          >
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="site-footer__title">
            {ur ? "لاہور شوروم" : "Lahore showroom"}
          </p>
          <p style={{ lineHeight: 1.9 }}>
            <span className="ltr">
              Shop No. 2, Kashif Center, Mission Road, Lahore, Pakistan
            </span>
            <br />
            <a href="tel:+923334813016" className="ltr">
              +92 333 4813016
            </a>
            <br />
            <a href="mailto:contact@zzgroup.biz" className="ltr">
              contact@zzgroup.biz
            </a>
            <br />
            <a href="mailto:ceo@zzgroup.biz" className="ltr">
              ceo@zzgroup.biz
            </a>
          </p>
          <p style={{ color: "var(--atelier-brass-light)", fontSize: ".8rem" }}>
            {ur
              ? "پاکستان بھر میں ترسیل دستیاب"
              : "Pakistan-wide delivery available"}
          </p>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p style={{ margin: 0 }}>{t.footer.disclaimer}</p>
        <p style={{ margin: ".35rem 0 0" }}>
          © {year} ZZ GROUP. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
