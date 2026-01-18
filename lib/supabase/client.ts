import { createBrowserClient } from "@supabase/ssr";

/**
 * CLIENT-SIDE Supabase Client
 *
 * Why we need this:
 * - Used in React components (client-side only)
 * - Handles cookie-based session management automatically
 * - Persists auth state across page refreshes
 *
 * Security:
 * - Uses NEXT_PUBLIC_ env vars (safe to expose to browser)
 * - Anon key is safe - RLS policies protect your data
 * - Sessions stored in httpOnly cookies (protected from XSS)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
