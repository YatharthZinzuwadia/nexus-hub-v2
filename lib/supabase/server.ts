import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * SERVER-SIDE Supabase Client
 *
 * Why we need this:
 * - Used in Server Components, Server Actions, Route Handlers
 * - Reads/writes cookies using Next.js cookies() API
 * - Enables SSR with authenticated state
 *
 * Cookie Management:
 * - getAll(): Read all cookies (for auth state)
 * - setAll(): Write cookies (for session updates)
 * - Cookies are httpOnly, secure, sameSite=lax
 *
 * Usage:
 * - Server Components: const supabase = await createClient()
 * - Server Actions: const supabase = await createClient()
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
