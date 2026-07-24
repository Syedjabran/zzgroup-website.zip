'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { saveVariant, deleteVariant } from './product-actions';
import {
  LENGTH_UNITS,
  STOCK_STATUSES,
  PRICING_BASES,
  COVERAGE_UNITS,
  AC_RATINGS,
  defaultPricingBasis,
  formatWidth,
  priceLabel,
  pieceNoun,
  humanise
} from './catalogue-options';

/** Face widths in inches — mouldings, trims, panel faces. */
const WIDTH_PRESET_INCHES = [0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 6, 8] as const;

/** Board and panel thicknesses in millimetres. */
const THICKNESS_PRESET_MM = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 25] as const;

export interface Variant {
  id: string;
  sku: string | null;
  width: number | string;
  width_unit: string;
  thickness: number | string | null;
  thickness_unit: string;
  rabbet_depth: number | string | null;
  height: number | string | null;
  dimension_unit: string;
  stick_length: number | string | null;
  stick_length_unit: string;
  sticks_per_bundle: number | null;
  length_per_bundle: number | string | null;
  pieces_per_pack: number | null;
  coverage_per_pack: number | string | null;
  coverage_unit: string;
  weight_kg: number | string | null;
  wear_layer_microns: number | null;
  ac_rating: string | null;
  density_kg_m3: number | string | null;
  price: number | string | null;
  pricing_basis: string;
  currency: string;
  moq: number | string | null;
  stock_status: string;
  lead_time_days: number | null;
  display_order: number;
  published: boolean;
}

const cls = 'admin-input';

/**
 * Sizes for one product. Each row is a sellable SKU — a face width for a
 * moulding, a plank thickness for flooring, a panel width for cladding.
 *
 * productType is optional: pass it to get sharper labels and the right
 * default pricing basis. Without it the editor still works.
 */
