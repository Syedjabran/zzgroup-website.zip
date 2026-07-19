import { isLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const metadata = { title: 'About ZZ Group' };

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ur = (locale as Locale) === 'ur';
  return (
    <div className="container" style={{ paddingBlock: '2.5rem', maxWidth: 800 }}>
      <p style={{ color: 'var(--sky)', fontWeight: 700 }}>{ur ? 'لاہور میں قائم • ۲۰۱۹' : 'ESTABLISHED IN LAHORE • 2019'}</p>
      <h1 style={{ color: 'var(--deep-blue)' }}>{ur ? 'فریمنگ اور آرکیٹیکچرل ڈیکور میں ایک قابلِ اعتماد نام' : 'Building a Dependable Name in Framing and Architectural Décor'}</h1>
      <p>{ur
        ? 'زیڈزی گروپ اپنے دو برانڈز زیڈزی مولڈنگ اور زیڈزی ڈیکور کے ذریعے پیشہ ورانہ فریمنگ، ریٹیل تقسیم اور آرکیٹیکچرل انٹیریئرز کے لیے مخصوص مصنوعات فراہم کرتا ہے۔'
        : 'ZZ Group provides specialised product solutions for professional framing, retail distribution and architectural interiors through its two focused brands: ZZMOLDING and ZZDECOR.'}</p>
      <h2 style={{ color: 'var(--deep-blue)' }}>{ur ? 'ہماری کہانی' : 'Our Story'}</h2>
      <p>{ur
        ? 'زیڈزی گروپ ۲۰۱۹ میں لاہور میں قائم ہوا، اس مقصد کے ساتھ کہ معیاری فریمنگ اور آرائشی مصنوعات کو وسیع انتخاب، مسابقتی قیمتوں اور ذمہ دار سروس کے ذریعے مزید قابلِ رسائی بنایا جائے۔'
        : 'ZZ Group was established in Lahore in 2019 with a clear objective: to make quality framing and decorative interior products more accessible through wider product choice, competitive pricing and responsive customer service. Our portfolio has grown to include more than 200 frame-moulding designs alongside wall panels, WPC cladding, decorative surfaces, trims and accessories. We serve photo-frame shops, retailers, wholesale buyers, architects, interior designers, contractors and project professionals across Pakistan.'}</p>
      <h2 style={{ color: 'var(--deep-blue)' }}>{ur ? 'مشن' : 'Mission'}</h2>
      <p>{ur
        ? 'پاکستان بھر میں مسابقتی قیمتوں، ذمہ دار سروس اور قابلِ اعتماد ترسیل کے ساتھ معیاری فریمنگ اور آرکیٹیکچرل ڈیکور مصنوعات فراہم کرنا۔'
        : 'To provide quality framing and architectural décor products at competitive prices, supported by responsive customer service and reliable delivery across Pakistan.'}</p>
      <h2 style={{ color: 'var(--deep-blue)' }}>{ur ? 'وژن' : 'Vision'}</h2>
      <p>{ur
        ? 'پاکستان بھر میں فریمنگ پیشہ ور افراد، ریٹیلرز، آرکیٹیکٹس اور ڈیزائنرز کے لیے پہلا قابلِ اعتماد ذریعہ بننا۔'
        : 'To become a trusted first-choice source for framing professionals, retailers, architects and interior designers seeking dependable decorative materials throughout Pakistan.'}</p>
    </div>
  );
}
