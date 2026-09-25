"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

const subscribeNever = () => () => {};

/**
 * Action bar pinned to the bottom of the viewport on touch screens.
 *
 * Keeps the primary action in the thumb zone on a long page instead of making
 * people scroll back to find it. Hidden from large screens, where the action is
 * already visible in place.
 */
export function StickyBar({
  children,
  className,
  /** Reveal only after this fraction of the viewport has been scrolled. */
  revealAfterViewports = 0.8,
  /** Hide again once this element scrolls into view, so it never covers it. */
  hideNearId,
}: {
  children: ReactNode;
  className?: string;
  revealAfterViewports?: number;
  hideNearId?: string;
}) {
  const [visible, setVisible] = useState(revealAfterViewports === 0);
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const past =
      revealAfterViewports === 0 || latest > window.innerHeight * revealAfterViewports;

    let blocked = false;
    if (hideNearId) {
      const target = document.getElementById(hideNearId);
      if (target) {
        blocked = target.getBoundingClientRect().top < window.innerHeight;
      }
    }

    const next = past && !blocked;
    setVisible((current) => (current === next ? current : next));
  });

  // Reserve room only while the bar is actually on screen, so a hidden bar
  // never leaves a gap at the bottom of the page.
  useEffect(() => {
    document.body.classList.toggle("has-sticky-bar", visible);
    return () => document.body.classList.remove("has-sticky-bar");
  }, [visible]);

  if (!hydrated) return null;

  // Portalled to the body: an ancestor with a transform or filter (such as a
  // page transition) would otherwise pin the bar to itself, not the viewport.
  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className={cn(
            "fixed inset-x-0 bottom-0 z-80 border-t border-line glass-panel lg:hidden",
            "px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
