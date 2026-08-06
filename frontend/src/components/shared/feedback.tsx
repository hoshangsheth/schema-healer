"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/shared/button";
import { EASE_OUT, springSoft } from "@/lib/motion";
import type { ApiErrorPayload } from "@/lib/api-error";

/** Shimmering placeholder used while a panel's data is loading. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface-2",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent",
        className,
      )}
    />
  );
}

/** Horizontal progress rail. `value` runs from 0 to 1. */
export function ProgressBar({
  value,
  className,
  tone = "brand",
  label,
}: {
  value: number;
  className?: string;
  tone?: "brand" | "teal" | "success" | "warn";
  label?: string;
}) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  const fills = {
    brand: "bg-brand-500",
    teal: "bg-teal-500",
    success: "bg-success-500",
    warn: "bg-warn-500",
  } as const;

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <motion.div
        className={cn("h-full rounded-full", fills[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      />
    </div>
  );
}

/** Empty state for tables and panels with nothing to show. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="flex size-11 items-center justify-center rounded-xl bg-surface-2 text-ink-400">
          {icon}
        </span>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink-800">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-[0.8125rem] leading-relaxed text-ink-500">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/**
 * Failure card. It renders only normalised {@link ApiErrorPayload} values, so
 * raw responses and stack traces never reach the screen.
 */
export function ErrorCard({
  error,
  onRetry,
  onReset,
  className,
}: {
  error: ApiErrorPayload;
  onRetry?: () => void;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      role="alert"
      className={cn(
        "rounded-card border border-danger-100 bg-danger-50/60 p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-100 text-danger-600">
          <AlertTriangle className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-danger-700">
              {error.title}
            </p>
            <p className="text-[0.875rem] leading-relaxed text-ink-600">{error.message}</p>
          </div>
          {onRetry || onReset ? (
            <div className="flex flex-wrap gap-2">
              {onRetry ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onRetry}
                  leadingIcon={<RotateCcw className="size-3.5" aria-hidden />}
                >
                  Try again
                </Button>
              ) : null}
              {onReset ? (
                <Button size="sm" variant="ghost" onClick={onReset}>
                  Choose another file
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
