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

import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Contact Us' };

const ADDRESS = 'Shop No. 2, Kashif Center, Mission Road, Lahore, Pakistan';
const PHONE_DISPLAY = '+92 333 4813016';
const PHONE_DIAL = '+923334813016';
const EMAIL = 'contact@zzgroup.biz';

export default async function Contact({
  params, searchParams
}: { params: Promise<{ locale: string }>; searchParams: Promise<{ sku?: string }> }) {
  const { locale } = await params;
  const { sku } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === 'ur';

  return (
    <div className="container" style={{ paddingBlock: '2.5rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <div>
        <h1 style={{ color: 'var(--deep-blue)' }}>{ur ? 'رابطہ کریں' : 'Contact Us'}</h1>

        <p style={{ color: 'var(--grey)', lineHeight: 2 }}>
          <span className="ltr">{ADDRESS}</span>
        </p>

        <dl style={{ color: 'var(--grey)', lineHeight: 2, margin: 0, display: 'grid', gap: '.35rem' }}>
          <div>
            <dt style={term}>{ur ? 'فون / واٹس ایپ' : 'Phone / WhatsApp'}:</dt>{' '}
            <dd style={def}>
              <a href={`tel:${PHONE_DIAL}`} className="ltr" style={link} dir="ltr">
                {PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div>
            <dt style={term}>{ur ? 'ای میل' : 'Email'}:</dt>{' '}
            <dd style={def}>
              <a href={`mailto:${EMAIL}`} className="ltr" style={link} dir="ltr">
                {EMAIL}
              </a>
            </dd>
          </div>
        </dl>

        <a href="https://share.google/SmXyo6uKvLxnf4j8J" target="_blank" rel="noopener noreferrer"
           className="btn-secondary" style={{ marginBlockStart: '1.25rem', display: 'inline-block' }}>
          {ur ? 'نقشے پر دیکھیں' : 'View on Map'}
        </a>
      </div>

      <div>
        <h2 style={{ color: 'var(--deep-blue)', marginTop: 0 }}>{t.actions.requestQuote}</h2>
        <ContactForm locale={loc} dict={t} sku={sku} />
      </div>
    </div>
  );
}

const term: React.CSSProperties = { display: 'inline', fontWeight: 600 };
const def: React.CSSProperties = { display: 'inline', margin: 0 };
const link: React.CSSProperties = { color: 'inherit', textDecoration: 'none', borderBottom: '1px solid currentColor' };
