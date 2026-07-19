import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const year = new Date().getFullYear();

  const links = [
    { href: `${base}`, label: t.nav.home },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/products`, label: t.nav.products },
    { href: `${base}/gallery`, label: t.nav.gallery },
    { href: `${base}/contact`, label: t.nav.contact },
    { href: `${base}/faqs`, label: t.nav.faqs }
  ];

  const categories = [
    'Photo-Frame Mouldings', 'Framing Accessories', 'Fluted Wall Panels',
    'WPC Wall Cladding', 'Decorative Surface Panels', 'Skirting, Cornices and Trims'
  ];

  return (
    <footer style={{ background: 'var(--charcoal)', color: '#cfe0ea', marginTop: '3rem' }}>
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', paddingBlock: '2.5rem' }}>
        <div>
          <strong style={{ color: '#fff', fontSize: '1.1rem' }}>ZZ Group</strong>
          <p style={{ fontSize: '.9rem', marginTop: '.5rem' }}>{t.footer.about}</p>
        </div>
        <div>
          <strong style={{ color: '#fff' }}>Links</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '.5rem', display: 'grid', gap: '.3rem' }}>
            {links.map((l) => <li key={l.href}><Link href={l.href} style={{ color: '#cfe0ea', textDecoration: 'none' }}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <strong style={{ color: '#fff' }}>Categories</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '.5rem', display: 'grid', gap: '.3rem', fontSize: '.9rem' }}>
            {categories.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <strong style={{ color: '#fff' }}>Contact</strong>
          <p style={{ fontSize: '.9rem', marginTop: '.5rem' }}>
            Shop No. 2, Kashif Center, Mission Road, Lahore, Pakistan<br />
            +92 333 4813016<br />
            zzshopmoulding@gmail.com
          </p>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid #2b3946', paddingBlock: '1.25rem', fontSize: '.8rem' }}>
        <p>{t.footer.disclaimer}</p>
        <p style={{ marginTop: '.5rem' }}>© {year} ZZ Group. {t.footer.rights}</p>
      </div>
    </footer>
  );
}