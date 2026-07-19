import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import ProductForm from '../product-form';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  if (!can.manageCatalogue(user)) return <p>Not authorised.</p>;

  const supabase = await createClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('id, name_en').order('display_order'),
    supabase.from('categories').select('id, name_en, brand_id').order('display_order')
  ]);

  return (
    <div>
      <h1 style={{ color: 'var(--deep-blue)' }}>New product</h1>
      <ProductForm brands={brands ?? []} categories={categories ?? []} />
    </div>
  );
}
