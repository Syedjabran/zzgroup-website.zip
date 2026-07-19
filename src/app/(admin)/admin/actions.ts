'use server';

import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function signInAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Incorrect email or password.' };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user!.id);

  if (!roles || roles.length === 0) {
    await supabase.auth.signOut();
    return { error: 'This account is not authorised for the admin portal.' };
  }

  redirect('/admin');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}