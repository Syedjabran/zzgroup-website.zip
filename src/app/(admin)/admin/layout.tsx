import { getStaffUser, can } from '@/lib/auth';
import { signOutAction } from './actions';
import Link from 'next/link';
import '../../globals.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();

  if (!user) {
    return (
      <html lang="en" dir="ltr">
        <body>{children}</body>
      </html>
    );
  }

  const nav: { href: string; label: string; show: boolean }[] = [
    { href: '/admin', label: 'Dashboard', show: true },
    { href: '/admin/products', label: 'Products', show: can.manageCatalogue(user) },
    { href: '/admin/enquiries', label: 'Enquiries', show: can.manageEnquiries(user) }
  ];

  return (
    <html lang="en" dir="ltr">
      <body style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
        <aside style={{ background: 'var(--charcoal)', color: '#fff', padding: '1.25rem' }}>
          <strong style={{ fontSize: '1.1rem' }}>ZZ Group</strong>
          <nav style={{ display: 'grid', gap: '.25rem', marginTop: '1.25rem' }}>
            {nav.filter((n) => n.show).map((n) => (
              <Link key={n.href} href={n.href} style={{ color: '#cfe0ea', padding: '.4rem 0' }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} style={{ marginTop: '2rem' }}>
            <button type="submit" style={{ color: '#cfe0ea', background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign out
            </button>
          </form>
          <p style={{ color: 'var(--grey)', fontSize: '.75rem', marginTop: '1rem' }}>
            {user.email}
            <br />
            {user.roles.join(', ')}
          </p>
        </aside>
        <main style={{ padding: '1.5rem 2rem' }}>{children}</main>
      </body>
    </html>
  );
}