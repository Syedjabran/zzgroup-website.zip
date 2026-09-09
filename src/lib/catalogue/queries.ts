import { createClient } from "@/lib/supabase-server";
import type { CatalogueCategory, CategoryFacet } from "./categories";

export interface CategorySearchParams {
  q?: string;
  material?: string;
  colour?: string;
  finish?: string;
  texture?: string;
  page?: string;
}

export interface CategoryProduct {
  id: string;
  slug: string;
  sku: string;
  name_en: string;
  name_ur: string | null;
  core_material: string | null;
  material: string | null;
  colour_family: string | null;
  colour: string | null;
  finish: string | null;
  surface_texture: string | null;
  product_type: string | null;
  product_images: Array<{ storage_path: string; is_primary: boolean }> | null;
}

export interface CategoryResults {
  items: CategoryProduct[];
  total: number;
  unfilteredTotal: number;
  page: number;
  pageCount: number;
  facets: Record<CategoryFacet, string[]>;
  resolvedBy: "category_id" | "controlled_fallback" | "unresolved";
}

const PAGE_SIZE = 24;
const MAX_CATEGORY_ROWS = 500;

const normalise = (value: string | null | undefined) =>
  value?.trim().toLocaleLowerCase() ?? "";

function productFacet(product: CategoryProduct, facet: CategoryFacet): string {
  if (facet === "material")
    return product.core_material ?? product.material ?? "";
  if (facet === "colour") return product.colour_family ?? product.colour ?? "";
  if (facet === "finish") return product.finish ?? "";
  return product.surface_texture ?? "";
}

function facetValues(
  products: CategoryProduct[],
  facets: readonly CategoryFacet[],
): Record<CategoryFacet, string[]> {
  const result: Record<CategoryFacet, string[]> = {
    material: [],
    colour: [],
    finish: [],
    texture: [],
  };
  for (const facet of facets) {
    result[facet] = [
      ...new Set(
        products.map((product) => productFacet(product, facet)).filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }
  return result;
}

export async function getCategoryProducts(
  category: CatalogueCategory,
  searchParams: CategorySearchParams,
): Promise<CategoryResults> {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (
    !configuredUrl ||
    /your-project|placeholder|example\.(com|org)|localhost/i.test(configuredUrl)
  ) {
    return {
      items: [],
      total: 0,
      unfilteredTotal: 0,
      page: 1,
      pageCount: 1,
      facets: facetValues([], category.facets),
      resolvedBy: "unresolved",
    };
  }
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", category.division)
    .eq("published", true)
    .maybeSingle();

  if (!brand) {
    return {
      items: [],
      total: 0,
      unfilteredTotal: 0,
      page: 1,
      pageCount: 1,
      facets: facetValues([], category.facets),
      resolvedBy: "unresolved",
    };
  }

  const { data: categoryRows } = await supabase
    .from("categories")
    .select("id, slug")
    .eq("brand_id", brand.id)
    .in("slug", [...category.categoryAliases])
    .limit(1);
  const categoryRow = categoryRows?.[0];

  if (!categoryRow && !category.fallback) {
    return {
      items: [],
      total: 0,
      unfilteredTotal: 0,
      page: 1,
      pageCount: 1,
      facets: facetValues([], category.facets),
      resolvedBy: "unresolved",
    };
  }

  let query = supabase
    .from("products")
    .select(
      "id, slug, sku, name_en, name_ur, core_material, material, colour_family, colour, finish, surface_texture, product_type, product_images(storage_path, is_primary)",
    )
    .eq("brand_id", brand.id)
    .eq("published", true)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(MAX_CATEGORY_ROWS);

  if (categoryRow) {
    query = query.eq("category_id", categoryRow.id);
  } else if (category.fallback) {
    query = query.eq("product_type", category.fallback.productType);
    if (category.fallback.materialContains) {
      const value = category.fallback.materialContains.replace(/[%_,()]/g, "");
      query = query.or(
        `core_material.ilike.%${value}%,material.ilike.%${value}%`,
      );
    }
  }

  const { data, error } = await query;
  const pool = error ? [] : ((data ?? []) as unknown as CategoryProduct[]);
  const facets = facetValues(pool, category.facets);
  const queryText = normalise(searchParams.q);

  const filtered = pool.filter((product) => {
    if (
      queryText &&
      !normalise(
        `${product.name_en} ${product.name_ur ?? ""} ${product.sku}`,
      ).includes(queryText)
    )
      return false;
    if (
      searchParams.material &&
      normalise(productFacet(product, "material")) !==
        normalise(searchParams.material)
    )
      return false;
    if (
      searchParams.colour &&
      normalise(productFacet(product, "colour")) !==
        normalise(searchParams.colour)
    )
      return false;
    if (
      searchParams.finish &&
      normalise(productFacet(product, "finish")) !==
        normalise(searchParams.finish)
    )
      return false;
    if (
      searchParams.texture &&
      normalise(productFacet(product, "texture")) !==
        normalise(searchParams.texture)
    )
      return false;
    return true;
  });

  const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(
    Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
    pageCount,
  );
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    unfilteredTotal: pool.length,
    page,
    pageCount,
    facets,
    resolvedBy: categoryRow ? "category_id" : "controlled_fallback",
  };
}
