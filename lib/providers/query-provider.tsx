"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * QUERY PROVIDER
 * Wraps the application with TanStack Query (React Query) context.
 *
 * Why we need this:
 * - Manages server state (caching, revalidation, sync)
 * - Persists query results across components
 * - Handles auto-refetching and loading states
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create state for QueryClient to ensure one instance per session
  // (Prevents re-creation on re-renders)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false, // Disable focus refetch by default for cleaner UI
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
