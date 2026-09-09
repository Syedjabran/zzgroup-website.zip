import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="container page-content">
      <div className="category-empty-state">
        <p className="atelier-section-label">404 · Collection</p>
        <h1>Collection not found.</h1>
        <p>This collection is unavailable or the address is incorrect.</p>
        <Link href="/en/products" className="atelier-btn">
          View all collections
        </Link>
      </div>
    </div>
  );
}
