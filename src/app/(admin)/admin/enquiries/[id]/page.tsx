import { createClient } from '@/lib/supabase-server';
import { getStaffUser, can } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const STATUSES = ['new','contacted','qualified','quotation_prepared','quotation_sent','won','lost','closed','spam'];

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getStaffUser();
  if (!user) redirect('/admin/login');
  if (!can.manageEnquiries(user)) return <p>Not authorised.</p>;

  const supabase = await createClient();
  const { data: e } = await supabase.from('enquiries').select('*').eq('id', id).single();
  if (!e) notFound();

  async function updateStatus(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const u = await getStaffUser();
    if (!u || !can.manageEnquiries(u)) return;
    await supabase.from('enquiries')
      .update({ status: String(formData.get('status')), internal_notes: String(formData.get('notes') ?? '') })
      .eq('id', id);
    revalidatePath(`/admin/enquiries/${id}`);
  }

  const waDigits = (e.phone ?? '').replace(/[^\d]/g, '');

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ color: 'var(--deep-blue)' }}>{e.full_name}</h1>
      <p style={{ color: 'var(--grey)' }}>{new Date(e.created_at).toLocaleString()}</p>

      <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: '.4rem' }}>
        <dt>Phone</dt><dd>{e.phone} {waDigits && <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer" style={{ color: 'var(--whatsapp)' }}>WhatsApp</a>}</dd>
        <dt>Email</dt><dd>{e.email ?? '—'}</dd>
        <dt>Company</dt><dd>{e.company_name ?? '—'}</dd>
        <dt>City</dt><dd>{e.city}</dd>
        <dt>Customer type</dt><dd>{e.customer_type}</dd>
        <dt>Interest</dt><dd>{e.product_interest}</dd>
        <dt>SKU</dt><dd>{e.product_sku ?? '—'}</dd>
        <dt>Quantity</dt><dd>{e.quantity ?? '—'}</dd>
        <dt>Message</dt><dd>{e.message}</dd>
      </dl>

      <form action={updateStatus} style={{ display: 'grid', gap: '.75rem', marginTop: '1.5rem', maxWidth: 360 }}>
        <label style={{ display: 'grid', gap: '.3rem' }}>
          <span style={{ fontWeight: 600 }}>Status</span>
          <select name="status" defaultValue={e.status} className="admin-input">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label style={{ display: 'grid', gap: '.3rem' }}>
          <span style={{ fontWeight: 600 }}>Internal notes</span>
          <textarea name="notes" defaultValue={e.internal_notes ?? ''} rows={3} className="admin-input" />
        </label>
        <button className="btn-primary" style={{ width: 'fit-content' }}>Save</button>
      </form>
    </div>
  );
}