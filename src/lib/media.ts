/** Public URL for a file in the public `product-media` bucket. */
export function mediaUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/product-media/${storagePath}`;
}

/** Pick the primary image (or first available) from a product_images relation. */
export function primaryImage(
  images: { storage_path: string; is_primary?: boolean | null }[] | null | undefined
): string | null {
  if (!images || images.length === 0) return null;
  const primary = images.find((i) => i.is_primary) ?? images[0];
  return primary ? mediaUrl(primary.storage_path) : null;
}
