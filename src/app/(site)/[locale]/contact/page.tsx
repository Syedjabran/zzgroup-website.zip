import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Contact Us' };

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
        <p style={{ color: 'var(--grey)' }}>
          Shop No. 2, Kashif Center, Mission Road, Lahore, Pakistan<br /><br />
          {ur ? 'فون / واٹس ایپ' : 'Phone / WhatsApp'}: +92 333 4813016<br />
          {ur ? 'ای میل' : 'Email'}: contact@zzgroup.biz
        </p>
        <a href="https://share.google/SmXyo6uKvLxnf4j8J" target="_blank" rel="noopener noreferrer" className="btn-secondary">
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
