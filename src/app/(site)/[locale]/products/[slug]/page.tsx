import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';
import { productWhatsappLink } from '@/lib/whatsapp';
import { primaryImage, mediaUrl } from '@/lib/media';
import { notFound } from 'next/navigation';
import { formatWidth, priceLabel, humanise } from '@/app/(admin)/admin/products/catalogue-options';

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

  // Brand landing
  const { data: brand } = await supabase.from('brands').select('id, name_en, name_ur').eq('slug', slug).eq('published', true).maybeSingle();
  if (brand) {
    const { data: products } = await supabase
      .from('products').select('id, slug, sku, name_en, name_ur, product_images(storage_path, is_primary)')
      .eq('brand_id', brand.id).eq('published', true).eq('archived', false)
      .order('created_at', { ascending: false });
    return (
      <div className="container" style={{ paddingBlock: '2.5rem' }}>
        <p className="eyebrow">{ur ? 'کلیکشن' : 'Collection'}</p>
        <h1 style={{ marginTop: '.3rem' }}>{ur && brand.name_ur ? brand.name_ur : brand.name_en}</h1>
        {(!products || products.length === 0) ? (
          <p style={{ color: 'var(--grey)' }}>{ur ? 'ابھی مصنوعات شامل کی جا رہی ہیں۔' : 'Products are being added. Please contact us for the current range.'}</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', marginTop: '1.25rem' }}>
            {products.map((p: any) => {
              const img = primaryImage(p.product_images);
              return (
                <Link key={p.id} href={`${base}/products/${p.slug}`}
                  style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', textDecoration: 'none', color: 'var(--zz-text-dark)', background: '#fff' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--zz-mineral-ivory)' }}>
                    {img ? (
                      <Image src={img} alt={p.name_en} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--grey)', fontSize: '.8rem' }}>
                        {ur ? 'تصویر جلد' : 'Image coming soon'}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '.9rem 1rem 1.1rem' }}>
                    <strong>{ur && p.name_ur ? p.name_ur : p.name_en}</strong>
                    <p style={{ color: 'var(--grey)', fontSize: '.83rem', margin: '.25rem 0 0' }}>SKU: <span className="ltr">{p.sku}</span></p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Product detail
  const { data: p } = await supabase
    .from('products')
    .select('*, brands(name_en, name_ur), product_images(storage_path, alt_text_en, is_primary, display_order)')
    .eq('slug', slug).eq('published', true).eq('archived', false).maybeSingle();
  if (!p) notFound();

  const { data: variantRows } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', p.id)
    .eq('published', true)
    .order('display_order')
    .order('width');

  const variants = variantRows ?? [];

  const name = ur && p.name_ur ? p.name_ur : p.name_en;
  const desc = ur && p.description_ur ? p.description_ur : p.description_en;
  const hero = primaryImage(p.product_images);
  const gallery = (p.product_images ?? [])
    .filter((i: any) => !i.is_primary)
    .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="container" style={{ paddingBlock: '2.5rem', display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      <div>
        <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--zz-mineral-ivory)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {hero ? (
            <Image src={hero} alt={p.name_en} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--grey)' }}>
              {ur ? 'تصویر جلد دستیاب' : 'Image coming soon'}
            </div>
          )}
        </div>
        {gallery.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.6rem', marginTop: '.6rem' }}>
            {gallery.map((g: any) => (
              <div key={g.storage_path} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Image src={mediaUrl(g.storage_path)} alt={g.alt_text_en ?? p.name_en} fill sizes="15vw" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="eyebrow" style={{ margin: 0 }}>{p.brands?.name_en}</p>
        <h1 style={{ marginTop: '.25rem' }}>{name}</h1>
        <p style={{ color: 'var(--grey)' }}>SKU: <span className="ltr">{p.sku}</span></p>
        {desc && <p>{desc}</p>}
        <ul style={{ color: 'var(--zz-text-dark)', lineHeight: 1.9 }}>
          {(p.core_material || p.material) && <li>{ur ? 'میٹیریل' : 'Material'}: {p.core_material ?? p.material}</li>}
          {p.finish && <li>{ur ? 'فنش' : 'Finish'}: {p.finish}</li>}
          {p.surface_texture && <li>{ur ? 'ساخت' : 'Texture'}: {p.surface_texture}</li>}
          {(p.colour_family || p.colour) && <li>{ur ? 'رنگ' : 'Colour'}: {p.colour ?? p.colour_family}</li>}
          {p.profile_shape && <li>{ur ? 'پروفائل' : 'Profile'}: {humanise(p.profile_shape)}</li>}
          {p.edge_profile && <li>{ur ? 'کنارہ' : 'Edge'}: {p.edge_profile}</li>}
          {p.installation_method && <li>{ur ? 'تنصیب' : 'Installation'}: {p.installation_method}</li>}
          {p.water_resistance && <li>{ur ? 'پانی سے مزاحمت' : 'Water resistance'}: {p.water_resistance}</li>}
          {p.fire_rating && <li>{ur ? 'فائر ریٹنگ' : 'Fire rating'}: {p.fire_rating}</li>}
          {p.warranty_years && <li>{ur ? 'وارنٹی' : 'Warranty'}: {p.warranty_years} {ur ? 'سال' : 'years'}</li>}
          {p.application && <li>{ur ? 'استعمال' : 'Application'}: {p.application}</li>}
        </ul>

        {variants.length > 0 && (
          <section style={{ marginBlock: '1.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 .6rem' }}>
              {ur ? 'دستیاب سائز' : 'Available sizes'}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.92rem' }}>
                <thead>
                  <tr style={{ textAlign: ur ? 'right' : 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '.45rem .5rem' }}>{ur ? 'چوڑائی' : 'Width'}</th>
                    <th style={{ padding: '.45rem .5rem' }}>{ur ? 'موٹائی' : 'Thickness'}</th>
                    <th style={{ padding: '.45rem .5rem' }}>{ur ? 'لمبائی' : 'Length'}</th>
                    <th style={{ padding: '.45rem .5rem' }}>{ur ? 'دستیابی' : 'Availability'}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v: any) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '.45rem .5rem', fontWeight: 700 }} className="ltr">
                        {formatWidth(v.width, v.width_unit)}
                      </td>
                      <td style={{ padding: '.45rem .5rem' }} className="ltr">
                        {v.thickness ? `${v.thickness}${v.thickness_unit}` : '—'}
                      </td>
                      <td style={{ padding: '.45rem .5rem' }} className="ltr">
                        {v.stick_length ? `${v.stick_length}${v.stick_length_unit}` : '—'}
                      </td>
                      <td style={{ padding: '.45rem .5rem' }}>
                        {v.stock_status === 'in_stock'
                          ? (ur ? 'اسٹاک میں' : 'In stock')
                          : humanise(v.stock_status)}
                      </td>
                      <td style={{ padding: '.45rem .5rem' }}>
                        <Link href={`${base}/contact?sku=${v.sku ?? p.sku}`} style={{ whiteSpace: 'nowrap' }}>
                          {ur ? 'قیمت پوچھیں' : 'Ask price'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ color: 'var(--grey)', fontSize: '.85rem', marginTop: '.5rem' }}>
              {ur
                ? 'قیمتیں آرڈر کے حجم کے مطابق مختلف ہوتی ہیں۔ تازہ ترین ریٹ کے لیے رابطہ کریں۔'
                : `Prices vary with order volume${
                    variants[0]?.pricing_basis ? ` and are quoted ${priceLabel(variants[0].pricing_basis)}` : ''
                  }. Contact us for current rates.`}
            </p>
          </section>
        )}
        <p style={{ fontWeight: 700, color: 'var(--zz-graphite)' }}>{t.availability.confirm}</p>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <Link href={`${base}/contact?sku=${p.sku}`} className="btn-gold">{t.actions.requestQuote}</Link>
          <a href={productWhatsappLink({ sku: p.sku })} target="_blank" rel="noopener noreferrer"
            className="btn-secondary wa-btn" style={{ color: 'var(--whatsapp)', borderColor: 'var(--whatsapp)' }}>
            {t.actions.quoteViaWhatsapp}
          </a>
        </div>
        <p style={{ color: 'var(--grey)', fontSize: '.85rem', marginTop: '1.5rem' }}>{t.productNotice}</p>
      </div>
    </div>
  );
}

