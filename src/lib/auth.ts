import 'server-only';
import { createClient } from './supabase-server';
import type { Locale } from './i18n';

export type AppRole = 'owner' | 'admin' | 'catalogue_manager' | 'enquiry_manager';

export interface StaffUser {
  id: string;
  email: string | null;
  roles: AppRole[];
}

/**
 * Returns the signed-in staff user with their roles, or null.
 * Roles are read from public.user_roles (RLS: a user can read their own).
 */
export async function getStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleRows } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const roles = (roleRows ?? []).map((r) => r.role as AppRole);
  if (roles.length === 0) return null; // authenticated but not staff

  return { id: user.id, email: user.email ?? null, roles };
}

export const can = {
  manageCatalogue: (u: StaffUser) =>
    u.roles.some((r) => ['owner', 'admin', 'catalogue_manager'].includes(r)),
  manageEnquiries: (u: StaffUser) =>
    u.roles.some((r) => ['owner', 'admin', 'enquiry_manager'].includes(r)),
  manageUsers: (u: StaffUser) => u.roles.includes('owner'),
  manageSettings: (u: StaffUser) => u.roles.some((r) => ['owner', 'admin'].includes(r))
};

export const adminLocale: Locale = 'en';
