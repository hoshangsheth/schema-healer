"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";

import { createQueryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/shared/toast";

/**
 * Client providers.
 *
 * `MotionConfig reducedMotion="user"` makes every Framer Motion animation in
 * the tree honour the OS preference without each component checking.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Created lazily so the client is never shared across requests on the server.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <ToastProvider>{children}</ToastProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
