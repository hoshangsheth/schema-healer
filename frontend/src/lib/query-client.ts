import { QueryClient } from "@tanstack/react-query";

/**
 * Recovery runs are expensive (they can invoke an LLM), so results are kept
 * fresh for the lifetime of the session rather than refetched opportunistically.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Client errors (bad file, unsupported type) are never retried.
          const status = (error as { status?: number } | null)?.status;
          if (typeof status === "number" && status >= 400 && status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
