import { create } from "zustand";
import { User } from "@supabase/supabase-js";

/**
 * AUTH STORE - Zustand State Management
 *
 * Philosophy:
 * - Zustand is a MIRROR of Supabase session state
 * - NOT the source of truth (Supabase cookies are)
 * - Used for UI reactivity (show/hide elements based on auth)
 *
 * State:
 * - user: Current authenticated user (null if not logged in)
 * - loading: True during initial auth check
 *
 * Actions:
 * - setUser: Update user state
 * - setLoading: Update loading state
 * - clearUser: Clear user on logout
 *
 * Usage in components:
 * ```tsx
 * const { user, loading } = useAuthStore()
 *
 * if (loading) return <Spinner />
 * if (!user) return <LoginPrompt />
 * return <Dashboard user={user} />
 * ```
 *
 * Why not Redux?
 * - Zustand is simpler, less boilerplate
 * - Perfect for small state like auth
 * - No providers needed
 * - Better TypeScript support out of the box
 */

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  setLoading: (loading) => set({ loading }),

  clearUser: () => set({ user: null, loading: false }),
}));
