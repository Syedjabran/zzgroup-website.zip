'use server';

import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function upsertProduct(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return { error: 'Not authorised.' };

  const id = (formData.get('id') as string) || null;
  const name_en = String(formData.get('name_en') ?? '').trim();
  const sku = String(formData.get('sku') ?? '').trim();
  if (!name_en || !sku) return { error: 'Product name and SKU are required.' };

  const slug = (String(formData.get('slug') ?? '').trim() || slugify(name_en));

  const row = {
    brand_id: String(formData.get('brand_id') ?? '') || null,
    category_id: String(formData.get('category_id') ?? '') || null,
    sku,
    slug,
    name_en,
    name_ur: String(formData.get('name_ur') ?? '') || null,
    description_en: String(formData.get('description_en') ?? '') || null,
    description_ur: String(formData.get('description_ur') ?? '') || null,
    material: String(formData.get('material') ?? '') || null,
    colour: String(formData.get('colour') ?? '') || null,
    finish: String(formData.get('finish') ?? '') || null,
    application: String(formData.get('application') ?? '') || null,
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on'
  };

  const { data: saved, error } = id
    ? await supabase.from('products').update(row).eq('id', id).select('id').single()
    : await supabase.from('products').insert(row).select('id').single();

  if (error) {
    if (error.code === '23505') return { error: 'That SKU or slug is already in use.' };
    return { error: error.message };
  }

  const file = formData.get('image') as File | null;
  if (file && file.size > 0) {
    if (!ALLOWED_IMAGE.includes(file.type)) return { error: 'Image must be JPG, PNG, WebP or AVIF.' };
    if (file.size > MAX_IMAGE_BYTES) return { error: 'Image must be under 5 MB.' };

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
    const path = `products/${saved!.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('product-media')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) return { error: `Image upload failed: ${upErr.message}` };

    await supabase.from('product_images').insert({
      product_id: saved!.id,
      storage_path: path,
      is_primary: true
    });
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function togglePublish(id: string, publish: boolean) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;
  await supabase.from('products').update({ published: publish }).eq('id', id);
  revalidatePath('/admin/products');
}

export async function archiveProduct(id: string) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;
  await supabase.from('products').update({ archived: true, published: false }).eq('id', id);
  revalidatePath('/admin/products');
}