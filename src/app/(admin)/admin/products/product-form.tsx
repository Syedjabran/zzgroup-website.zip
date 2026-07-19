'use client';

import { useActionState } from 'react';
import { upsertProduct } from './product-actions';

interface Brand { id: string; name_en: string }
interface Category { id: string; name_en: string; brand_id: string }
interface Product {
  id?: string; brand_id?: string | null; category_id?: string | null;
  sku?: string; slug?: string; name_en?: string; name_ur?: string | null;
  description_en?: string | null; description_ur?: string | null;
  material?: string | null; colour?: string | null; finish?: string | null;
  application?: string | null; featured?: boolean; published?: boolean;
}

export default function ProductForm({
  brands, categories, product
}: { brands: Brand[]; categories: Category[]; product?: Product }) {
  const [state, action, pending] = useActionState(upsertProduct, undefined);
  const p = product ?? {};

  return (
    <form action={action} style={{ display: 'grid', gap: '.9rem', maxWidth: 640 }}>
      {product?.id && <input type="hidden" name="id" defaultValue={product.id} />}

      <Field label="Product name (English) *">
        <input name="name_en" defaultValue={p.name_en ?? ''} required className="admin-input" />
      </Field>
      <Field label="Product name (Urdu)">
        <input name="name_ur" defaultValue={p.name_ur ?? ''} dir="rtl" className="admin-input" />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.9rem' }}>
        <Field label="SKU *">
          <input name="sku" defaultValue={p.sku ?? ''} required className="admin-input" />
        </Field>
        <Field label="Slug (optional — auto from name)">
          <input name="slug" defaultValue={p.slug ?? ''} className="admin-input" />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.9rem' }}>
        <Field label="Brand *">
          <select name="brand_id" defaultValue={p.brand_id ?? ''} required className="admin-input">
            <option value="" disabled>Choose…</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name_en}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select name="category_id" defaultValue={p.category_id ?? ''} className="admin-input">
            <option value="">—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.9rem' }}>
        <Field label="Material"><input name="material" defaultValue={p.material ?? ''} className="admin-input" /></Field>
        <Field label="Colour"><input name="colour" defaultValue={p.colour ?? ''} className="admin-input" /></Field>
        <Field label="Finish"><input name="finish" defaultValue={p.finish ?? ''} className="admin-input" /></Field>
      </div>

      <Field label="Application">
        <input name="application" defaultValue={p.application ?? ''} className="admin-input" />
      </Field>
      <Field label="Description (English)">
        <textarea name="description_en" defaultValue={p.description_en ?? ''} rows={3} className="admin-input" />
      </Field>
      <Field label="Description (Urdu)">
        <textarea name="description_ur" defaultValue={p.description_ur ?? ''} rows={3} dir="rtl" className="admin-input" />
      </Field>

      <Field label="Primary image (JPG/PNG/WebP/AVIF, ≤5 MB)">
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="admin-input" />
      </Field>

      <label style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <input type="checkbox" name="featured" defaultChecked={p.featured} /> Featured
      </label>
      <label style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <input type="checkbox" name="published" defaultChecked={p.published} /> Published (unchecked = draft)
      </label>

      {state?.error && <p role="alert" style={{ color: 'var(--error)' }}>{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary" style={{ width: 'fit-content' }}>
        {pending ? 'Saving…' : 'Save product'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: '.3rem' }}>
      <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{label}</span>
      {children}
    </label>
  );
}
