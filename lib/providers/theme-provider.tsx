"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme-store";

/**
 * THEME PROVIDER - Manages Dark/Light Mode
 *
 * Responsibilities:
 * 1. Detect system theme preference
 * 2. Apply theme to <html> element
 * 3. Listen for system theme changes
 * 4. Handle theme transitions
 *
 * How it works:
 * - Reads theme from Zustand (persisted in localStorage)
 * - If theme is 'system', detects OS preference
 * - Applies data-theme="dark" or data-theme="light" to <html>
 * - CSS variables respond to data-theme attribute
 *
 * System Theme Detection:
 * - Uses window.matchMedia('(prefers-color-scheme: dark)')
 * - Listens for changes (user changes OS theme)
 * - Updates resolvedTheme automatically
 *
 * CSS Integration:
 * ```css
 * [data-theme="dark"] {
 *   --bg: #000;
 *   --text: #fff;
 * }
 *
 * [data-theme="light"] {
 *   --bg: #fff;
 *   --text: #000;
 * }
 * ```
 *
 * Usage:
 * Wrap your app in layout.tsx:
 * ```tsx
 * <ThemeProvider>
 *   {children}
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setResolvedTheme, resolvedTheme } = useThemeStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        setResolvedTheme(theme as "dark" | "light");
      }
    };

    // Initial theme application
    updateTheme();

    // Listen for system theme changes
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme, setResolvedTheme]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", resolvedTheme);

    // Add transition class for smooth theme changes
    document.documentElement.classList.add("theme-transition");

    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  return <>{children}</>;
}
