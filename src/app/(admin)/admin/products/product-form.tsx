'use server';

import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  PROFILE_SHAPES,
  SUITABLE_FOR,
  LENGTH_UNITS,
  STOCK_STATUSES,
  PRODUCT_TYPE_VALUES,
  PRICING_BASIS_VALUES,
  COVERAGE_UNITS
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

/**
 * Curated dropdowns offer an "Other…" option backed by a companion text
 * input named `<field>_other`. Whichever the user filled in wins.
 */
function choice(formData: FormData, field: string): string | null {
  const picked = String(formData.get(field) ?? '').trim();
  if (picked === '__other__') return text(formData.get(`${field}_other`));
  return picked === '' ? null : picked;
}

function oneOf(value: FormDataEntryValue | null, allowed: readonly string[]): string | null {
  const raw = String(value ?? '').trim();
  return allowed.includes(raw) ? raw : null;
}

function list(formData: FormData, field: string, allowed: readonly string[]): string[] {
  return formData.getAll(field).map(String).filter((v) => allowed.includes(v));
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

  const row = {
    product_type: oneOf(formData.get('product_type'), PRODUCT_TYPE_VALUES) ?? 'frame_moulding',
    brand_id: String(formData.get('brand_id') ?? '') || null,
    category_id: String(formData.get('category_id') ?? '') || null,
    sku,
    slug,
    name_en,
    name_ur: text(formData.get('name_ur')),
    description_en: text(formData.get('description_en')),
    description_ur: text(formData.get('description_ur')),
    series: text(formData.get('series')),
    decor_name: text(formData.get('decor_name')),

    // Material and appearance
    core_material: choice(formData, 'core_material'),
    material: choice(formData, 'core_material'), // keep the legacy column in step
    finish: choice(formData, 'finish'),
    surface_texture: choice(formData, 'surface_texture'),
    colour_family: choice(formData, 'colour_family'),
    colour: text(formData.get('colour')),

    // Mouldings and trims
    profile_shape: oneOf(formData.get('profile_shape'), PROFILE_SHAPES),
    suitable_for: list(formData, 'suitable_for', SUITABLE_FOR),

    // Flooring
    edge_profile: choice(formData, 'edge_profile'),

    // Installation and performance
    installation_method: choice(formData, 'installation_method'),
    water_resistance: choice(formData, 'water_resistance'),
    fire_rating: choice(formData, 'fire_rating'),
    application_areas: formData.getAll('application_areas').map(String).filter(Boolean),
    certifications: formData.getAll('certifications').map(String).filter(Boolean),
    warranty_years: num(formData.get('warranty_years')),
    country_of_origin: text(formData.get('country_of_origin')),

    application: text(formData.get('application')),
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
// VARIANTS — one row per sellable size
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
  if (width === null || width <= 0) return { error: 'Enter a width greater than zero.' };

  const row = {
    product_id,
    sku: text(formData.get('sku')),

    // Geometry
    width,
    width_unit: oneOf(formData.get('width_unit'), LENGTH_UNITS) ?? 'inch',
    thickness: num(formData.get('thickness')),
    thickness_unit: oneOf(formData.get('thickness_unit'), LENGTH_UNITS) ?? 'mm',
    rabbet_depth: num(formData.get('rabbet_depth')),
    height: num(formData.get('height')),
    dimension_unit: oneOf(formData.get('dimension_unit'), LENGTH_UNITS) ?? 'mm',

    // Supply
    stick_length: num(formData.get('stick_length')),
    stick_length_unit: oneOf(formData.get('stick_length_unit'), LENGTH_UNITS) ?? 'ft',
    sticks_per_bundle: num(formData.get('sticks_per_bundle')),
    length_per_bundle: num(formData.get('length_per_bundle')),
    pieces_per_pack: num(formData.get('pieces_per_pack')),
    coverage_per_pack: num(formData.get('coverage_per_pack')),
    coverage_unit: oneOf(formData.get('coverage_unit'), COVERAGE_UNITS) ?? 'sqft',
    weight_kg: num(formData.get('weight_kg')),

    // Performance
    wear_layer_microns: num(formData.get('wear_layer_microns')),
    ac_rating: text(formData.get('ac_rating')),
    density_kg_m3: num(formData.get('density_kg_m3')),

    // Commercial
    price: num(formData.get('price')),
    pricing_basis: oneOf(formData.get('pricing_basis'), PRICING_BASIS_VALUES) ?? 'running_foot',
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
