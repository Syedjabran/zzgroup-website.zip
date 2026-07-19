import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server client bound to the request's auth cookies (RLS-scoped to the
 * signed-in user). Use in Server Components, Route Handlers, Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* called from a Server Component render — safe to ignore */
          }
        }
      }
    }
  );
}
