import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EnquiriesPage() {
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  if (!can.manageEnquiries(user)) return <p>Not authorised.</p>;

  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('id, full_name, city, product_interest, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 style={{ color: 'var(--deep-blue)' }}>Enquiries</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
            <th style={{ padding: '.5rem' }}>Date</th><th>Name</th><th>City</th><th>Interest</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(enquiries ?? []).map((e: any) => (
            <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '.5rem' }}>{new Date(e.created_at).toLocaleDateString()}</td>
              <td><Link href={`/admin/enquiries/${e.id}`}>{e.full_name}</Link></td>
              <td>{e.city}</td>
              <td>{e.product_interest}</td>
              <td>{e.status}</td>
            </tr>
          ))}
          {(!enquiries || enquiries.length === 0) && (
            <tr><td colSpan={5} style={{ padding: '1rem', color: 'var(--grey)' }}>No enquiries yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
