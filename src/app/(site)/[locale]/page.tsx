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
        </div>
      </section>

      <section className="container" style={{ paddingBlock: '3rem' }}>
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            [ur ? '۲۰۰ سے زائد ڈیزائنز' : 'More Than 200 Designs', ur ? 'پروفائلز، فنشز، رنگوں اور آرائشی سطحوں کا وسیع انتخاب۔' : 'An extensive, growing selection of profiles, finishes, colours and decorative surfaces.'],
            [ur ? 'پاکستان بھر میں ترسیل' : 'Delivery Across Pakistan', ur ? 'پاکستان کے شہروں میں گاہکوں کے لیے آرڈر اور ترسیل کی معاونت۔' : 'Order coordination and delivery support for customers in cities throughout Pakistan.'],
            [ur ? 'معیار پر مرکوز' : 'Product-Focused Quality', ur ? 'مضبوط بصری پیشکش اور قابلِ اعتماد کارکردگی کے لیے منتخب مصنوعات۔' : 'Carefully selected products for strong visual presentation and dependable performance.'],
            [ur ? 'ذمہ دار سپورٹ' : 'Responsive Support', ur ? 'مصنوعات کے انتخاب، تفصیلات، قیمتوں اور ترسیل میں براہِ راست معاونت۔' : 'Direct assistance for product selection, specifications, quotations and delivery.']
          ].map(([h, b]) => (
            <div key={h} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <h3 style={{ color: 'var(--deep-blue)', marginTop: 0 }}>{h}</h3>
              <p style={{ color: 'var(--grey)', margin: 0 }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '3rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          ['ZZMOLDING', ur ? 'پیشہ ورانہ انتخاب کے لیے فریم مولڈنگز' : 'Frame Mouldings Designed for Professional Choice', ur ? 'سنتھیٹک/پی ایس اور لکڑی کی فریم مولڈنگز — مختلف پروفائلز، فنشز اور رنگوں میں۔' : 'Synthetic/PS and wooden frame mouldings (frame gola) in varied profiles, finishes and colours, plus framing accessories.', `${base}/products/zzmolding`],
          ['ZZDECOR', ur ? 'جدید انٹیریئرز کے لیے عصری سطحیں' : 'Contemporary Surfaces for Modern Interiors', ur ? 'فلوٹڈ وال پینلز، ڈبلیو پی سی کلیڈنگ، آرائشی پینلز، اسکرٹنگ اور ٹرِمز۔' : 'Fluted wall panels, WPC cladding, decorative surface panels, skirting and architectural trims for modern interiors.', `${base}/products/zzdecor`]
        ].map(([name, head, body, href]) => (
          <div key={name} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.75rem', background: 'var(--bg-soft)' }}>
            <p style={{ color: 'var(--sky)', fontWeight: 800, letterSpacing: '.05em', margin: 0 }}>{name}</p>
            <h3 style={{ color: 'var(--charcoal)', marginTop: '.5rem' }}>{head}</h3>
            <p style={{ color: 'var(--grey)' }}>{body}</p>
            <Link href={href} className="btn-primary">{name === 'ZZMOLDING' ? (ur ? 'زیڈزی مولڈنگ دیکھیں' : 'Explore ZZMOLDING') : (ur ? 'زیڈزی ڈیکور دیکھیں' : 'Explore ZZDECOR')}</Link>
          </div>
        ))}
      </section>

      <section style={{ background: 'var(--deep-blue)', color: '#fff' }}>
        <div className="container" style={{ paddingBlock: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0 }}>{ur ? 'اپنے اگلے پراجیکٹ کو بہتر بنائیں؟' : 'Ready to Elevate Your Next Project?'}</h2>
          <p style={{ color: '#cfe0ea', maxWidth: '60ch', margin: '0 auto 1.5rem' }}>
            {ur ? 'فریم مولڈنگز، وال پینلز، آرکیٹیکچرل ڈیکور اور بلک ضروریات کے لیے زیڈزی گروپ سے رابطہ کریں۔' : 'Speak with ZZ Group for frame mouldings, wall panels, architectural décor and bulk requirements anywhere in Pakistan.'}
          </p>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="btn-primary">{t.actions.requestQuote}</Link>
            <a href={whatsappLink(generalMessage())} target="_blank" rel="noopener noreferrer" className="btn-secondary">{t.actions.whatsappUs}</a>
          </div>
        </div>
      </section>
    </>
  );
}