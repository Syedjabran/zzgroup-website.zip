import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, type Locale } from '@/lib/i18n';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const other = locale === 'en' ? 'ur' : 'en';
  const base = `/${locale}`;
  const ur = locale === 'ur';

  const nav = [
    { href: `${base}`, label: t.nav.home },
    { href: `${base}/products`, label: ur ? 'کلیکشنز' : 'Collections' },
    { href: `${base}/products/zzmolding`, label: ur ? 'فریم مولڈنگز' : 'Frame Mouldings' },
    { href: `${base}/products/zzdecor`, label: ur ? 'وال پینلز' : 'Wall Panels' },
    { href: `${base}/gallery`, label: ur ? 'پراجیکٹس' : 'Projects' },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/contact`, label: t.nav.contact }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Utility bar — carbon black, ivory text, gold accents */}
      <div style={{ background: 'var(--zz-carbon-black)', color: 'var(--zz-text-muted-light)', fontSize: '.78rem', letterSpacing: '.04em' }}>
        <div className="container" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'space-between', paddingBlock: '.45rem' }}>
          <span>
            <span style={{ color: 'var(--zz-antique-gold)' }}>✆</span> +92 333 4813016
            <span style={{ margin: '0 .6rem', color: 'var(--zz-gunmetal)' }}>·</span>
            contact@zzgroup.biz
          </span>
          <span>{ur ? 'پاکستان بھر میں ترسیل دستیاب' : 'Pakistan-Wide Delivery Available'}</span>
        </div>
      </div>

      {/* Main navigation — obsidian, logo, restrained gold */}
      <div style={{ background: 'var(--zz-obsidian)', borderBottom: '1px solid var(--zz-graphite)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: '.7rem', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href={base} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', textDecoration: 'none' }}>
            <Image src="/logo.jpg" alt="ZZ GROUP" width={52} height={52}
              style={{ borderRadius: 2, display: 'block' }} priority />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600,
              letterSpacing: '.14em', color: 'var(--zz-mineral-ivory)'
            }}>
              ZZ&nbsp;GROUP
            </span>
          </Link>

          <nav style={{ display: 'flex', gap: '1.15rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} style={{
                color: 'var(--zz-mineral-ivory)', textDecoration: 'none',
                fontWeight: 600, fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase'
              }}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
            <Link href={`/${other}`} style={{ fontWeight: 700, color: 'var(--zz-antique-gold)', textDecoration: 'none', fontSize: '.85rem' }}>
              {other === 'ur' ? 'اردو' : 'EN'}
            </Link>
            <a href={whatsappLink(generalMessage())} target="_blank" rel="noopener noreferrer"
              className="btn-secondary"
              style={{ borderColor: 'var(--zz-gunmetal)', color: 'var(--zz-mineral-ivory)', padding: '.55rem 1rem' }}>
              WhatsApp
            </a>
            <Link href={`${base}/contact`} className="btn-gold" style={{ padding: '.6rem 1.1rem' }}>
              {ur ? 'قیمت طلب کریں' : 'Request Quotation'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
