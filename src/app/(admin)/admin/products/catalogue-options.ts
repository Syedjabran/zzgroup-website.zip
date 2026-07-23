/**
 * Catalogue option lists and field-visibility rules.
 *
 * Plain module — a 'use server' file may only export async functions, so these
 * live here and are imported by both the server actions and the client forms.
 *
 * Every list is a suggestion, not a constraint. The columns are text and the
 * form offers "Other…", so staff can enter a value without waiting on a
 * migration. Only product_type, pricing_basis, stock_status and the length
 * units are real Postgres enums.
 */

// ---------------------------------------------------------------------------
// PRODUCT TYPES — these drive which spec groups the form shows
// ---------------------------------------------------------------------------

export const PRODUCT_TYPES = [
  { value: 'frame_moulding', label: 'Frame moulding' },
  { value: 'wall_panel', label: 'Wall panel (PVC / WPC / fluted)' },
  { value: 'cladding', label: 'Exterior cladding' },
  { value: 'flooring', label: 'Flooring (SPC / WPC / laminate / engineered)' },
  { value: 'sheet', label: 'Sheet (PVC / marble / onyx / UV)' },
  { value: 'trim', label: 'Skirting, cornice or trim' },
  { value: 'accessory', label: 'Accessory' }
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number]['value'];

export const PRODUCT_TYPE_VALUES = PRODUCT_TYPES.map((t) => t.value);

// ---------------------------------------------------------------------------
// SHARED SPECS
// ---------------------------------------------------------------------------

export const CORE_MATERIALS = [
  'Solid wood', 'MDF', 'HDF', 'Plywood', 'Polystyrene (PS)', 'Polyurethane (PU)',
  'PVC', 'WPC', 'SPC', 'Vinyl', 'Aluminium', 'Resin composite',
  'Marble', 'Onyx', 'Bamboo', 'Cork'
] as const;

export const SURFACE_FINISHES = [
  'Matte', 'Satin', 'Semi-gloss', 'High gloss', 'Embossed',
  'Embossed in register (EIR)', 'Wood grain', 'UV coated', 'Laminated',
  'Brushed', 'Distressed / antique', 'Gold leaf', 'Silver leaf',
  'Marble look', 'Soft touch', 'Metallic'
] as const;

export const SURFACE_TEXTURES = [
  'Smooth', 'Wood grain', 'Hand-scraped', 'Wire brushed', 'Stone',
  'Fluted', 'Ribbed', 'Louvre', '3D relief', 'Matte emboss'
] as const;

export const COLOUR_FAMILIES = [
  'White', 'Off-white / ivory', 'Beige', 'Grey', 'Charcoal', 'Black',
  'Natural oak', 'Walnut', 'Teak', 'Mahogany', 'Cherry', 'Ash', 'Maple',
  'Gold', 'Silver / chrome', 'Bronze', 'Copper',
  'Marble white', 'Marble black', 'Onyx'
] as const;

export const APPLICATION_AREAS = [
  'Interior wall', 'Ceiling', 'Exterior facade', 'Floor', 'Wet area / bathroom',
  'Kitchen', 'Commercial', 'Residential', 'Hospitality', 'Furniture'
] as const;

export const WATER_RESISTANCE = [
  '100% waterproof', 'Water resistant', 'Splash resistant', 'Interior dry areas only'
] as const;

export const FIRE_RATINGS = ['Class A / B1', 'Class B', 'Class C', 'Not rated'] as const;

export const CERTIFICATIONS = [
  'CE', 'ISO 9001', 'ISO 14001', 'SGS tested', 'FloorScore',
  'E0 formaldehyde', 'E1 formaldehyde', 'FSC', 'RoHS', 'GreenGuard'
] as const;

export const INSTALLATION_METHODS = [
  'Click lock', 'Tongue & groove', 'Glue down', 'Nail down', 'Floating',
  'Adhesive / silicone', 'Screw fixed', 'Interlocking', 'Loose lay', 'Clip system'
] as const;

