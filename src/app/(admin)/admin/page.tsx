import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function count(table: string, filters: Record<string, unknown> = {}) {
  const supabase = await createClient();
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');

  const [published, drafts, newEnquiries] = await Promise.all([
    can.manageCatalogue(user) ? count('products', { published: true, archived: false }) : 0,
    can.manageCatalogue(user) ? count('products', { published: false, archived: false }) : 0,
    can.manageEnquiries(user) ? count('enquiries', { status: 'new' }) : 0
  ]);

  const cards = [
    { label: 'Published products', value: published, href: '/admin/products' },
    { label: 'Draft products', value: drafts, href: '/admin/products' },
    { label: 'New enquiries', value: newEnquiries, href: '/admin/enquiries' }
  ];

  return (
    <div>
      <h1 style={{ color: 'var(--deep-blue)' }}>Dashboard</h1>
      <p style={{ color: 'var(--grey)' }}>Welcome back, {user.email}.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', textDecoration: 'none', color: 'var(--charcoal)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--sky)' }}>{c.value}</div>
            <div style={{ color: 'var(--grey)' }}>{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}