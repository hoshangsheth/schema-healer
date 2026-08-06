"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";

import { EASE_OUT } from "@/lib/motion";
import type { NavLink } from "@/lib/site";
import { ButtonLink } from "@/components/shared/button";
import { Logo } from "@/components/shared/logo";

/**
 * Slide out navigation for touch screens.
 *
 * A panel anchored to the right edge rather than a dropdown: it puts every
 * destination within thumb reach, the rows are full width tap targets, and the
 * page behind it is inert while it is open.
 */
export function NavDrawer({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock the page, move focus in, and wire up Escape and focus trapping.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            onClick={onClose}
            className="fixed inset-0 z-95 bg-ink-900/35 backdrop-blur-[2px] lg:hidden"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="fixed inset-y-0 right-0 z-100 flex w-[86%] max-w-sm flex-col bg-surface shadow-panel lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo href={null} />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex size-11 items-center justify-center rounded-xl border border-line text-ink-600 transition-colors active:bg-surface-2"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {links.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: EASE_OUT,
                      delay: 0.06 + index * 0.045,
                    }}
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={onClose}
                        className="flex min-h-14 items-center justify-between rounded-xl px-4 text-base font-medium text-ink-800 transition-colors active:bg-surface-2"
                      >
                        {link.label}
                        <ArrowUpRight className="size-4 text-ink-300" aria-hidden />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex min-h-14 items-center justify-between rounded-xl px-4 text-base font-medium text-ink-800 transition-colors active:bg-surface-2"
                      >
                        {link.label}
                        <ArrowRight className="size-4 text-ink-300" aria-hidden />
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <ButtonLink
                href="/app"
                size="lg"
                fullWidth
                className="justify-center"
                trailingIcon={<ArrowRight className="size-4" aria-hidden />}
              >
                Try SchemaHealer
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-ink-400">
                No account required
              </p>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
