export default function CategoryLoading() {
  return (
    <div className="container page-content" aria-live="polite" aria-busy="true">
      <div className="category-loading-block" />
      <div className="category-loading-grid">
        <span />
        <span />
        <span />
      </div>
      <p>Loading collection…</p>
    </div>
  );
}
