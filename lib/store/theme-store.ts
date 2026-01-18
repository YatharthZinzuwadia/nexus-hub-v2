import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * THEME STORE - Dark/Light Mode Management
 *
 * Features:
 * - Persistent theme preference (localStorage)
 * - System preference detection
 * - Smooth theme transitions
 *
 * Modes:
 * - 'dark': Force dark mode
 * - 'light': Force light mode
 * - 'system': Follow OS preference
 *
 * Implementation:
 * - Uses Zustand persist middleware
 * - Saves to localStorage as 'nexus-theme'
 * - Applied via data-theme attribute on <html>
 *
 * Usage:
 * ```tsx
 * const { theme, setTheme } = useThemeStore()
 *
 * <button onClick={() => setTheme('dark')}>Dark</button>
 * <button onClick={() => setTheme('light')}>Light</button>
 * <button onClick={() => setTheme('system')}>System</button>
 * ```
 */

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "dark" | "light"; // Actual theme after resolving 'system'
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: "dark" | "light") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark", // Default to dark (matches your current design)
      resolvedTheme: "dark",

      setTheme: (theme) => set({ theme }),

      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: "nexus-theme", // localStorage key
    }
  )
);
