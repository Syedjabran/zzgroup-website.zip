'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { saveVariant, deleteVariant } from './product-actions';
import {
  LENGTH_UNITS,
  STOCK_STATUSES,
  WIDTH_PRESETS_INCHES,
  formatWidth,
  humanise
} from './catalogue-options';

export interface Variant {
  id: string;
  sku: string | null;
  width: number | string;
  width_unit: string;
  rabbet_depth: number | string | null;
  height: number | string | null;
  dimension_unit: string;
  stick_length: number | string | null;
  stick_length_unit: string;
  sticks_per_bundle: number | null;
  length_per_bundle: number | string | null;
  price_per_foot: number | string | null;
  price_per_metre: number | string | null;
  currency: string;
  moq: number | string | null;
  stock_status: string;
  lead_time_days: number | null;
  display_order: number;
  published: boolean;
}

const input = 'admin-input';

/**
 * Sizes for one moulding series. Each row is a face width with its own SKU,
 * rabbet depth and price — the list the customer picks from on the product
 * page.
 */
export default function VariantEditor({
  productId,
  variants
}: {
  productId: string;
  variants: Variant[];
}) {
  const [state, action, pending] = useActionState(saveVariant, undefined);
  const [editing, setEditing] = useState<Variant | null>(null);
  const [deletingId, startDelete] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form once a save succeeds.
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setEditing(null);
    }
  }, [state]);

  const v = editing;
  const sorted = [...variants].sort((a, b) => Number(a.width) - Number(b.width));

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2 style={{ color: 'var(--deep-blue)', marginBottom: '.25rem' }}>Sizes</h2>
      <p style={{ color: 'var(--grey)', fontSize: '.9rem', marginTop: 0 }}>
        One row per face width. Rabbet depth decides what glass, mat and backing
        the frame can hold, so it is worth filling in.
      </p>

      {sorted.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '.4rem' }}>Width</th>
              <th>SKU</th>
              <th>Rabbet</th>
              <th>Price/ft</th>
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
                <td>{row.sku ?? '—'}</td>
                <td>{row.rabbet_depth ? `${row.rabbet_depth}${row.dimension_unit}` : '—'}</td>
                <td>{row.price_per_foot ? `${row.currency} ${row.price_per_foot}` : '—'}</td>
                <td>{humanise(row.stock_status)}</td>
                <td style={{ color: row.published ? 'var(--sky)' : 'var(--grey)' }}>
                  {row.published ? 'Live' : 'Hidden'}
                </td>
                <td style={{ display: 'flex', gap: '.4rem', padding: '.4rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '.8rem', padding: '.25rem .5rem' }}
                    onClick={() => setEditing(row)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '.8rem', padding: '.25rem .5rem', color: 'var(--error)' }}
                    disabled={deletingId}
                    onClick={() => {
                      if (!confirm(`Remove the ${formatWidth(row.width, row.width_unit)} size?`)) return;
                      startDelete(() => void deleteVariant(row.id, productId));
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form
        ref={formRef}
        action={action}
        key={v?.id ?? 'new'}
        style={{
          display: 'grid',
          gap: '.9rem',
          maxWidth: 720,
          padding: '1rem',
          border: '1px solid var(--border)',
          borderRadius: 6
        }}
      >
        <input type="hidden" name="product_id" value={productId} />
        {v?.id && <input type="hidden" name="id" defaultValue={v.id} />}

        <strong>{v ? `Edit ${formatWidth(v.width, v.width_unit)}` : 'Add a size'}</strong>

        <div>
          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Common widths</span>
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.4rem' }}>
            {WIDTH_PRESETS_INCHES.map((w) => (
              <button
                key={w}
                type="button"
                className="btn-secondary"
                style={{ fontSize: '.85rem', padding: '.25rem .6rem' }}
                onClick={() => {
                  const form = formRef.current;
                  if (!form) return;
                  (form.elements.namedItem('width') as HTMLInputElement).value = String(w);
                  (form.elements.namedItem('width_unit') as HTMLSelectElement).value = 'inch';
                }}
              >
                {formatWidth(w, 'inch')}
              </button>
            ))}
          </div>
        </div>

        <Row>
          <Field label="Face width *">
            <input name="width" type="number" step="0.001" min="0.001" required
              defaultValue={v?.width != null ? String(v.width) : ''} className={input} />
          </Field>
          <Field label="Unit">
            <Units name="width_unit" value={v?.width_unit ?? 'inch'} />
          </Field>
          <Field label="Size SKU">
            <input name="sku" defaultValue={v?.sku ?? ''} className={input} />
          </Field>
        </Row>

        <Row>
          <Field label="Rabbet depth">
            <input name="rabbet_depth" type="number" step="0.001"
              defaultValue={v?.rabbet_depth != null ? String(v.rabbet_depth) : ''} className={input} />
          </Field>
          <Field label="Profile height">
            <input name="height" type="number" step="0.001"
              defaultValue={v?.height != null ? String(v.height) : ''} className={input} />
          </Field>
          <Field label="Unit for both">
            <Units name="dimension_unit" value={v?.dimension_unit ?? 'mm'} />
          </Field>
        </Row>

        <Row>
          <Field label="Stick length">
            <input name="stick_length" type="number" step="0.001"
              defaultValue={v?.stick_length != null ? String(v.stick_length) : ''} className={input} />
          </Field>
          <Field label="Unit">
            <Units name="stick_length_unit" value={v?.stick_length_unit ?? 'ft'} />
          </Field>
          <Field label="Sticks per bundle">
            <input name="sticks_per_bundle" type="number" min="1"
              defaultValue={v?.sticks_per_bundle ?? ''} className={input} />
          </Field>
        </Row>

        <Row>
          <Field label="Length per bundle">
            <input name="length_per_bundle" type="number" step="0.001"
              defaultValue={v?.length_per_bundle != null ? String(v.length_per_bundle) : ''} className={input} />
          </Field>
          <Field label="Minimum order">
            <input name="moq" type="number" step="0.01"
              defaultValue={v?.moq != null ? String(v.moq) : ''} className={input} />
          </Field>
          <Field label="Lead time (days)">
            <input name="lead_time_days" type="number" min="0"
              defaultValue={v?.lead_time_days ?? ''} className={input} />
          </Field>
        </Row>

        <Row>
          <Field label="Price per foot">
            <input name="price_per_foot" type="number" step="0.01" min="0"
              defaultValue={v?.price_per_foot != null ? String(v.price_per_foot) : ''} className={input} />
          </Field>
          <Field label="Price per metre">
            <input name="price_per_metre" type="number" step="0.01" min="0"
              defaultValue={v?.price_per_metre != null ? String(v.price_per_metre) : ''} className={input} />
          </Field>
          <Field label="Currency">
            <input name="currency" defaultValue={v?.currency ?? 'PKR'} className={input} />
          </Field>
        </Row>

        <Row>
          <Field label="Stock status">
            <select name="stock_status" defaultValue={v?.stock_status ?? 'in_stock'} className={input}>
              {STOCK_STATUSES.map((s) => (
                <option key={s} value={s}>{humanise(s)}</option>
              ))}
            </select>
          </Field>
          <Field label="Display order">
            <input name="display_order" type="number" defaultValue={v?.display_order ?? 0} className={input} />
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

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '.9rem' }}>
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
    <select name={name} defaultValue={value} className={input}>
      {LENGTH_UNITS.map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  );
}
