import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  params, searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ brand?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { brand, q } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === 'ur';
  const base = `/${loc}`;

  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('id, slug, sku, name_en, name_ur, colour, material, brands(slug, name_en)')
    .eq('published', true)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(60);

  if (brand) {
    const { data: b } = await supabase.from('brands').select('id').eq('slug', brand).single();
    if (b) query = query.eq('brand_id', b.id);
  }
  if (q) query = query.or(`name_en.ilike.%${q}%,sku.ilike.%${q}%`);

  const { data: products } = await query;

  return (
    <div className="container" style={{ paddingBlock: '2.5rem' }}>
      <h1 style={{ color: 'var(--deep-blue)' }}>{t.nav.products}</h1>

      <form style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', margin: '1rem 0' }}>
        <input name="q" defaultValue={q ?? ''} placeholder={t.actions.searchProducts}
          className="admin-input" style={{ maxWidth: 280 }} />
        <button className="btn-primary">{t.actions.searchProducts}</button>
        <Link href={`${base}/products`} className="btn-secondary">{t.actions.clearFilters}</Link>
      </form>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
        <Link href={`${base}/products?brand=zzmolding`} className="btn-secondary">ZZMOLDING</Link>
        <Link href={`${base}/products?brand=zzdecor`} className="btn-secondary">ZZDECOR</Link>
      </div>

      {(!products || products.length === 0) ? (
        <p style={{ color: 'var(--grey)' }}>
          {ur ? 'ابھی کوئی مصنوعات دستیاب نہیں۔ جلد شامل کی جائیں گی۔' : 'No products to show yet. New products are added regularly — please check back or contact us.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {products.map((p: any) => (
            <Link key={p.id} href={`${base}/products/${p.slug}`}
              style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', textDecoration: 'none', color: 'var(--charcoal)' }}>
              <div style={{ background: 'var(--bg-soft)', borderRadius: 8, aspectRatio: '4/3', display: 'grid', placeItems: 'center', color: 'var(--grey)', fontSize: '.8rem' }}>
                {ur ? 'تصویر' : 'Image'}
              </div>
              <p style={{ fontSize: '.75rem', color: 'var(--sky)', margin: '.5rem 0 0' }}>{p.brands?.name_en}</p>
              <strong>{ur && p.name_ur ? p.name_ur : p.name_en}</strong>
              <p style={{ color: 'var(--grey)', fontSize: '.85rem', margin: '.25rem 0 0' }}>SKU: {p.sku}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}