// ---------------------------------------------------------------------------
// TYPE-SPECIFIC
// ---------------------------------------------------------------------------

/** Mouldings and trims. */
export const PROFILE_SHAPES = [
  'flat', 'scoop', 'ogee', 'cap', 'bevel', 'reverse_bevel', 'swan', 'floater', 'other'
] as const;

export const SUITABLE_FOR = ['canvas', 'photo', 'mirror', 'certificate', 'art'] as const;

/** Flooring plank edges. */
export const EDGE_PROFILES = [
  'Square edge', 'Micro-bevel', 'Bevelled', 'Painted bevel', 'Bullnose', 'Tongue & groove'
] as const;

/** Laminate abrasion class. AC3 domestic heavy, AC4–AC5 commercial. */
export const AC_RATINGS = ['AC1', 'AC2', 'AC3', 'AC4', 'AC5', 'AC6'] as const;

// ---------------------------------------------------------------------------
// COMMERCIAL
// ---------------------------------------------------------------------------

export const LENGTH_UNITS = ['mm', 'cm', 'm', 'inch', 'ft'] as const;

export const STOCK_STATUSES = [
  'in_stock', 'low_stock', 'made_to_order', 'out_of_stock', 'discontinued'
] as const;

export const PRICING_BASES = [
  { value: 'running_foot', label: 'per running foot' },
  { value: 'square_foot', label: 'per ft²' },
  { value: 'running_metre', label: 'per running metre' },
  { value: 'square_metre', label: 'per m²' },
  { value: 'piece', label: 'per piece' },
  { value: 'pack', label: 'per pack' },
  { value: 'set', label: 'per set' }
] as const;

export const PRICING_BASIS_VALUES = PRICING_BASES.map((b) => b.value);

export const COVERAGE_UNITS = ['sqft', 'sqm'] as const;

/** Flooring sells by area, sheets by the piece, everything else by length. */
export function defaultPricingBasis(type: string): string {
  if (type === 'flooring') return 'square_foot';
  if (type === 'sheet' || type === 'accessory') return 'piece';
  return 'running_foot';
}

export function priceLabel(basis: string): string {
  return PRICING_BASES.find((b) => b.value === basis)?.label ?? basis;
}

/** "Stick", "plank", "sheet" or "panel" depending on what is being sold. */
export function pieceNoun(type: string): string {
  if (type === 'flooring') return 'plank';
  if (type === 'frame_moulding' || type === 'trim') return 'stick';
  if (type === 'sheet') return 'sheet';
  return 'panel';
}

// ---------------------------------------------------------------------------
// FIELD VISIBILITY
// ---------------------------------------------------------------------------

const MOULDING_LIKE = ['frame_moulding', 'trim'];
const AREA_SOLD = ['wall_panel', 'cladding', 'flooring', 'sheet'];
const INSTALLED = ['wall_panel', 'cladding', 'flooring', 'sheet', 'trim'];

/** Profile shape, rabbet depth, "suitable for". */
export const showsProfile = (t: string) => MOULDING_LIKE.includes(t);

/** Wear layer, AC rating, edge profile. */
export const showsFlooring = (t: string) => t === 'flooring';

/** Coverage per pack, pieces per pack. */
export const showsCoverage = (t: string) => AREA_SOLD.includes(t);

/** Installation method, water resistance, fire rating. */
export const showsInstallation = (t: string) => INSTALLED.includes(t);

/** Density — WPC, SPC and composite boards. */
export const showsDensity = (t: string) => AREA_SOLD.includes(t);

// ---------------------------------------------------------------------------
// FORMATTING
// ---------------------------------------------------------------------------

export const WIDTH_PRESETS_INCHES = [0.5, 0.75, 1, 1.5, 2, 3.5] as const;

export const FRACTION_LABELS: Record<string, string> = {
  '0.25': '¼', '0.5': '½', '0.75': '¾',
  '1.25': '1¼', '1.5': '1½', '1.75': '1¾',
  '2.5': '2½', '3.5': '3½'
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
