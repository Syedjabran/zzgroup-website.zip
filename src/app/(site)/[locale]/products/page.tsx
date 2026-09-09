import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { primaryImage } from '@/lib/media';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Collections | Frame Mouldings & Wall Panels Pakistan',
  description: 'Browse ZZ Group frame mouldings, framing supplies, wall panels, WPC cladding, decorative surfaces and architectural trims across Pakistan.'
};

export default async function ProductsPage({
  params, searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ brand?: string; q?: string; type?: string; material?: string; colour?: string }>;
}) {
  const { locale } = await params;
  const { brand, q, type, material, colour } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const t = getDictionary(loc);
  const ur = loc === 'ur';
  const base = `/${loc}`;

  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('id, slug, sku, name_en, name_ur, colour, colour_family, material, core_material, product_type, brands(slug, name_en), product_images(storage_path, is_primary)')
    .eq('published', true)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(60);

  if (brand) {
    const { data: b } = await supabase.from('brands').select('id').eq('slug', brand).single();
    if (b) query = query.eq('brand_id', b.id);
  }
  if (q) query = query.or(`name_en.ilike.%${q}%,sku.ilike.%${q}%`);
  if (type) query = query.eq('product_type', type);
  if (material) query = query.ilike('core_material', material);
  if (colour) query = query.eq('colour_family', colour);

  const { data: products } = await query;

  return (
    <div className="container" style={{ paddingBlock: '2.5rem' }}>
      <p className="eyebrow">{ur ? 'کلیکشنز · کیٹلاگ' : 'Collections · Catalogue'}</p>
      <h1 style={{ marginTop: '.3rem' }}>{ur ? 'ہر سطح کے لیے مواد' : 'Materials for every surface'}</h1>
      <p style={{ maxWidth: '60ch', color: 'var(--grey)', marginTop: '.7rem' }}>
        {ur ? 'فریم مولڈنگز، وال پینلز اور آرکیٹیکچرل ٹرِمز کو مواد، رنگ اور استعمال کے مطابق دریافت کریں۔' : 'Explore frame mouldings, wall panels and architectural trims by material, colour and application. Product specifications and current pricing are confirmed by our team.'}
      </p>

      <div className="catalogue-paths" aria-label={ur ? 'مصنوعات کی اقسام' : 'Browse by collection'}>
        {[
          ['ZZMOLDING', ur ? 'فریم مولڈنگز' : 'Frame Mouldings', 'frame_moulding', 'zzmolding'],
          ['ZZMOLDING', ur ? 'فریمنگ لوازمات' : 'Framing Accessories', 'accessory', 'zzmolding'],
          ['ZZDECOR', ur ? 'وال پینلز' : 'Wall Panels', 'wall_panel', 'zzdecor'],
          ['ZZDECOR', ur ? 'ڈبلیو پی سی کلیڈنگ' : 'WPC Cladding', 'cladding', 'zzdecor'],
          ['ZZDECOR', ur ? 'ماربل اور اونکس' : 'Marble & Onyx', 'sheet', 'zzdecor'],
          ['ZZDECOR', ur ? 'اسکرٹنگ اور ٹرِمز' : 'Skirting & Trims', 'trim', 'zzdecor']
        ].map(([division, label, productType, divisionSlug]) => (
          <Link key={`${division}-${productType}`} href={`${base}/products?brand=${divisionSlug}&type=${productType}`} className="catalogue-path">
            <span className="catalogue-path__division">{division}</span>
            <strong>{label}</strong>
            <span className="catalogue-path__arrow" aria-hidden>↗</span>
          </Link>
        ))}
      </div>

      <form style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 2fr) repeat(2, minmax(150px, 1fr)) auto', gap: '.75rem', alignItems: 'end', margin: '2.5rem 0 1rem' }}>
        {brand && <input type="hidden" name="brand" value={brand} />}
        {type && <input type="hidden" name="type" value={type} />}
        <input name="q" defaultValue={q ?? ''} placeholder={t.actions.searchProducts}
          className="admin-input" style={{ maxWidth: 280 }} />
        <label className="filter-label">{ur ? 'مواد' : 'Material'}
          <select name="material" defaultValue={material ?? ''} className="admin-input">
            <option value="">{ur ? 'تمام مواد' : 'All materials'}</option>
            {['MDF', 'Polystyrene (PS)', 'PVC', 'WPC', 'SPC', 'Marble', 'Onyx', 'Solid wood'].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label className="filter-label">{ur ? 'رنگ' : 'Colour'}
          <select name="colour" defaultValue={colour ?? ''} className="admin-input">
            <option value="">{ur ? 'تمام رنگ' : 'All colours'}</option>
            {['White', 'Off-white / ivory', 'Grey', 'Charcoal', 'Black', 'Natural oak', 'Walnut', 'Gold', 'Silver / chrome', 'Bronze', 'Marble white', 'Onyx'].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <button className="btn-primary">{t.actions.searchProducts}</button>
        <Link href={`${base}/products`} className="btn-secondary">{t.actions.clearFilters}</Link>
      </form>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <Link href={`${base}/products?brand=zzmolding`} className="btn-secondary">All ZZMOLDING</Link>
        <Link href={`${base}/products?brand=zzdecor`} className="btn-secondary">All ZZDECOR</Link>
      </div>

      {(!products || products.length === 0) ? (
        <p style={{ color: 'var(--grey)' }}>
          {ur ? 'ابھی کوئی مصنوعات دستیاب نہیں۔ جلد شامل کی جائیں گی۔' : 'No products to show yet. New products are added regularly — please check back or contact us.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
          {products.map((p: any) => {
            const img = primaryImage(p.product_images);
            return (
              <Link key={p.id} href={`${base}/products/${p.slug}`}
                style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', textDecoration: 'none', color: 'var(--zz-text-dark)', background: '#fff' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--zz-mineral-ivory)' }}>
                  {img ? (
                    <Image src={img} alt={p.name_en} fill sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--grey)', fontSize: '.8rem' }}>
                      {ur ? 'تصویر جلد' : 'Image coming soon'}
                    </div>
                  )}
                </div>
                <div style={{ padding: '.9rem 1rem 1.1rem' }}>
                  <p style={{ fontSize: '.72rem', color: 'var(--zz-aged-bronze)', margin: 0, letterSpacing: ur ? 0 : '.1em', textTransform: ur ? 'none' : 'uppercase', fontWeight: 700 }}>
                    {p.brands?.name_en}
                  </p>
                  <strong style={{ display: 'block', marginTop: '.2rem' }}>{ur && p.name_ur ? p.name_ur : p.name_en}</strong>
                  <p style={{ color: 'var(--grey)', fontSize: '.83rem', margin: '.25rem 0 0' }}>
                    SKU: <span className="ltr">{p.sku}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
