import Link from 'next/link';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import WhatsAppButton from '@/components/WhatsAppButton';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === 'ur';
  const base = `/${loc}`;

  const collections = [
    ['Frame Mouldings', ur ? 'فریم مولڈنگز' : 'Frame Mouldings', `${base}/products/zzmolding`],
    ['Wall Panels', ur ? 'وال پینلز' : 'Wall Panels', `${base}/products/zzdecor`],
    ['WPC Cladding', ur ? 'ڈبلیو پی سی کلیڈنگ' : 'WPC Cladding', `${base}/products?q=WPC`],
    ['Marble & Onyx Panels', ur ? 'ماربل اور اونکس پینلز' : 'Marble & Onyx Panels', `${base}/products?q=marble`],
    ['Decorative Surfaces', ur ? 'آرائشی سطحیں' : 'Decorative Surfaces', `${base}/products/zzdecor`],
    ['Skirting, Cornices & Trims', ur ? 'اسکرٹنگ، کارنس اور ٹرِمز' : 'Skirting, Cornices & Trims', `${base}/products?q=skirting`]
  ];

  return (
    <>
      {/* ============ HERO — architectural dark, logo-derived ============ */}
      <section className="surface-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Precision drafting lines */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(90deg, var(--zz-antique-gold) 0 1px, transparent 1px 120px), repeating-linear-gradient(0deg, var(--zz-gunmetal) 0 1px, transparent 1px 120px)'
        }} />
        <div className="container" style={{ paddingBlock: 'clamp(4rem, 9vw, 7rem)', position: 'relative' }}>
          <p className="eyebrow">
            {ur ? 'آرکیٹیکچرل مولڈنگز · وال پینلز · آرائشی سطحیں' : 'ARCHITECTURAL MOULDINGS · WALL PANELS · DECORATIVE SURFACES'}
          </p>
          <h1 style={{ fontSize: ur ? 'clamp(2rem, 5vw, 3.6rem)' : 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: ur ? 1.8 : 1.08, margin: '.6rem 0 0', maxWidth: ur ? '24ch' : '16ch' }}>
            {ur ? 'دیواروں کو شکل دیں۔ جگہوں کو فریم کریں۔ انٹیریئر متعین کریں۔' : 'Shape Walls. Frame Spaces. Define Interiors.'}
          </h1>
          <hr className="gold-rule" />
          <p style={{ maxWidth: '58ch', color: 'var(--zz-text-muted-light)', fontSize: ur ? '1.2rem' : '1.05rem', lineHeight: ur ? 2 : undefined }}>
            {ur
              ? 'رہائشی، کمرشل اور ہاسپیٹیلیٹی انٹیریئرز کے لیے پریمیم فریم مولڈنگز، فلوٹڈ پینلز، ڈبلیو پی سی کلیڈنگ، آرائشی سطحیں اور آرکیٹیکچرل ٹرِمز دریافت کریں۔'
              : 'Discover premium frame mouldings, fluted panels, WPC cladding, decorative surfaces and architectural trims for residential, commercial and hospitality interiors.'}
          </p>
          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href={`${base}/products`} className="btn-gold">{ur ? 'کلیکشنز دیکھیں' : 'Explore Collections'}</Link>
            <Link href={`${base}/contact`} className="btn-secondary" style={{ color: 'var(--zz-mineral-ivory)', borderColor: 'var(--zz-gunmetal)' }}>
              {ur ? 'ٹریڈ کوٹیشن' : 'Request Trade Quotation'}
            </Link>
            <WhatsAppButton label={ur ? 'واٹس ایپ پر بات کریں' : 'Chat on WhatsApp'} />
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP — verified facts only ============ */}
      <section style={{ background: 'var(--zz-mineral-ivory)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingBlock: '1.4rem', textAlign: 'center' }}>
          {[
            ur ? '۲۰۰ سے زائد ڈیزائنز' : '200+ Designs',
            ur ? 'پاکستان بھر میں ترسیل' : 'Pakistan-Wide Delivery',
            ur ? 'ریٹیل اور ہول سیل سپلائی' : 'Retail & Wholesale Supply',
            ur ? 'ٹریڈ اور پراجیکٹ سپورٹ' : 'Trade & Project Support'
          ].map((s) => (
            <div key={s} style={{ fontWeight: 700, fontSize: ur ? '1.05rem' : '.9rem', letterSpacing: ur ? 0 : '.06em', textTransform: ur ? 'none' : 'uppercase', color: 'var(--zz-graphite)' }}>
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* ============ SHOP BY COLLECTION — editorial tiles ============ */}
      <section className="container" style={{ paddingBlock: '4rem' }}>
        <p className="eyebrow">{ur ? 'کلیکشن کے مطابق' : 'Shop by Collection'}</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '.4rem 0 2rem' }}>
          {ur ? 'ہر سطح کے لیے ایک کلیکشن' : 'A Collection for Every Surface'}
        </h2>
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {collections.map(([, label, href], i) => (
            <Link key={label} href={href} style={{
              textDecoration: 'none',
              background: i % 2 === 0 ? 'var(--zz-obsidian)' : 'var(--zz-graphite)',
              color: 'var(--zz-mineral-ivory)',
              padding: '2.4rem 1.6rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--zz-charcoal)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 170,
              transition: 'border-color .25s ease'
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>{label}</span>
              <span style={{ color: 'var(--zz-antique-gold)', fontSize: ur ? '.95rem' : '.8rem', letterSpacing: ur ? 0 : '.12em', textTransform: ur ? 'none' : 'uppercase', marginTop: '.5rem' }}>
                {ur ? 'دیکھیں ←' : 'Explore →'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ DIVISIONS ============ */}
      <section style={{ background: 'var(--zz-mineral-ivory)' }}>
        <div className="container" style={{ paddingBlock: '4rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div style={{ background: 'var(--zz-gallery-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.2rem' }}>
            <p className="eyebrow" style={{ marginTop: 0 }}>ZZMOLDING</p>
            <h3 style={{ fontSize: '1.7rem', margin: '.3rem 0' }}>
              {ur ? 'پیشہ ورانہ فریمنگ کے لیے مولڈنگز' : 'Mouldings for Professional Framing'}
            </h3>
            <p style={{ color: 'var(--grey)' }}>
              {ur
                ? 'فریم پروفائلز، فنشز، فریمنگ لوازمات اور ریٹیل و ہول سیل سپلائی — کیٹلاگ اور ٹریڈ کوٹیشن کے ساتھ۔'
                : 'Frame profiles, finish options, framing accessories and professional applications — with retail and wholesale supply, catalogue access and trade quotations.'}
            </p>
            <Link href={`${base}/products/zzmolding`} className="btn-primary">{ur ? 'زیڈزی مولڈنگ دیکھیں' : 'Explore ZZMOLDING'}</Link>
          </div>
          <div style={{ background: 'var(--zz-gallery-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.2rem' }}>
            <p className="eyebrow" style={{ marginTop: 0 }}>ZZDECOR</p>
            <h3 style={{ fontSize: '1.7rem', margin: '.3rem 0' }}>
              {ur ? 'جدید انٹیریئرز کے لیے سطحیں' : 'Surfaces for Modern Interiors'}
            </h3>
            <p style={{ color: 'var(--grey)' }}>
              {ur
                ? 'فلوٹڈ وال پینلز، ڈبلیو پی سی کلیڈنگ، آرائشی سطحیں، ماربل و اونکس پینلز، اسکرٹنگ، کارنس اور آرکیٹیکچرل ٹرِمز۔'
                : 'Fluted wall panels, WPC cladding, decorative surfaces, marble and onyx panels, skirting, cornices and architectural trims — with sample requests and project quotations.'}
            </p>
            <Link href={`${base}/products/zzdecor`} className="btn-primary">{ur ? 'زیڈزی ڈیکور دیکھیں' : 'Explore ZZDECOR'}</Link>
          </div>
        </div>
      </section>

      {/* ============ PROFESSIONAL SUPPORT ============ */}
      <section className="container" style={{ paddingBlock: '4rem' }}>
        <p className="eyebrow">{ur ? 'پیشہ ورانہ معاونت' : 'Professional Support'}</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: '.4rem 0 2rem' }}>
          {ur ? 'ہر پیشہ ور کے لیے ایک راستہ' : 'A Pathway for Every Professional'}
        </h2>
        <div style={{ display: 'grid', gap: '1.1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {[
            [ur ? 'آرکیٹیکٹس اور ڈیزائنرز' : 'Architects & Interior Designers', ur ? 'اسپیسیفیکیشن سپورٹ اور نمونہ جات' : 'Specification support, finishes and samples for project work.'],
            [ur ? 'فریمرز اور ریٹیلرز' : 'Framers & Retailers', ur ? 'پروفائل رینج اور ریٹیل سپلائی' : 'Profile ranges, accessories and dependable retail supply.'],
            [ur ? 'کنٹریکٹرز اور ڈیویلپرز' : 'Contractors & Developers', ur ? 'پراجیکٹ مقدار اور ترسیل' : 'Project quantities, site coordination and delivery.'],
            [ur ? 'ہول سیلرز اور ڈیلرز' : 'Wholesalers & Dealers', ur ? 'ہول سیل قیمتیں اور ڈیلر معاونت' : 'Wholesale pricing structures and dealer support.']
          ].map(([h, b]) => (
            <div key={h} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#fff' }}>
              <h3 style={{ fontSize: '1.15rem', marginTop: 0 }}>{h}</h3>
              <p style={{ color: 'var(--grey)', fontSize: '.92rem', marginBottom: 0 }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FINAL CONVERSION ============ */}
      <section className="surface-dark">
        <div className="container" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
          <p className="eyebrow">{ur ? 'آغاز کریں' : 'Begin Your Project'}</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', margin: '.5rem auto 1rem', maxWidth: '22ch' }}>
            {ur ? 'اپنے انٹیریئر کو زیڈزی گروپ کے ساتھ متعین کریں' : 'Define Your Interior with ZZ GROUP'}
          </h2>
          <p style={{ color: 'var(--zz-text-muted-light)', maxWidth: '56ch', margin: '0 auto 2rem' }}>
            {ur
              ? 'پراجیکٹ کوٹیشن، ہول سیل قیمتوں یا مصنوعات کی رہنمائی کے لیے ہم سے رابطہ کریں — پاکستان بھر میں۔'
              : 'Request a project quotation, wholesale pricing or product guidance — anywhere in Pakistan.'}
          </p>
          <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="btn-gold">{ur ? 'پراجیکٹ کوٹیشن' : 'Request Project Quotation'}</Link>
            <Link href={`${base}/contact`} className="btn-secondary" style={{ color: 'var(--zz-mineral-ivory)', borderColor: 'var(--zz-gunmetal)' }}>
              {ur ? 'ہول سیل قیمت' : 'Request Wholesale Price'}
            </Link>
            <WhatsAppButton label={ur ? 'واٹس ایپ' : 'Chat on WhatsApp'} />
          </div>
        </div>
      </section>
    </>
  );
}
