import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const other = locale === 'en' ? 'ur' : 'en';
  const base = `/${locale}`;

  const nav = [
    { href: `${base}`, label: t.nav.home },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/products`, label: t.nav.products },
    { href: `${base}/gallery`, label: t.nav.gallery },
    { href: `${base}/faqs`, label: t.nav.faqs },
    { href: `${base}/contact`, label: t.nav.contact }
  ];

  return (
    <header style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: '#fff', zIndex: 50 }}>
      {/* Top bar */}
      <div style={{ background: 'var(--deep-blue)', color: '#fff', fontSize: '.8rem' }}>
        <div className="container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', paddingBlock: '.4rem' }}>
          <span>+92 333 4813016 · zzshopmoulding@gmail.com</span>
          <span>{t.topbar.delivery}</span>
        </div>
      </div>
      {/* Main nav */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: '.75rem', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href={base} style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--deep-blue)', textDecoration: 'none' }}>
          ZZ&nbsp;Group
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} style={{ color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 600, fontSize: '.95rem' }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <Link href={`/${other}`} style={{ fontWeight: 700, color: 'var(--sky)', textDecoration: 'none' }}>
            {other === 'ur' ? 'اردو' : 'EN'}
          </Link>
          <a href={whatsappLink(generalMessage())} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ borderColor: 'var(--whatsapp)', color: 'var(--whatsapp)' }}>
            {t.actions.whatsappUs}
          </a>
          <Link href={`${base}/contact`} className="btn-primary">{t.actions.requestQuote}</Link>
        </div>
      </div>
    </header>
  );
}
