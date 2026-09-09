import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { primaryImage } from "@/lib/media";
import type { CategoryProduct } from "@/lib/catalogue/queries";

export default function CategoryProductCard({
  product,
  locale,
}: {
  product: CategoryProduct;
  locale: Locale;
}) {
  const ur = locale === "ur";
  const image = primaryImage(product.product_images);
  const material = product.core_material ?? product.material;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="product-card category-product-card"
    >
      <div className="product-card__image">
        {image ? (
          <Image
            src={image}
            alt={product.name_en}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="category-product-card__fallback">
            {ur ? "تصویر تیار ہو رہی ہے" : "Image being prepared"}
          </div>
        )}
      </div>
      <div className="product-card__copy">
        <p className="atelier-section-label" style={{ margin: 0 }}>
          ZZ GROUP
        </p>
        <h2>{ur && product.name_ur ? product.name_ur : product.name_en}</h2>
        <p>
          SKU: <span className="ltr">{product.sku}</span>
          {material ? ` · ${material}` : ""}
        </p>
      </div>
    </Link>
  );
}
