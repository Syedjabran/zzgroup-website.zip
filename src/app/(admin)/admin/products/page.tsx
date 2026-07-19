import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import Link from 'next/link';
import { togglePublish, archiveProduct } from './product-actions';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  if (!can.manageCatalogue(user)) return <p>Not authorised.</p>;

  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, sku, name_en, published, archived, brands(name_en)')
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--deep-blue)' }}>Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
            <th style={{ padding: '.5rem' }}>SKU</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p: any) => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '.5rem' }}>{p.sku}</td>
              <td><Link href={`/admin/products/${p.id}`}>{p.name_en}</Link></td>
              <td>{p.brands?.name_en ?? '—'}</td>
              <td>
                <span style={{ color: p.published ? 'var(--sky)' : 'var(--grey)' }}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style={{ display: 'flex', gap: '.5rem' }}>
                <form action={togglePublish.bind(null, p.id, !p.published)}>
                  <button className="btn-secondary">{p.published ? 'Unpublish' : 'Publish'}</button>
                </form>
                <form action={archiveProduct.bind(null, p.id)}>
                  <button className="btn-secondary">Archive</button>
                </form>
              </td>
            </tr>
          ))}
          {(!products || products.length === 0) && (
            <tr><td colSpan={5} style={{ padding: '1rem', color: 'var(--grey)' }}>No products yet. Add your first one.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
