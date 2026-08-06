"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileWarning, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT, springSoft } from "@/lib/motion";
import { METHOD_PRESENTATION } from "@/lib/recovery-presentation";
import type { RecoveryMethod } from "@/types/api";

/**
 * Hero product visual.
 *
 * A looping, three beat retelling of a real run: a file arrives with changed
 * column names, each one is resolved, and verification signs off. The columns
 * and field names come from the project's own mapping list, so nothing here is
 * invented.
 */

interface PreviewColumn {
  source: string;
  canonical: string;
  method: RecoveryMethod;
}

/**
 * These four column names were run through the real engine: the first two are
 * known names, the typo is caught by close matching, and `Organization` gets
 * past both and is resolved by the AI step.
 */
const COLUMNS: PreviewColumn[] = [
  { source: "Email Address", canonical: "email", method: "rule" },
  { source: "Deal Amount", canonical: "deal_value", method: "rule" },
  { source: "phne_number", canonical: "phone_number", method: "fuzzy" },
  { source: "Organization", canonical: "company_name", method: "semantic" },
];

const BEAT_MS = 2600;

export function DriftPreview() {
  const reduceMotion = useReducedMotion();
  const [beat, setBeat] = useState(reduceMotion ? 2 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setBeat((current) => (current + 1) % 3);
    }, BEAT_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const resolvedCount = beat === 0 ? 0 : beat === 1 ? COLUMNS.length : COLUMNS.length;

  return (
    <div className="relative">
      {/* Glow behind the panel. */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-200/45 via-transparent to-teal-100/60 blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
        className="relative overflow-hidden rounded-panel border border-line bg-surface shadow-panel"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-surface-2 text-ink-500">
              <FileWarning className="size-4" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="font-mono text-[0.8125rem] font-medium text-ink-800">
                crm_export_q3.csv
              </p>
              <p className="text-[0.6875rem] text-ink-400">
                {COLUMNS.length} columns · unexpected names found
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.span
              key={beat}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ring-1 ring-inset",
                beat === 0 && "bg-danger-50 text-danger-700 ring-danger-100",
                beat === 1 && "bg-brand-50 text-brand-700 ring-brand-100",
                beat === 2 && "bg-success-50 text-success-700 ring-success-100",
              )}
            >
              {beat === 0 ? <FileWarning className="size-3" aria-hidden /> : null}
              {beat === 1 ? <Sparkles className="size-3" aria-hidden /> : null}
              {beat === 2 ? <ShieldCheck className="size-3" aria-hidden /> : null}
              {beat === 0 ? "Pipeline at risk" : beat === 1 ? "Recovering" : "Verified"}
            </motion.span>
          </AnimatePresence>
        </div>

        <ul className="divide-y divide-line">
          {COLUMNS.map((column, index) => {
            const isResolved = beat > 0 && index < resolvedCount;
            const method = METHOD_PRESENTATION[column.method];

            return (
              <li
                key={column.source}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3.5"
              >
                <span
                  className={cn(
                    "truncate font-mono text-[0.8125rem] transition-colors duration-300",
                    isResolved ? "text-ink-400 line-through" : "text-danger-600",
                  )}
                >
                  {column.source}
                </span>

                <motion.span
                  animate={{
                    x: isResolved ? 0 : -3,
                    opacity: isResolved ? 1 : 0.35,
                  }}
                  transition={{ ...springSoft, delay: index * 0.08 }}
                  className="text-ink-300"
                >
                  <ArrowRight className="size-3.5" aria-hidden />
                </motion.span>

                <span className="flex min-w-0 items-center justify-end gap-2">
                  <AnimatePresence mode="wait">
                    {isResolved ? (
                      <motion.span
                        key="resolved"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ ...springSoft, delay: index * 0.08 }}
                        className="flex min-w-0 items-center gap-2"
                      >
                        <span className="truncate font-mono text-[0.8125rem] font-medium text-ink-900">
                          {column.canonical}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide",
                            column.method === "rule" && "bg-success-50 text-success-700",
                            column.method === "fuzzy" && "bg-teal-50 text-teal-700",
                            column.method === "semantic" && "bg-brand-50 text-brand-700",
                          )}
                        >
                          {method.label}
                        </span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-[0.8125rem] text-ink-300"
                      >
                        unmapped
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{
                backgroundColor:
                  beat === 2 ? "var(--color-success-500)" : "var(--color-ink-300)",
              }}
              transition={{ duration: 0.4 }}
              className="size-2 rounded-full"
              aria-hidden
            />
            <p className="text-[0.75rem] text-ink-500">
              {beat === 0
                ? "The next import would fail on these columns"
                : beat === 1
                  ? "Known names first, then close matches, then AI"
                  : "All columns recovered and verified"}
            </p>
          </div>

          <AnimatePresence>
            {beat === 2 ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={springSoft}
                className="flex items-center gap-1.5 text-[0.75rem] font-medium text-success-700"
              >
                <CheckCircle2 className="size-3.5" aria-hidden />
                Healing report ready
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