export default function VariantEditor({
  productId,
  variants,
  productType = 'frame_moulding'
}: {
  productId: string;
  variants: Variant[];
  productType?: string;
}) {
  const [state, action, pending] = useActionState(saveVariant, undefined);
  const [editing, setEditing] = useState<Variant | null>(null);
  const [busy, startDelete] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setEditing(null);
    }
  }, [state]);

  const v = editing;
  const noun = pieceNoun(productType);
  const sorted = [...variants].sort((a, b) => Number(a.width) - Number(b.width));

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{ color: 'var(--deep-blue)', marginBottom: '.25rem' }}>Sizes</h2>
      <p style={{ color: 'var(--grey)', fontSize: '.9rem', marginTop: 0 }}>
        One row per sellable SKU. Thickness, length and price all live here,
        because they change from size to size.
      </p>

      {sorted.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '.4rem' }}>Width</th>
              <th>Thickness</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '.4rem', fontWeight: 600 }}>
                  {formatWidth(row.width, row.width_unit)}
                </td>
                <td>{row.thickness ? `${row.thickness}${row.thickness_unit}` : '—'}</td>
                <td>{row.sku ?? '—'}</td>
                <td>
                  {row.price
                    ? `${row.currency} ${row.price} ${priceLabel(row.pricing_basis)}`
                    : '—'}
                </td>
                <td>{humanise(row.stock_status)}</td>
                <td style={{ color: row.published ? 'var(--sky)' : 'var(--grey)' }}>
                  {row.published ? 'Live' : 'Hidden'}
                </td>
                <td style={{ display: 'flex', gap: '.4rem', padding: '.4rem' }}>
                  <button type="button" className="btn-secondary" style={smallBtn}
                    onClick={() => setEditing(row)}>
                    Edit
                  </button>
                  <button type="button" className="btn-secondary"
                    style={{ ...smallBtn, color: 'var(--error)' }} disabled={busy}
                    onClick={() => {
                      if (!confirm(`Remove the ${formatWidth(row.width, row.width_unit)} size?`)) return;
                      startDelete(() => void deleteVariant(row.id, productId));
                    }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form ref={formRef} action={action} key={v?.id ?? 'new'} style={formBox}>
        <input type="hidden" name="product_id" value={productId} />
        {v?.id && <input type="hidden" name="id" defaultValue={v.id} />}

        <strong>{v ? `Edit ${formatWidth(v.width, v.width_unit)}` : 'Add a size'}</strong>

        <Presets
          label="Common widths"
          values={WIDTH_PRESET_INCHES}
          render={(w) => formatWidth(w, 'inch')}
          onPick={(w) => {
            const form = formRef.current;
            if (!form) return;
            (form.elements.namedItem('width') as HTMLInputElement).value = String(w);
            (form.elements.namedItem('width_unit') as HTMLSelectElement).value = 'inch';
          }}
        />

        <Presets
          label="Common thicknesses"
          values={THICKNESS_PRESET_MM}
          render={(t) => `${t}mm`}
          onPick={(t) => {
            const form = formRef.current;
            if (!form) return;
            (form.elements.namedItem('thickness') as HTMLInputElement).value = String(t);
            (form.elements.namedItem('thickness_unit') as HTMLSelectElement).value = 'mm';
          }}
        />

        <Row>
          <Field label="Width *">
            <input name="width" type="number" step="0.001" min="0.001" required
              defaultValue={v?.width != null ? String(v.width) : ''} className={cls} />
          </Field>
          <Field label="Unit"><Units name="width_unit" value={v?.width_unit ?? 'inch'} /></Field>
          <Field label="Thickness">
            <input name="thickness" type="number" step="0.001"
              defaultValue={v?.thickness != null ? String(v.thickness) : ''} className={cls} />
          </Field>
          <Field label="Unit"><Units name="thickness_unit" value={v?.thickness_unit ?? 'mm'} /></Field>
        </Row>

        <Row>
          <Field label="Size SKU">
            <input name="sku" defaultValue={v?.sku ?? ''} className={cls} />
          </Field>
          <Field label="Rabbet depth">
            <input name="rabbet_depth" type="number" step="0.001"
              defaultValue={v?.rabbet_depth != null ? String(v.rabbet_depth) : ''} className={cls} />
          </Field>
          <Field label="Profile height">
            <input name="height" type="number" step="0.001"
              defaultValue={v?.height != null ? String(v.height) : ''} className={cls} />
          </Field>
          <Field label="Unit"><Units name="dimension_unit" value={v?.dimension_unit ?? 'mm'} /></Field>
        </Row>

        <Row>
          <Field label={`${humanise(noun)} length`}>
            <input name="stick_length" type="number" step="0.001"
              defaultValue={v?.stick_length != null ? String(v.stick_length) : ''} className={cls} />
          </Field>
          <Field label="Unit"><Units name="stick_length_unit" value={v?.stick_length_unit ?? 'ft'} /></Field>
          <Field label={`${humanise(noun)}s per bundle`}>
            <input name="sticks_per_bundle" type="number" min="1"
              defaultValue={v?.sticks_per_bundle ?? ''} className={cls} />
          </Field>
          <Field label="Length per bundle">
            <input name="length_per_bundle" type="number" step="0.001"
              defaultValue={v?.length_per_bundle != null ? String(v.length_per_bundle) : ''} className={cls} />
          </Field>
        </Row>

        <Row>
          <Field label={`${humanise(noun)}s per pack`}>
            <input name="pieces_per_pack" type="number" min="1"
              defaultValue={v?.pieces_per_pack ?? ''} className={cls} />
          </Field>
          <Field label="Coverage per pack">
            <input name="coverage_per_pack" type="number" step="0.001"
              defaultValue={v?.coverage_per_pack != null ? String(v.coverage_per_pack) : ''} className={cls} />
          </Field>
          <Field label="Coverage unit">
            <select name="coverage_unit" defaultValue={v?.coverage_unit ?? 'sqft'} className={cls}>
              {COVERAGE_UNITS.map((u) => (
                <option key={u} value={u}>{u === 'sqft' ? 'ft²' : 'm²'}</option>
              ))}
            </select>
          </Field>
          <Field label="Weight (kg)">
            <input name="weight_kg" type="number" step="0.001"
              defaultValue={v?.weight_kg != null ? String(v.weight_kg) : ''} className={cls} />
          </Field>
        </Row>

        <Row>
          <Field label="Wear layer (microns)">
            <input name="wear_layer_microns" type="number" min="0"
              defaultValue={v?.wear_layer_microns ?? ''} className={cls} />
          </Field>
          <Field label="AC rating">
            <select name="ac_rating" defaultValue={v?.ac_rating ?? ''} className={cls}>
              <option value="">—</option>
              {AC_RATINGS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Density (kg/m³)">
            <input name="density_kg_m3" type="number" step="0.01"
              defaultValue={v?.density_kg_m3 != null ? String(v.density_kg_m3) : ''} className={cls} />
          </Field>
          <Field label="Minimum order">
            <input name="moq" type="number" step="0.01"
              defaultValue={v?.moq != null ? String(v.moq) : ''} className={cls} />
          </Field>
        </Row>

        <Row>
          <Field label="Price">
            <input name="price" type="number" step="0.01" min="0"
              defaultValue={v?.price != null ? String(v.price) : ''} className={cls} />
          </Field>
          <Field label="Priced">
            <select name="pricing_basis"
              defaultValue={v?.pricing_basis ?? defaultPricingBasis(productType)} className={cls}>
              {PRICING_BASES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </Field>
          <Field label="Currency">
            <input name="currency" defaultValue={v?.currency ?? 'PKR'} className={cls} />
          </Field>
          <Field label="Lead time (days)">
            <input name="lead_time_days" type="number" min="0"
              defaultValue={v?.lead_time_days ?? ''} className={cls} />
          </Field>
        </Row>

        <Row>
          <Field label="Stock status">
            <select name="stock_status" defaultValue={v?.stock_status ?? 'in_stock'} className={cls}>
              {STOCK_STATUSES.map((s) => <option key={s} value={s}>{humanise(s)}</option>)}
            </select>
          </Field>
          <Field label="Display order">
            <input name="display_order" type="number" defaultValue={v?.display_order ?? 0} className={cls} />
          </Field>
          <label style={{ display: 'flex', gap: '.5rem', alignItems: 'end', paddingBottom: '.5rem' }}>
            <input type="checkbox" name="published" defaultChecked={v ? v.published : true} />
            Show on website
          </label>
        </Row>

        {state?.error && <p role="alert" style={{ color: 'var(--error)' }}>{state.error}</p>}

        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button type="submit" disabled={pending} className="btn-primary" style={{ width: 'fit-content' }}>
            {pending ? 'Saving…' : v ? 'Update size' : 'Add size'}
          </button>
          {v && (
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

const smallBtn: React.CSSProperties = { fontSize: '.8rem', padding: '.25rem .5rem' };

/** A row of one-tap chips that fill a numeric field and its unit. */
function Presets<T extends number>({
  label, values, render, onPick
}: {
  label: string;
  values: readonly T[];
  render: (v: T) => string;
  onPick: (v: T) => void;
}) {
  return (
    <div>
      <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{label}</span>
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.4rem' }}>
        {values.map((v) => (
          <button key={v} type="button" className="btn-secondary" style={smallBtn}
            onClick={() => onPick(v)}>
            {render(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

const formBox: React.CSSProperties = {
  display: 'grid',
  gap: '.9rem',
  maxWidth: 860,
  padding: '1rem',
  border: '1px solid var(--border)',
  borderRadius: 6
};

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '.9rem' }}>
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

function Units({ name, value }: { name: string; value: string }) {
  return (
    <select name={name} defaultValue={value} className={cls}>
      {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
    </select>
  );
}
