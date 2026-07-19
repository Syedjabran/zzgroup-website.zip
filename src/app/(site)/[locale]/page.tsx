import Link from 'next/link';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === 'ur';
  const base = `/${loc}`;

  return (
    <>
      {/* HERO */}
      <section style={{ background: 'var(--bg-soft)' }}>
        <div className="container" style={{ paddingBlock: '3.5rem' }}>
          <p style={{ color: 'var(--sky)', fontWeight: 700, letterSpacing: '.05em' }}>
            {ur ? 'فریم مولڈنگز اور آرکیٹیکچرل ڈیکور' : 'FRAME MOULDINGS & ARCHITECTURAL DÉCOR'}
          </p>
          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', margin: '.5rem 0', color: 'var(--charcoal)' }}>
            {ur ? 'پاکستان میں پریمیم فریمنگ اور انٹیریئر ڈیکور حل' : 'Premium Framing and Interior Décor Solutions in Pakistan'}
          </h1>
          <p style={{ maxWidth: '60ch', color: 'var(--grey)' }}>
            {ur
              ? '۲۰۰ سے زائد فریم مولڈنگ ڈیزائنز کے ساتھ جدید وال پینلز، ڈبلیو پی سی کلیڈنگ اور آرکیٹیکچرل ٹرِمز دریافت کریں۔ زیڈزی گروپ پاکستان بھر میں مسابقتی قیمتوں اور قابلِ اعتماد ترسیل کے ساتھ خدمات فراہم کرتا ہے۔'
              : 'Discover more than 200 frame-moulding designs alongside contemporary wall panels, WPC cladding and architectural trims. ZZ Group supports retailers, framing professionals, architects and project buyers with competitive pricing, responsive service and reliable delivery across Pakistan.'}
          </p>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link href={`${base}/products`} className="btn-primary">{t.actions.explore}</Link>
            <Link href={`${base}/contact`} className="btn-secondary">{t.actions.requestBulkQuote}</Link>
            <a href={whatsappLink(generalMessage())} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp)', fontWeight: 700, alignSelf: 'center' }}>
              {t.actions.chatSales}
            </a>
          </div>
