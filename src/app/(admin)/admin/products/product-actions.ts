'use server';

import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  PROFILE_SHAPES,
  SUITABLE_FOR,
  LENGTH_UNITS,
  STOCK_STATUSES
} from './catalogue-options';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Empty string -> null, otherwise a finite number or null. */
function num(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? '').trim();
  if (raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function text(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? '').trim();
  return raw === '' ? null : raw;
}

function oneOf<T extends readonly string[]>(
  value: FormDataEntryValue | null,
  allowed: T
): T[number] | null {
  const raw = String(value ?? '').trim();
  return (allowed as readonly string[]).includes(raw) ? (raw as T[number]) : null;
}

// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------

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

  const slug = String(formData.get('slug') ?? '').trim() || slugify(name_en);

  const suitable_for = formData
    .getAll('suitable_for')
    .map(String)
    .filter((v) => (SUITABLE_FOR as readonly string[]).includes(v));

  const row = {
    brand_id: String(formData.get('brand_id') ?? '') || null,
    category_id: String(formData.get('category_id') ?? '') || null,
    sku,
    slug,
    name_en,
    name_ur: text(formData.get('name_ur')),
    description_en: text(formData.get('description_en')),
    description_ur: text(formData.get('description_ur')),
    material: text(formData.get('material')),
    colour: text(formData.get('colour')),
    finish: text(formData.get('finish')),
    application: text(formData.get('application')),
    series: text(formData.get('series')),
    profile_shape: oneOf(formData.get('profile_shape'), PROFILE_SHAPES),
    suitable_for,
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
  redirect(`/admin/products/${saved!.id}`);
}

export async function togglePublish(id: string, publish: boolean) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;
  await supabase.from('products').update({ published: publish }).eq('id', id);
  revalidatePath('/admin/products');
}

/** Soft delete — moves the product to the recycle bin and unpublishes it. */
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;
  await supabase.from('products').update({ archived: true, published: false }).eq('id', id);
  revalidatePath('/admin/products');
}

export async function restoreProduct(id: string) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;
  await supabase.from('products').update({ archived: false }).eq('id', id);
  revalidatePath('/admin/products');
}

/**
 * Hard delete. The database function removes gallery links, related rows,
 * images and variants, then the product, and returns the storage paths so
 * the bucket can be cleared here.
 */
export async function deleteProductForever(id: string) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;

  const { data: paths, error } = await supabase.rpc('delete_product_permanently', {
    p_product_id: id
  });
  if (error) return;

  if (Array.isArray(paths) && paths.length > 0) {
    await supabase.storage.from('product-media').remove(paths as string[]);
  }

  revalidatePath('/admin/products');
}

// ---------------------------------------------------------------------------
// VARIANTS — one row per face width of a moulding series
// ---------------------------------------------------------------------------

export async function saveVariant(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return { error: 'Not authorised.' };

  const id = text(formData.get('id'));
  const product_id = text(formData.get('product_id'));
  if (!product_id) return { error: 'Missing product.' };

  const width = num(formData.get('width'));
  if (width === null || width <= 0) return { error: 'Enter a face width greater than zero.' };

  const row = {
    product_id,
    sku: text(formData.get('sku')),
    width,
    width_unit: oneOf(formData.get('width_unit'), LENGTH_UNITS) ?? 'inch',
    rabbet_depth: num(formData.get('rabbet_depth')),
    height: num(formData.get('height')),
    dimension_unit: oneOf(formData.get('dimension_unit'), LENGTH_UNITS) ?? 'mm',
    stick_length: num(formData.get('stick_length')),
    stick_length_unit: oneOf(formData.get('stick_length_unit'), LENGTH_UNITS) ?? 'ft',
    sticks_per_bundle: num(formData.get('sticks_per_bundle')),
    length_per_bundle: num(formData.get('length_per_bundle')),
    price_per_foot: num(formData.get('price_per_foot')),
    price_per_metre: num(formData.get('price_per_metre')),
    currency: text(formData.get('currency')) ?? 'PKR',
    moq: num(formData.get('moq')),
    stock_status: oneOf(formData.get('stock_status'), STOCK_STATUSES) ?? 'in_stock',
    lead_time_days: num(formData.get('lead_time_days')),
    display_order: num(formData.get('display_order')) ?? 0,
    published: formData.get('published') === 'on'
  };

  const { error } = id
    ? await supabase.from('product_variants').update(row).eq('id', id)
    : await supabase.from('product_variants').insert(row);

  if (error) {
    if (error.code === '23505') {
      return { error: 'That width already exists for this product, or the SKU is taken.' };
    }
    return { error: error.message };
  }

  revalidatePath(`/admin/products/${product_id}`);
  revalidatePath('/admin/products');
  return { ok: true };
}

export async function deleteVariant(id: string, productId: string) {
  const supabase = await createClient();
  const user = await getStaffUser();
  if (!user || !can.manageCatalogue(user)) return;
  await supabase.from('product_variants').delete().eq('id', id);
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/admin/products');
}
