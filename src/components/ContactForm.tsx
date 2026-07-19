'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

export default function ContactForm({ locale, dict, sku }: { locale: Locale; dict: any; sku?: string }) {
  const t = dict.form;
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(fd.entries());
    body.consent = fd.get('consent') === 'on';
    body.preferred_language = locale;
    body.source_page = typeof window !== 'undefined' ? window.location.pathname : '';
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const json = await res.json();
      setStatus(json.ok ? 'ok' : 'error');
      if (json.ok) e.currentTarget.reset();
    } catch { setStatus('error'); }
  }

  if (status === 'ok') return <p role="status" style={{ color: 'var(--deep-blue)', fontWeight: 600 }}>{t.success}</p>;

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: '.75rem', maxWidth: 520 }}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden />
      <input name="full_name" required placeholder={t.fullName + ' *'} className="admin-input" />
      <input name="company_name" placeholder={t.company} className="admin-input" />
      <input name="phone" required placeholder={t.phone + ' *'} className="admin-input" />
      <input name="email" type="email" placeholder={t.email} className="admin-input" />
      <input name="city" required placeholder={t.city + ' *'} className="admin-input" />
      <select name="customer_type" required defaultValue="" className="admin-input">
        <option value="" disabled>{t.customerType} *</option>
        <option value="retailer">Retailer</option>
        <option value="wholesale_buyer">Wholesale Buyer</option>
        <option value="architect_designer">Architect / Designer</option>
        <option value="professional_framer">Professional Framer</option>
        <option value="contractor_project">Contractor / Project</option>
        <option value="homeowner">Homeowner</option>
        <option value="other">Other</option>
      </select>
      <select name="product_interest" required defaultValue="" className="admin-input">
        <option value="" disabled>{t.productInterest} *</option>
        <option value="zzmolding">ZZMOLDING</option>
        <option value="zzdecor">ZZDECOR</option>
        <option value="both">Both Brands</option>
      </select>
      <input name="product_sku" defaultValue={sku ?? ''} placeholder={t.sku} className="admin-input" />
      <input name="quantity" placeholder={t.quantity} className="admin-input" />
      <textarea name="message" required rows={4} placeholder={t.message + ' *'} className="admin-input" />
      <label style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', fontSize: '.9rem' }}>
        <input type="checkbox" name="consent" required /> <span>{t.consent}</span>
      </label>
      {status === 'error' && <p role="alert" style={{ color: 'var(--error)' }}>{t.error}</p>}
      <button className="btn-primary" disabled={status === 'sending'} style={{ width: 'fit-content' }}>
        {status === 'sending' ? '…' : t.submit}
      </button>
    </form>
  );
}