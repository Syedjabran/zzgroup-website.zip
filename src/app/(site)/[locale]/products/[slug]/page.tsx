import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { productWhatsappLink } from '@/lib/whatsapp';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductOrBrand({
  params
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === 'ur';
  const base = `/${loc}`;
  const supabase = await createClient();

  // Is this slug a brand? Then show that brand's products.
  const { data: brand } = await supabase.from('brands').select('id, name_en, name_ur').eq('slug', slug).eq('published', true).maybeSingle();
  if (brand) {
    const { data: products } = await supabase
      .from('products').select('id, slug, sku, name_en, name_ur')
      .eq('brand_id', brand.id).eq('published', true).eq('archived', false)
      .order('created_at', { ascending: false });
    return (
      <div className="container" style={{ paddingBlock: '2.5rem' }}>
        <h1 style={{ color: 'var(--deep-blue)' }}>{ur && brand.name_ur ? brand.name_ur : brand.name_en}</h1>
        {(!products || products.length === 0) ? (
          <p style={{ color: 'var(--grey)' }}>{ur ? 'ابھی مصنوعات شامل کی جا رہی ہیں۔' : 'Products are being added. Please contact us for the current range.'}</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', marginTop: '1rem' }}>
            {products.map((p: any) => (
              <Link key={p.id} href={`${base}/products/${p.slug}`} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', textDecoration: 'none', color: 'var(--charcoal)' }}>
                <strong>{ur && p.name_ur ? p.name_ur : p.name_en}</strong>
                <p style={{ color: 'var(--grey)', fontSize: '.85rem' }}>SKU: {p.sku}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Otherwise treat as a product slug.
  const { data: p } = await supabase
    .from('products')
    .select('*, brands(name_en, name_ur), product_images(storage_path, alt_text_en, is_primary)')
    .eq('slug', slug).eq('published', true).eq('archived', false).maybeSingle();
  if (!p) notFound();

  const name = ur && p.name_ur ? p.name_ur : p.name_en;
  const desc = ur && p.description_ur ? p.description_ur : p.description_en;

  return (
    <div className="container" style={{ paddingBlock: '2.5rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <div style={{ background: 'var(--bg-soft)', borderRadius: 'var(--radius)', aspectRatio: '1', display: 'grid', placeItems: 'center', color: 'var(--grey)' }}>
        {ur ? 'تصویر' : 'Product image'}
      </div>
      <div>
        <p style={{ color: 'var(--sky)', fontWeight: 700, margin: 0 }}>{p.brands?.name_en}</p>
        <h1 style={{ color: 'var(--deep-blue)', marginTop: '.25rem' }}>{name}</h1>
        <p style={{ color: 'var(--grey)' }}>SKU: {p.sku}</p>
        {desc && <p>{desc}</p>}
        <ul style={{ color: 'var(--charcoal)', lineHeight: 1.9 }}>
          {p.material && <li>{ur ? 'میٹیریل' : 'Material'}: {p.material}</li>}
          {p.colour && <li>{ur ? 'رنگ' : 'Colour'}: {p.colour}</li>}
          {p.finish && <li>{ur ? 'فنش' : 'Finish'}: {p.finish}</li>}
          {p.application && <li>{ur ? 'استعمال' : 'Application'}: {p.application}</li>}
        </ul>
        <p style={{ fontWeight: 700, color: 'var(--deep-blue)' }}>{t.availability.confirm}</p>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <Link href={`${base}/contact?sku=${p.sku}`} className="btn-primary">{t.actions.requestQuote}</Link>
          <a href={productWhatsappLink({ sku: p.sku })} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: 'var(--whatsapp)', borderColor: 'var(--whatsapp)' }}>
            {t.actions.quoteViaWhatsapp}
          </a>
        </div>
        <p style={{ color: 'var(--grey)', fontSize: '.85rem', marginTop: '1.5rem' }}>{t.productNotice}</p>
      </div>
    </div>
  );
}
