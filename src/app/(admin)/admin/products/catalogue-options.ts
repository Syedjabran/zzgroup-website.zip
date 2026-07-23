/**
 * Catalogue option lists.
 *
 * Kept out of product-actions.ts because a 'use server' module may only
 * export async functions. Imported by both the server actions and the
 * client form components, so the two can never drift apart.
 *
 * These mirror the Postgres enums created in the product_variants migration.
 */

export const PROFILE_SHAPES = [
  'flat',
  'scoop',
  'ogee',
  'cap',
  'bevel',
  'reverse_bevel',
  'swan',
  'floater',
  'other'
] as const;

export const SUITABLE_FOR = ['canvas', 'photo', 'mirror', 'certificate', 'art'] as const;

export const LENGTH_UNITS = ['mm', 'cm', 'm', 'inch', 'ft'] as const;

export const STOCK_STATUSES = [
  'in_stock',
  'low_stock',
  'made_to_order',
  'out_of_stock',
  'discontinued'
] as const;

/** Face widths ZZ Group stocks, in inches. Presets only — any value is allowed. */
export const WIDTH_PRESETS_INCHES = [0.5, 0.75, 1, 1.5, 2, 3.5] as const;

export const FRACTION_LABELS: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
  '1.25': '1¼',
  '1.5': '1½',
  '1.75': '1¾',
  '2.5': '2½',
  '3.5': '3½'
};

/** 0.5 + inch -> ½"   ·   25 + mm -> 25mm */
export function formatWidth(width: number | string, unit: string): string {
  const n = Number(width);
  if (!Number.isFinite(n)) return '—';
  const key = String(Number(n.toFixed(4)));
  if (unit === 'inch') return `${FRACTION_LABELS[key] ?? key}"`;
  return `${key}${unit}`;
}

export function humanise(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
