"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT, springSoft } from "@/lib/motion";
import { PROCESSING_STAGES, useProcessingStages } from "@/hooks/use-processing-stages";
import { Button } from "@/components/shared/button";
import { ProgressBar, Skeleton } from "@/components/shared/feedback";
import { formatBytes } from "@/utils/file";

/**
 * Live processing view.
 *
 * The service answers with a single response and no progress updates, so the
 * steps advance on estimated timings and wait on the last one until the real
 * result lands. Nothing is marked complete before the response arrives.
 */
export function ProcessingPipeline({
  file,
  isRunning,
  isComplete,
  onCancel,
}: {
  file: File;
  isRunning: boolean;
  isComplete: boolean;
  onCancel: () => void;
}) {
  const { activeIndex, states, progress } = useProcessingStages(isRunning, isComplete);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={springSoft}
      className="overflow-hidden rounded-panel border border-line bg-surface shadow-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Loader2 className="size-4.5 animate-spin" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[-0.01em] text-ink-900">
              Recovering your file
            </p>
            <p className="font-mono text-xs break-all text-ink-400">
              {file.name} · {formatBytes(file.size)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          leadingIcon={<X className="size-3.5" aria-hidden />}
        >
          Cancel
        </Button>
      </div>

      <div className="px-5 pt-4 sm:px-6">
        <ProgressBar value={progress} label="Recovery progress" />
      </div>

      <ol className="space-y-0.5 p-3 sm:space-y-1 sm:p-5" aria-live="polite">
        {PROCESSING_STAGES.map((stage, index) => {
          const state = states[index];
          return (
            <li
              key={stage.id}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors sm:gap-3.5 sm:py-3",
                state === "active" && "bg-brand-50/60",
              )}
            >
              <span className="relative mt-0.5 flex size-6 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {state === "complete" ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={springSoft}
                      className="flex size-6 items-center justify-center rounded-full bg-success-500 text-white"
                    >
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </motion.span>
                  ) : state === "active" ? (
                    <motion.span
                      key="active"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={springSoft}
                      className="relative flex size-6 items-center justify-center"
                    >
                      <span className="absolute size-6 rounded-full bg-brand-200 animate-pulse-ring" />
                      <span className="relative size-2.5 rounded-full bg-brand-500" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="size-2.5 rounded-full bg-line-strong"
                    />
                  )}
                </AnimatePresence>
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    state === "waiting" ? "text-ink-400" : "text-ink-900",
                  )}
                >
                  {stage.label}
                </p>
                <AnimatePresence initial={false}>
                  {state === "active" ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className="overflow-hidden text-[0.8125rem] leading-relaxed text-ink-500"
                    >
                      {stage.detail}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              {index === activeIndex && !isComplete ? (
                <span className="mt-0.5 shrink-0 text-xs font-medium text-brand-600">
                  Working
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Outline of the results layout, so the wait previews what is coming. */}
      <div className="space-y-3 border-t border-line bg-surface-2/50 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-16 sm:h-20" />
          ))}
        </div>
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </motion.div>
  );
}
