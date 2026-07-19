import { isLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const metadata = { title: 'FAQs' };

const faqs = [
  ['Do you deliver across Pakistan?', 'Yes, we coordinate delivery to cities throughout Pakistan. Share your city when you enquire and we will confirm details.'],
  ['How do I get pricing?', 'Send us the product SKU, quantity and delivery city via the contact form or WhatsApp, and our team will share pricing and availability.'],
  ['Do you sell wholesale?', 'Yes. We serve retailers, wholesale buyers, framing professionals, architects, designers and project buyers.'],
  ['Can I confirm stock before ordering?', 'Please contact us to confirm specifications, availability, pricing and delivery before placing an order.']
];

export default async function Faqs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ur = (locale as Locale) === 'ur';
  return (
    <div className="container" style={{ paddingBlock: '2.5rem', maxWidth: 800 }}>
      <h1 style={{ color: 'var(--deep-blue)' }}>{ur ? 'عمومی سوالات' : 'Frequently Asked Questions'}</h1>
      {faqs.map(([q, a]) => (
        <div key={q} style={{ borderBottom: '1px solid var(--border)', paddingBlock: '1rem' }}>
          <h3 style={{ color: 'var(--charcoal)', margin: 0 }}>{q}</h3>
          <p style={{ color: 'var(--grey)', marginBottom: 0 }}>{a}</p>
        </div>
      ))}
    </div>
  );
}
