'use client';

import { useActionState } from 'react';
import { signInAction } from '../actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-soft)' }}>
      <form
        action={formAction}
        style={{
          width: 'min(92vw, 380px)',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '2rem'
        }}
      >
        <h1 style={{ margin: 0, color: 'var(--deep-blue)' }}>ZZ Group Admin</h1>
        <p style={{ color: 'var(--grey)', marginTop: '.25rem' }}>Sign in to manage the catalogue.</p>

        <label htmlFor="email" style={{ display: 'block', marginTop: '1rem', fontWeight: 600 }}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="admin-input" />

        <label htmlFor="password" style={{ display: 'block', marginTop: '.75rem', fontWeight: 600 }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-input"
        />

        {state?.error && (
          <p role="alert" style={{ color: 'var(--error)', marginTop: '.75rem' }}>
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
