"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * AUTH PROVIDER - Syncs Supabase Session with Zustand
 *
 * Responsibilities:
 * 1. Check for existing session on mount
 * 2. Listen for auth state changes (login, logout, token refresh)
 * 3. Update Zustand store when auth state changes
 *
 * Why this is needed:
 * - Supabase manages auth in cookies (server-side)
 * - Zustand manages UI state (client-side)
 * - This component bridges the two
 *
 * Auth Events Handled:
 * - SIGNED_IN: User logged in
 * - SIGNED_OUT: User logged out
 * - TOKEN_REFRESHED: Session refreshed (happens every ~55 minutes)
 * - USER_UPDATED: User metadata changed
 *
 * Flow:
 * 1. Component mounts
 * 2. Check for existing session
 * 3. Update Zustand with user data
 * 4. Subscribe to auth changes
 * 5. Update Zustand on any change
 * 6. Cleanup subscription on unmount
 *
 * Usage:
 * Wrap your app in layout.tsx:
 * ```tsx
 * <AuthProvider>
 *   {children}
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
