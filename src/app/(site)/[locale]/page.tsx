import Link from 'next/link';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroVideo from '@/components/HeroVideo';
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

  const stats = [
    ur ? '۲۰۰ سے زائد ڈیزائنز' : '200+ Designs',
    ur ? 'پاکستان بھر میں ترسیل' : 'Pakistan-Wide Delivery',
    ur ? 'ریٹیل اور ہول سیل سپلائی' : 'Retail & Wholesale Supply',
    ur ? 'ٹریڈ اور پراجیکٹ سپورٹ' : 'Trade & Project Support'
  ];

  return (
    <>
      {/* ============ HERO — cinematic framed gallery ============ */}
      <section className="surface-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroVideo />
        {/* Precision drafting lines */}
        <div aria-hidden data-no-reveal style={{
          position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(90deg, var(--zz-antique-gold) 0 1px, transparent 1px 140px), repeating-linear-gradient(0deg, var(--zz-gunmetal) 0 1px, transparent 1px 140px)'
        }} />
        {/* Gilt corner brackets — the framing motif */}
        <div aria-hidden data-no-reveal className="corner-frame" />

        <div className="container" style={{
          position: 'relative', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 'min(88vh, 860px)', paddingBlock: 'clamp(5rem, 10vw, 8rem) clamp(2.5rem, 5vw, 4rem)'
        }}>
          <p className="kicker">
            {ur ? 'آرکیٹیکچرل مولڈنگز · وال پینلز · آرائشی سطحیں' : 'Architectural Mouldings · Wall Panels · Decorative Surfaces'}
          </p>

          <h1 className="display-hero" style={{
            fontSize: ur ? 'clamp(2.2rem, 5.6vw, 4.2rem)' : 'clamp(2.8rem, 7vw, 5.6rem)',
            lineHeight: ur ? 2.05 : 1.06,
            margin: ur ? '1.2rem 0 0' : '1rem 0 0',
            maxWidth: ur ? '26ch' : '18ch'
          }}>
            {ur
              ? 'دیواروں کو شکل دیں۔ جگہوں کو فریم کریں۔ انٹیریئر متعین کریں۔'
              : <>Shape Walls. Frame Spaces. <em>Define Interiors.</em></>}
          </h1>

          <p style={{
            maxWidth: '62ch', color: '#cfc6b4',
            fontSize: ur ? '1.2rem' : '1.08rem', lineHeight: ur ? 2 : 1.75,
            marginTop: '1.4rem'
          }}>
            {ur
              ? 'رہائشی، کمرشل اور ہاسپیٹیلیٹی انٹیریئرز کے لیے پریمیم فریم مولڈنگز، فلوٹڈ پینلز، ڈبلیو پی سی کلیڈنگ، آرائشی سطحیں اور آرکیٹیکچرل ٹرِمز دریافت کریں۔'
              : 'Premium frame mouldings, fluted panels, WPC cladding, decorative surfaces and architectural trims — for residential, commercial and hospitality interiors.'}
          </p>

          <div style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2.4rem' }}>
            <Link href={`${base}/products`} className="btn-gold">{ur ? 'کلیکشنز دیکھیں' : 'Explore Collections'}</Link>
            <Link href={`${base}/contact`} className="btn-secondary" style={{ color: '#f0ead9', borderColor: 'rgba(224,205,159,.45)' }}>
              {ur ? 'ٹریڈ کوٹیشن' : 'Request Trade Quotation'}
            </Link>
            <WhatsAppButton label={ur ? 'واٹس ایپ پر بات کریں' : 'Chat on WhatsApp'} />
          </div>

          <div aria-hidden data-no-reveal className="scroll-cue" style={{ marginTop: 'clamp(2rem, 5vw, 3.5rem)' }} />
        </div>

        {/* Stats — engraved into the hero base */}
        <div style={{ position: 'relative', borderTop: '1px solid rgba(224, 205, 159, 0.22)', background: 'rgba(14, 12, 9, 0.35)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', paddingBlock: '1.15rem', textAlign: 'center' }}>
            {stats.map((s) => (
              <div key={s} style={{ fontWeight: 700, fontSize: ur ? '1.02rem' : '.82rem', letterSpacing: ur ? 0 : '.14em', textTransform: ur ? 'none' : 'uppercase', color: 'var(--zz-champagne)' }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 01 · COLLECTIONS — catalogue plates ============ */}
      <section className="container" style={{ paddingBlock: 'clamp(4rem, 8vw, 6.5rem)' }}>
        <p className="section-no">{ur ? '۰۱ / کلیکشنز' : '01 / Collections'}</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4.6vw, 3.2rem)', margin: '.9rem 0 .6rem', maxWidth: '24ch' }}>
          {ur ? 'ہر سطح کے لیے ایک کلیکشن' : 'A Collection for Every Surface'}
        </h2>
        <p style={{ color: 'var(--grey)', maxWidth: '58ch', marginBottom: '2.4rem' }}>
          {ur
            ? 'ہر کلیکشن کیٹلاگ، فنش آپشنز اور ٹریڈ کوٹیشن کے ساتھ — منتخب کریں اور واٹس ایپ پر فوری رابطہ کریں۔'
            : 'Each collection carries catalogue access, finish options and trade quotations — select a plate to begin.'}
        </p>
        <div style={{ display: 'grid', gap: '1.4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {collections.map(([, label, href], i) => (
            <Link key={label} href={href} className="frame-card" style={{
              textDecoration: 'none',
              padding: '1.9rem 1.9rem 2.1rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 216, gap: '1.4rem'
            }}>
              <span className="frame-index">{String(i + 1).padStart(2, '0')}</span>
              <span style={{ display: 'block' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.55rem', fontWeight: 600, color: 'var(--zz-slate)', lineHeight: ur ? 1.9 : 1.15 }}>{label}</span>
                <span style={{ display: 'inline-block', color: 'var(--zz-aged-bronze)', fontWeight: 700, fontSize: ur ? '.95rem' : '.8rem', letterSpacing: ur ? 0 : '.12em', textTransform: ur ? 'none' : 'uppercase', marginTop: '.6rem' }}>
                  {ur ? 'دیکھیں ←' : 'Explore →'}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ATELIER BAND — the house, engraved ============ */}
      <section className="surface-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden data-no-reveal className="corner-frame" />
        <div className="container" style={{ paddingBlock: 'clamp(3.6rem, 7vw, 5.5rem)', textAlign: 'center' }}>
          <p className="kicker">{ur ? 'زیڈ زی گروپ کا معیار' : 'The House Standard'}</p>
          <h2 className="display-hero" style={{ fontSize: ur ? 'clamp(1.9rem, 4.4vw, 3rem)' : 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: ur ? 2 : 1.15, margin: '1rem auto 0', maxWidth: ur ? '30ch' : '24ch' }}>
            {ur ? 'دو برانڈز۔ معیارِ ہنر ایک۔' : <>Two brands. <em>One standard of craft.</em></>}
          </h2>
          <p style={{ color: '#cfc6b4', maxWidth: '58ch', margin: '1.2rem auto 0', fontSize: ur ? '1.15rem' : '1.02rem', lineHeight: ur ? 2 : 1.75 }}>
            {ur
              ? 'زیڈ زی مولڈنگ فریمنگ کے پیشہ ور افراد کے لیے — زیڈ زی ڈیکور جدید انٹیریئرز کے لیے۔'
              : 'ZZMOLDING serves the framing professional; ZZDECOR serves the modern interior — one supply standard behind both.'}
          </p>
          <p style={{ marginTop: '1.6rem', color: 'var(--zz-champagne)', fontWeight: 700, letterSpacing: ur ? 0 : '.22em', textTransform: ur ? 'none' : 'uppercase', fontSize: ur ? '1rem' : '.78rem' }}>
            {ur ? <>قائم <span className="ltr">2019</span> · لاہور</> : 'Est. 2019 · Lahore'}
          </p>
        </div>
      </section>

      {/* ============ 02 · DIVISIONS ============ */}
      <section style={{ background: 'var(--zz-gallery-white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ paddingBlock: 'clamp(4rem, 8vw, 6rem)' }}>
          <p className="section-no">{ur ? '۰۲ / برانڈز' : '02 / The Brands'}</p>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '2rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.4rem', boxShadow: '0 14px 34px -28px rgba(38, 33, 26, 0.5)' }}>
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
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.4rem', boxShadow: '0 14px 34px -28px rgba(38, 33, 26, 0.5)' }}>
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
        </div>
      </section>

      {/* ============ 03 · PROFESSIONAL SUPPORT ============ */}
      <section className="container" style={{ paddingBlock: 'clamp(4rem, 8vw, 6rem)' }}>
        <p className="section-no">{ur ? '۰۳ / پیشہ ورانہ معاونت' : '03 / Professional Support'}</p>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', margin: '.9rem 0 2rem', maxWidth: '26ch' }}>
          {ur ? 'ہر پیشہ ور کے لیے ایک راستہ' : 'A Pathway for Every Professional'}
        </h2>
        <div style={{ display: 'grid', gap: '1.1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {[
            [ur ? 'آرکیٹیکٹس اور ڈیزائنرز' : 'Architects & Interior Designers', ur ? 'اسپیسیفیکیشن سپورٹ اور نمونہ جات' : 'Specification support, finishes and samples for project work.'],
            [ur ? 'فریمرز اور ریٹیلرز' : 'Framers & Retailers', ur ? 'پروفائل رینج اور ریٹیل سپلائی' : 'Profile ranges, accessories and dependable retail supply.'],
            [ur ? 'کنٹریکٹرز اور ڈیویلپرز' : 'Contractors & Developers', ur ? 'پراجیکٹ مقدار اور ترسیل' : 'Project quantities, site coordination and delivery.'],
            [ur ? 'ہول سیلرز اور ڈیلرز' : 'Wholesalers & Dealers', ur ? 'ہول سیل قیمتیں اور ڈیلر معاونت' : 'Wholesale pricing structures and dealer support.']
          ].map(([h, b]) => (
            <div key={h} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.6rem', background: '#fff', boxShadow: '0 10px 26px -24px rgba(38, 33, 26, 0.45)' }}>
              <h3 style={{ fontSize: '1.15rem', marginTop: 0 }}>{h}</h3>
              <p style={{ color: 'var(--grey)', fontSize: '.92rem', marginBottom: 0 }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FINAL CONVERSION — framed invitation ============ */}
      <section className="surface-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden data-no-reveal className="corner-frame" />
        <div className="container" style={{ paddingBlock: 'clamp(4rem, 8vw, 6rem)', textAlign: 'center' }}>
          <p className="kicker">{ur ? 'آغاز کریں' : 'Begin Your Project'}</p>
          <h2 className="display-hero" style={{ fontSize: ur ? 'clamp(1.9rem, 4.5vw, 3rem)' : 'clamp(2.1rem, 5vw, 3.4rem)', margin: '.9rem auto 1rem', maxWidth: ur ? '28ch' : '22ch', lineHeight: ur ? 2 : 1.12 }}>
            {ur ? 'اپنے انٹیریئر کو زیڈزی گروپ کے ساتھ متعین کریں' : <>Define your interior <em>with ZZ GROUP.</em></>}
          </h2>
          <p style={{ color: '#cfc6b4', maxWidth: '56ch', margin: '0 auto 2.2rem' }}>
            {ur
              ? 'پراجیکٹ کوٹیشن، ہول سیل قیمتوں یا مصنوعات کی رہنمائی کے لیے ہم سے رابطہ کریں — پاکستان بھر میں۔'
              : 'Request a project quotation, wholesale pricing or product guidance — anywhere in Pakistan.'}
          </p>
          <div style={{ display: 'flex', gap: '.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`${base}/contact`} className="btn-gold">{ur ? 'پراجیکٹ کوٹیشن' : 'Request Project Quotation'}</Link>
            <Link href={`${base}/contact`} className="btn-secondary" style={{ color: '#f0ead9', borderColor: 'rgba(224,205,159,.45)' }}>
              {ur ? 'ہول سیل قیمت' : 'Request Wholesale Price'}
            </Link>
            <WhatsAppButton label={ur ? 'واٹس ایپ' : 'Chat on WhatsApp'} />
          </div>
        </div>
      </section>
    </>
  );
}
