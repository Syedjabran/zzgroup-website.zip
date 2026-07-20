import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, type Locale } from '@/lib/i18n';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const ur = locale === 'ur';
  const year = new Date().getFullYear();

  const links = [
    { href: `${base}`, label: t.nav.home },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/products`, label: ur ? 'کلیکشنز' : 'Collections' },
    { href: `${base}/gallery`, label: ur ? 'پراجیکٹس' : 'Projects' },
    { href: `${base}/contact`, label: t.nav.contact },
    { href: `${base}/faqs`, label: t.nav.faqs }
  ];

  const collections = ur
    ? ['فریم مولڈنگز', 'وال پینلز', 'ڈبلیو پی سی کلیڈنگ', 'ماربل اور اونکس پینلز', 'آرائشی سطحیں', 'اسکرٹنگ، کارنس اور ٹرِمز', 'فریمنگ لوازمات']
    : ['Frame Mouldings', 'Wall Panels', 'WPC Cladding', 'Marble & Onyx Panels', 'Decorative Surfaces', 'Skirting, Cornices & Trims', 'Framing Accessories'];

  return (
    <footer style={{ background: 'var(--zz-carbon-black)', color: 'var(--zz-text-muted-light)', marginTop: '4rem' }}>
      <div className="container" style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', paddingBlock: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1rem' }}>
            <Image src="/logo.png" alt="ZZ GROUP" width={46} height={46} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '.14em', color: 'var(--zz-mineral-ivory)' }}>
              ZZ GROUP
            </span>
          </div>
          <p style={{ fontSize: '.88rem', lineHeight: 1.7 }}>
            {ur
              ? 'پاکستان کا پریمیم آرکیٹیکچرل مولڈنگز، وال پینلز اور آرائشی سطحوں کا برانڈ۔'
              : "Pakistan's premium architectural mouldings, wall panels and decorative surfaces brand."}
          </p>
        </div>

        <div>
          <p className="eyebrow" style={{ marginTop: 0 }}>{ur ? 'روابط' : 'Navigate'}</p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '.4rem' }}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={{ color: 'var(--zz-text-muted-light)', textDecoration: 'none', fontSize: '.9rem' }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow" style={{ marginTop: 0 }}>{ur ? 'کلیکشنز' : 'Collections'}</p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '.4rem', fontSize: '.9rem' }}>
            {collections.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>

        <div>
          <p className="eyebrow" style={{ marginTop: 0 }}>{ur ? 'رابطہ' : 'Contact'}</p>
          <p style={{ fontSize: '.9rem', lineHeight: 1.9 }}>
            <span className="ltr">Shop No. 2, Kashif Center, Mission Road, Lahore, Pakistan</span><br />
            {ur ? 'فون / واٹس ایپ' : 'Phone / WhatsApp'}: <span className="ltr">+92 333 4813016</span><br />
            {ur ? 'عمومی' : 'General'}: <span className="ltr">contact@zzgroup.biz</span><br />
            {ur ? 'اسٹریٹجک' : 'Strategic'}: <span className="ltr">ceo@zzgroup.biz</span>
          </p>
          <p style={{ fontSize: '.85rem', color: 'var(--zz-antique-gold)' }}>
            {ur ? 'پاکستان بھر میں ترسیل دستیاب' : 'Pakistan-Wide Delivery Available'}
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--zz-graphite)' }}>
        <div className="container" style={{ paddingBlock: '1.25rem', fontSize: '.78rem' }}>
          <p style={{ margin: 0 }}>{t.footer.disclaimer}</p>
          <p style={{ margin: '.5rem 0 0' }}>© {year} ZZ GROUP. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
