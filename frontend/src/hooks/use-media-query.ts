"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a media query.
 *
 * Only for trees that appear after hydration, such as the recovery results.
 * Anything server rendered should switch layouts with CSS instead, so the first
 * paint is correct rather than corrected.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Matches the Tailwind `lg` breakpoint. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 64rem)");
}
