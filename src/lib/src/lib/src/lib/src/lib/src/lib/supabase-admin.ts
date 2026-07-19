import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * SERVICE-ROLE client. Bypasses RLS. Import ONLY in trusted server code.
 * The `server-only` import makes the build fail if it ever reaches the client.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
