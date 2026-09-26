import Link from "next/link";
import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import WhatsAppButton from "@/components/WhatsAppButton";
import { DIVISIONS, divisionPath } from "@/lib/catalogue/divisions";

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const other = locale === "en" ? "ur" : "en";
  const base = `/${locale}`;
  const ur = locale === "ur";

  const nav = [
    { href: base, label: t.nav.home },
    { href: `${base}/gallery`, label: ur ? "پراجیکٹس" : "Projects" },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/contact`, label: t.nav.contact },
  ];

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <span>
            <span className="ltr">+92 333 4813016</span>
            <span aria-hidden style={{ marginInline: ".65rem", opacity: 0.45 }}>
              —
            </span>
            <span className="ltr">contact@zzgroup.biz</span>
          </span>
          <span>
            {ur
              ? "پاکستان بھر میں ترسیل · ریٹیل اور ہول سیل"
              : "Pakistan-wide delivery · Retail & wholesale"}
          </span>
        </div>
      </div>

      <div className="site-nav">
        <div className="container site-nav__inner">
          <Link href={base} className="site-brand">
            <Image
              src="/logo.png"
              alt="ZZ GROUP"
              width={48}
              height={48}
              className="site-brand__mark"
              priority
            />
            <span className="site-brand__name">ZZ GROUP</span>
          </Link>

          <nav
            className="site-nav__links"
            aria-label={ur ? "مرکزی نیویگیشن" : "Primary navigation"}
          >
            <Link href={base} className="site-nav__link">
              {t.nav.home}
            </Link>

            <div className="nav-dropdown">
              <Link
                href={`${base}/products`}
                className="site-nav__link nav-dropdown__trigger"
                aria-haspopup="true"
              >
                {t.nav.products ?? (ur ? "پروڈکٹس" : "Products")}
                <span className="nav-dropdown__caret" aria-hidden>
                  ▾
                </span>
              </Link>
              <div className="nav-dropdown__panel" role="menu">
                {DIVISIONS.map((d) => (
                  <Link
                    key={d.slug}
                    href={divisionPath(locale, d.slug)}
                    className="nav-dropdown__item"
                    role="menuitem"
                  >
                    <strong>{d.name[locale]}</strong>
                    <span>{d.tagline[locale]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-nav__actions">
            <Link href={`/${other}`} className="locale-link">
              {other === "ur" ? "اردو" : "EN"}
            </Link>
            <WhatsAppButton variant="compact" label="WhatsApp" />
            <Link href={`${base}/contact`} className="nav-quote">
              {ur ? "قیمت طلب کریں" : "Get a quote"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
