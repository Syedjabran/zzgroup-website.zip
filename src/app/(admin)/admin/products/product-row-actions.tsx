'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import {
  togglePublish,
  deleteProduct,
  restoreProduct,
  deleteProductForever
} from './product-actions';

/**
 * Row controls for the product list.
 *
 * Delete is a soft delete — the product moves to the recycle bin and can be
 * restored. Only "Delete forever" destroys data, and it asks twice.
 */
export default function ProductRowActions({
  id,
  name,
  published,
  archived
}: {
  id: string;
  name: string;
  published: boolean;
  archived: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) => startTransition(() => void fn());

  const btn: React.CSSProperties = {
    fontSize: '.85rem',
    padding: '.3rem .6rem',
    cursor: pending ? 'wait' : 'pointer'
  };

  if (archived) {
    return (
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-secondary"
          style={btn}
          disabled={pending}
          onClick={() => run(() => restoreProduct(id))}
        >
          Restore
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ ...btn, color: 'var(--error)', borderColor: 'var(--error)' }}
          disabled={pending}
          onClick={() => {
            if (!confirm(`Permanently delete "${name}"?\n\nIts images, sizes and gallery links are removed. This cannot be undone.`)) return;
            if (!confirm('Last check — delete forever?')) return;
            run(() => deleteProductForever(id));
          }}
        >
          Delete forever
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
      <Link href={`/admin/products/${id}`} className="btn-secondary" style={btn}>
        Edit
      </Link>
      <button
        type="button"
        className="btn-secondary"
        style={btn}
        disabled={pending}
        onClick={() => run(() => togglePublish(id, !published))}
      >
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <button
        type="button"
        className="btn-secondary"
        style={btn}
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete "${name}"?\n\nIt is removed from the website and kept in the recycle bin.`)) return;
          run(() => deleteProduct(id));
        }}
      >
        Delete
      </button>
    </div>
  );
}
