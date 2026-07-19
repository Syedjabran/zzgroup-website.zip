import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import ProductForm from '../product-form';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  if (!can.manageCatalogue(user)) return <p>Not authorised.</p>;

  const supabase = await createClient();
  const [{ data: product }, { data: brands }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('brands').select('id, name_en').order('display_order'),
    supabase.from('categories').select('id, name_en, brand_id').order('display_order')
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 style={{ color: 'var(--deep-blue)' }}>Edit: {product.name_en}</h1>
      <ProductForm brands={brands ?? []} categories={categories ?? []} product={product} />
    </div>
  );
}