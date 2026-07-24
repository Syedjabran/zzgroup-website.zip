'use client';
// ===========================================================================
// FILE: src/app/(admin)/admin/products/product-form.tsx
// This is the FORM (a client component). If the file you are pasting into
// currently starts with 'use server', you have the wrong file open.
// ===========================================================================

import { useActionState, useState } from 'react';
import { upsertProduct } from './product-actions';
import {
  PRODUCT_TYPES,
  CORE_MATERIALS,
  SURFACE_FINISHES,
  SURFACE_TEXTURES,
  COLOUR_FAMILIES,
  APPLICATION_AREAS,
  WATER_RESISTANCE,
  FIRE_RATINGS,
  INSTALLATION_METHODS,
  PROFILE_SHAPES,
  SUITABLE_FOR,
  EDGE_PROFILES,
  showsProfile,
  showsFlooring,
  showsInstallation,
  defaultPricingBasis,
  formatWidth,
  priceLabel,
  LENGTH_UNITS,
  humanise
} from './catalogue-options';

/** Face widths in inches. */
const WIDTH_PRESET_INCHES = [0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 6, 8] as const;

/** Board and panel thicknesses in millimetres. */
const THICKNESS_PRESET_MM = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 25] as const;

interface DraftSize {
  width: number;
  width_unit: string;
  thickness: number | null;
  thickness_unit: string;
  sku: string | null;
  price: number | null;
}

interface Brand { id: string; name_en: string }
interface Category { id: string; name_en: string; brand_id: string }

interface Product {
  id?: string; product_type?: string | null;
  brand_id?: string | null; category_id?: string | null;
  sku?: string; slug?: string; name_en?: string; name_ur?: string | null;
  description_en?: string | null; description_ur?: string | null;
  series?: string | null; decor_name?: string | null;
  core_material?: string | null; material?: string | null;
  finish?: string | null; surface_texture?: string | null;
  colour_family?: string | null; colour?: string | null;
  profile_shape?: string | null; suitable_for?: string[] | null;
  edge_profile?: string | null; installation_method?: string | null;
  water_resistance?: string | null; fire_rating?: string | null;
  application_areas?: string[] | null;
  warranty_years?: number | null;
  application?: string | null; featured?: boolean; published?: boolean;
}

