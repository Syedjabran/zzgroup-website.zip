// ============================================================================
// PASTE THIS INTO THE EXISTING FILE:
//   src/app/(admin)/admin/page.tsx
//
// This is the admin DASHBOARD, not the products list.
// The products list lives at src/app/(admin)/admin/products/page.tsx
// and must not be pasted here.
// ============================================================================

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');

  const supabase = await createClient();
  const catalogue = can.manageCatalogue(user);
  const enquiries = can.manageEnquiries(user);

  const [live, drafts, binned, sizes, newEnquiries, openEnquiries] = await Promise.all([
    catalogue
      ? supabase.from('products').select('id', { count: 'exact', head: true }).eq('archived', false).eq('published', true)
      : Promise.resolve({ count: null }),
    catalogue
      ? supabase.from('products').select('id', { count: 'exact', head: true }).eq('archived', false).eq('published', false)
      : Promise.resolve({ count: null }),
    catalogue
      ? supabase.from('products').select('id', { count: 'exact', head: true }).eq('archived', true)
      : Promise.resolve({ count: null }),
    catalogue
      ? supabase.from('product_variants').select('id', { count: 'exact', head: true })
      : Promise.resolve({ count: null }),
    enquiries
      ? supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new')
      : Promise.resolve({ count: null }),
    enquiries
      ? supabase.from('enquiries').select('id', { count: 'exact', head: true }).in('status', ['new', 'contacted', 'qualified'])
      : Promise.resolve({ count: null })
  ]);

  return (
    <div>
      <h1 style={{ color: 'var(--deep-blue)' }}>Dashboard</h1>
      <p style={{ color: 'var(--grey)', marginTop: '-.5rem' }}>
        Signed in as {user.email}
      </p>

      {catalogue && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', color: 'var(--deep-blue)' }}>Catalogue</h2>
          <div style={grid}>
            <Stat label="Published" value={live.count} href="/admin/products" />
            <Stat label="Drafts" value={drafts.count} href="/admin/products" />
            <Stat label="Sizes" value={sizes.count} href="/admin/products" />
            <Stat label="Recycle bin" value={binned.count} href="/admin/products?view=archived" />
          </div>
          <Link href="/admin/products/new" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            + New product
          </Link>
        </section>
      )}

      {enquiries && (
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.05rem', color: 'var(--deep-blue)' }}>Enquiries</h2>
          <div style={grid}>
            <Stat label="New" value={newEnquiries.count} href="/admin/enquiries" />
            <Stat label="Open" value={openEnquiries.count} href="/admin/enquiries" />
          </div>
        </section>
      )}

      {!catalogue && !enquiries && (
        <p style={{ marginTop: '1.5rem' }}>
          Your account has no sections assigned yet. Ask an owner to grant a role.
        </p>
      )}
    </div>
  );
}

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '.75rem',
  marginTop: '.75rem'
};

function Stat({ label, value, href }: { label: string; value: number | null; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '1rem',
        border: '1px solid var(--border)',
        borderRadius: 6,
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--deep-blue)', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      <div style={{ color: 'var(--grey)', fontSize: '.85rem', marginTop: '.35rem' }}>{label}</div>
    </Link>
  );
}
