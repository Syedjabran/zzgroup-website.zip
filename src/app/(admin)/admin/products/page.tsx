import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import ProductRowActions from './product-row-actions';
import { formatWidth } from './catalogue-options';

export const dynamic = 'force-dynamic';

interface VariantChip {
  width: number | string;
  width_unit: string;
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const showArchived = view === 'archived';

  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  if (!can.manageCatalogue(user)) return <p>Not authorised.</p>;

  const supabase = await createClient();

  const [{ data: products }, { count: archivedCount }] = await Promise.all([
    supabase
      .from('products')
      .select('id, sku, name_en, published, archived, brands(name_en), product_variants(width, width_unit)')
      .eq('archived', showArchived)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('archived', true)
  ]);

  const tab = (active: boolean): React.CSSProperties => ({
    padding: '.35rem .75rem',
    borderBottom: active ? '2px solid var(--deep-blue)' : '2px solid transparent',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--deep-blue)' : 'var(--grey)',
    textDecoration: 'none'
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--deep-blue)' }}>Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
      </div>

      <nav style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/admin/products" style={tab(!showArchived)}>Active</Link>
        <Link href="/admin/products?view=archived" style={tab(showArchived)}>
          Recycle bin{archivedCount ? ` (${archivedCount})` : ''}
        </Link>
      </nav>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
            <th style={{ padding: '.5rem' }}>SKU</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Sizes</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p: any) => {
            const variants: VariantChip[] = p.product_variants ?? [];
            const sizes = variants
              .map((v) => ({ n: Number(v.width), label: formatWidth(v.width, v.width_unit) }))
              .sort((a, b) => a.n - b.n);

            return (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '.5rem' }}>{p.sku}</td>
                <td><Link href={`/admin/products/${p.id}`}>{p.name_en}</Link></td>
                <td>{p.brands?.name_en ?? '—'}</td>
                <td>
                  {sizes.length === 0 ? (
                    <span style={{ color: 'var(--grey)', fontSize: '.85rem' }}>No sizes</span>
                  ) : (
                    <span style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                      {sizes.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '.8rem',
                            padding: '.1rem .4rem',
                            border: '1px solid var(--border)',
                            borderRadius: 3
                          }}
                        >
                          {s.label}
                        </span>
                      ))}
                    </span>
                  )}
                </td>
                <td>
                  <span style={{ color: p.published ? 'var(--sky)' : 'var(--grey)' }}>
                    {p.archived ? 'Deleted' : p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <ProductRowActions
                    id={p.id}
                    name={p.name_en}
                    published={p.published}
                    archived={p.archived}
                  />
                </td>
              </tr>
            );
          })}
          {(!products || products.length === 0) && (
            <tr>
              <td colSpan={6} style={{ padding: '1rem', color: 'var(--grey)' }}>
                {showArchived ? 'The recycle bin is empty.' : 'No products yet. Add your first one.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
