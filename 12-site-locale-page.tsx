import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';
import { notFound } from 'next/navigation';

/**
 * Representative homepage hero. This proves the i18n + RTL + WhatsApp wiring
 * end to end. The remaining homepage sections (Trust highlights, brand cards,
 * Who We Serve, 3-step enquiry, closing CTA) follow the same pattern and are
 * listed as pending in the status report.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  const heroCopy =
    locale === 'ur'
      ? '۲۰۰ سے زائد فریم مولڈنگ ڈیزائنز کے ساتھ جدید وال پینلز، ڈبلیو پی سی کلیڈنگ اور آرکیٹیکچرل ٹرِمز دریافت کریں۔'
      : 'Discover more than 200 frame-moulding designs alongside contemporary wall panels, WPC cladding and architectural trims. ZZ Group supports retailers, framing professionals, architects and project buyers with competitive pricing, responsive service and reliable delivery across Pakistan.';

  const h1 =
    locale === 'ur'
      ? 'پاکستان میں پریمیم فریمنگ اور انٹیریئر ڈیکور حل'
      : 'Premium Framing and Interior Décor Solutions in Pakistan';

  return (
    <section className="container" style={{ paddingBlock: '3rem' }}>
      <p style={{ color: 'var(--sky)', fontWeight: 600, letterSpacing: '.05em' }}>
        {locale === 'ur'
          ? 'فریم مولڈنگز اور آرکیٹیکچرل ڈیکور'
          : 'FRAME MOULDINGS & ARCHITECTURAL DÉCOR'}
      </p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', margin: '.5rem 0', color: 'var(--charcoal)' }}>
        {h1}
      </h1>
      <p style={{ maxWidth: '54ch', color: 'var(--grey)' }}>{heroCopy}</p>

      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <a href={`/${locale}/products`} className="btn-primary">
          {t.actions.explore}
        </a>
        <a href={`/${locale}/contact`} className="btn-secondary">
          {t.actions.requestBulkQuote}
        </a>
        <a
          href={whatsappLink(generalMessage())}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--whatsapp)', fontWeight: 600, alignSelf: 'center' }}
        >
          {t.actions.chatSales}
        </a>
      </div>
    </section>
  );
}