export default function ProductForm({
  brands, categories, product
}: { brands: Brand[]; categories: Category[]; product?: Product }) {
  const [state, action, pending] = useActionState(upsertProduct, undefined);
  const p = product ?? {};
  const [type, setType] = useState<string>(p.product_type ?? 'frame_moulding');

  return (
    <form action={action} style={{ display: 'grid', gap: '1rem', maxWidth: 760 }}>
      {product?.id && <input type="hidden" name="id" defaultValue={product.id} />}

      <Group title="What is it">
        <Field label="Product type *">
          <select
            name="product_type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="admin-input"
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        <Two>
          <Field label="Product name (English) *">
            <input name="name_en" defaultValue={p.name_en ?? ''} required className="admin-input" />
          </Field>
          <Field label="Product name (Urdu)">
            <input name="name_ur" defaultValue={p.name_ur ?? ''} dir="rtl" className="admin-input" />
          </Field>
        </Two>

        <Two>
          <Field label="SKU *">
            <input name="sku" defaultValue={p.sku ?? ''} required className="admin-input" />
          </Field>
          <Field label="Slug (optional — auto from name)">
            <input name="slug" defaultValue={p.slug ?? ''} className="admin-input" />
          </Field>
        </Two>

        <Two>
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
        </Two>

        <Two>
          <Field label="Series / collection">
            <input name="series" defaultValue={p.series ?? ''} className="admin-input"
              placeholder="e.g. Heritage Gold" />
          </Field>
          <Field label="Decor / pattern name">
            <input name="decor_name" defaultValue={p.decor_name ?? ''} className="admin-input"
              placeholder="e.g. Natural Oak 4021" />
          </Field>
        </Two>
      </Group>

      <Group title="Material and appearance">
        <Two>
          <Pick label="Core material" name="core_material"
            options={CORE_MATERIALS} value={p.core_material ?? p.material ?? ''} />
          <Pick label="Surface finish" name="finish"
            options={SURFACE_FINISHES} value={p.finish ?? ''} />
        </Two>
        <Two>
          <Pick label="Texture" name="surface_texture"
            options={SURFACE_TEXTURES} value={p.surface_texture ?? ''} />
          <Pick label="Colour family" name="colour_family"
            options={COLOUR_FAMILIES} value={p.colour_family ?? ''} />
        </Two>
        <Field label="Exact colour / shade name">
          <input name="colour" defaultValue={p.colour ?? ''} className="admin-input" />
        </Field>
      </Group>

      {showsProfile(type) && (
        <Group title="Profile">
          <Two>
            <Field label="Profile shape">
              <select name="profile_shape" defaultValue={p.profile_shape ?? ''} className="admin-input">
                <option value="">—</option>
                {PROFILE_SHAPES.map((s) => <option key={s} value={s}>{humanise(s)}</option>)}
              </select>
            </Field>
            <div />
          </Two>
          <Checks label="Suitable for" name="suitable_for"
            options={SUITABLE_FOR} selected={p.suitable_for ?? []} humanised />
        </Group>
      )}

      {showsFlooring(type) && (
        <Group title="Flooring">
          <Two>
            <Pick label="Edge profile" name="edge_profile"
              options={EDGE_PROFILES} value={p.edge_profile ?? ''} />
            <div />
          </Two>
          <p style={hint}>
            Wear layer, AC rating and plank thickness are set per size, in the Sizes panel below.
          </p>
        </Group>
      )}

      {showsInstallation(type) && (
        <Group title="Installation and performance">
          <Two>
            <Pick label="Installation method" name="installation_method"
              options={INSTALLATION_METHODS} value={p.installation_method ?? ''} />
            <Pick label="Water resistance" name="water_resistance"
              options={WATER_RESISTANCE} value={p.water_resistance ?? ''} />
          </Two>
          <Two>
            <Pick label="Fire rating" name="fire_rating"
              options={FIRE_RATINGS} value={p.fire_rating ?? ''} />
            <Field label="Warranty (years)">
              <input name="warranty_years" type="number" min="0"
                defaultValue={p.warranty_years ?? ''} className="admin-input" />
            </Field>
          </Two>
        </Group>
      )}

      <Group title="Where it is used">
        <Checks label="Application areas" name="application_areas"
          options={APPLICATION_AREAS} selected={p.application_areas ?? []} />
        <Field label="Application note">
          <input name="application" defaultValue={p.application ?? ''} className="admin-input" />
        </Field>
      </Group>

      <Group title="Description and media">
        <Field label="Description (English)">
          <textarea name="description_en" defaultValue={p.description_en ?? ''} rows={3} className="admin-input" />
        </Field>
        <Field label="Description (Urdu)">
          <textarea name="description_ur" defaultValue={p.description_ur ?? ''} rows={3} dir="rtl" className="admin-input" />
        </Field>
        <Field label="Primary image (JPG/PNG/WebP/AVIF, ≤5 MB)">
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="admin-input" />
        </Field>
      </Group>

      {!product?.id && <DraftSizes productType={type} />}

      <label style={rowLabel}>
        <input type="checkbox" name="featured" defaultChecked={p.featured} /> Featured
      </label>
      <label style={rowLabel}>
        <input type="checkbox" name="published" defaultChecked={p.published} /> Published (unchecked = draft)
      </label>

      {state?.error && <p role="alert" style={{ color: 'var(--error)' }}>{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary" style={{ width: 'fit-content' }}>
        {pending ? 'Saving…' : 'Save product'}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------

const hint: React.CSSProperties = { color: 'var(--grey)', fontSize: '.85rem', margin: 0 };
const rowLabel: React.CSSProperties = { display: 'flex', gap: '.5rem', alignItems: 'center' };
const chip: React.CSSProperties = { fontSize: '.8rem', padding: '.25rem .5rem' };

/**
 * Sizes on the NEW product form.
 *
 * A variant row needs a product id, and on a new product there isn't one yet.
 * So sizes are staged here in browser state and posted as JSON in a hidden
 * field; the server action creates the product first, then writes them. Full
 * per-size detail — rabbet, coverage, wear layer, stock — stays on the edit
 * page, which opens automatically after saving.
 */
function DraftSizes({ productType }: { productType: string }) {
  const [rows, setRows] = useState<DraftSize[]>([]);
  const [width, setWidth] = useState('');
  const [widthUnit, setWidthUnit] = useState('inch');
  const [thickness, setThickness] = useState('');
  const [thicknessUnit, setThicknessUnit] = useState('mm');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');

  const add = () => {
    const w = Number(width);
    if (!Number.isFinite(w) || w <= 0) {
      setNote('Enter a width first.');
      return;
    }
    if (rows.some((r) => r.width === w && r.width_unit === widthUnit)) {
      setNote('That width is already in the list.');
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        width: w,
        width_unit: widthUnit,
        thickness: thickness === '' ? null : Number(thickness),
        thickness_unit: thicknessUnit,
        sku: sku.trim() === '' ? null : sku.trim(),
        price: price === '' ? null : Number(price)
      }
    ]);
    setWidth(''); setThickness(''); setSku(''); setPrice(''); setNote('');
  };

  const stopEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  return (
    <Group title="Sizes">
      <input type="hidden" name="sizes_json" value={JSON.stringify(rows)} />
      <p style={hint}>
        Add the sizes you sell. They are saved with the product, and you can
        add rabbet depth, coverage, stock and lead time on the next screen.
      </p>

      <div>
        <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Common widths</span>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.4rem' }}>
          {WIDTH_PRESET_INCHES.map((w) => (
            <button key={w} type="button" className="btn-secondary" style={chip}
              onClick={() => { setWidth(String(w)); setWidthUnit('inch'); }}>
              {formatWidth(w, 'inch')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Common thicknesses</span>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.4rem' }}>
          {THICKNESS_PRESET_MM.map((t) => (
            <button key={t} type="button" className="btn-secondary" style={chip}
              onClick={() => { setThickness(String(t)); setThicknessUnit('mm'); }}>
              {t}mm
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '.6rem' }}>
        <Field label="Width *">
          <input type="number" step="0.001" min="0.001" value={width} onKeyDown={stopEnter}
            onChange={(e) => setWidth(e.target.value)} className="admin-input" />
        </Field>
        <Field label="Unit">
          <select value={widthUnit} onChange={(e) => setWidthUnit(e.target.value)} className="admin-input">
            {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Thickness">
          <input type="number" step="0.001" value={thickness} onKeyDown={stopEnter}
            onChange={(e) => setThickness(e.target.value)} className="admin-input" />
        </Field>
        <Field label="Unit">
          <select value={thicknessUnit} onChange={(e) => setThicknessUnit(e.target.value)} className="admin-input">
            {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Size SKU">
          <input value={sku} onKeyDown={stopEnter} onChange={(e) => setSku(e.target.value)} className="admin-input" />
        </Field>
        <Field label={`Price (${priceLabel(defaultPricingBasis(productType))})`}>
          <input type="number" step="0.01" min="0" value={price} onKeyDown={stopEnter}
            onChange={(e) => setPrice(e.target.value)} className="admin-input" />
        </Field>
      </div>

      <div>
        <button type="button" className="btn-secondary" onClick={add}>+ Add size</button>
        {note && <span style={{ color: 'var(--error)', marginInlineStart: '.6rem', fontSize: '.85rem' }}>{note}</span>}
      </div>

      {rows.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '.35rem' }}>Width</th>
              <th>Thickness</th>
              <th>SKU</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.width}-${r.width_unit}`} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '.35rem', fontWeight: 600 }}>{formatWidth(r.width, r.width_unit)}</td>
                <td>{r.thickness != null ? `${r.thickness}${r.thickness_unit}` : '—'}</td>
                <td>{r.sku ?? '—'}</td>
                <td>{r.price != null ? r.price : '—'}</td>
                <td>
                  <button type="button" className="btn-secondary" style={{ ...chip, color: 'var(--error)' }}
                    onClick={() => setRows((prev) => prev.filter((_, n) => n !== i))}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Group>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem', display: 'grid', gap: '.9rem' }}>
      <legend style={{ fontWeight: 700, fontSize: '.9rem', padding: '0 .4rem', color: 'var(--deep-blue)' }}>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Two({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '.9rem' }}>
      {children}
    </div>
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

/**
 * A curated dropdown that falls back to free text. Choosing "Other…" reveals
 * an input, so staff are never blocked by a list that misses a value.
 */
function Pick({
  label, name, options, value
}: { label: string; name: string; options: readonly string[]; value: string }) {
  const known = value !== '' && options.includes(value);
  const [choice, setChoice] = useState(value === '' ? '' : known ? value : '__other__');

  return (
    <div style={{ display: 'grid', gap: '.3rem' }}>
      <label style={{ display: 'grid', gap: '.3rem' }}>
        <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{label}</span>
        <select name={name} value={choice} onChange={(e) => setChoice(e.target.value)} className="admin-input">
          <option value="">—</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
          <option value="__other__">Other…</option>
        </select>
      </label>
      {choice === '__other__' && (
        <input
          name={`${name}_other`}
          defaultValue={known ? '' : value}
          placeholder={`Type the ${label.toLowerCase()}`}
          className="admin-input"
        />
      )}
    </div>
  );
}

function Checks({
  label, name, options, selected, humanised
}: {
  label: string; name: string; options: readonly string[];
  selected: string[]; humanised?: boolean;
}) {
  return (
    <div style={{ display: 'grid', gap: '.4rem' }}>
      <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{label}</span>
      <div style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap' }}>
        {options.map((o) => (
          <label key={o} style={{ display: 'flex', gap: '.35rem', alignItems: 'center', fontSize: '.9rem' }}>
            <input type="checkbox" name={name} value={o} defaultChecked={selected.includes(o)} />
            {humanised ? humanise(o) : o}
          </label>
        ))}
      </div>
    </div>
  );
}
