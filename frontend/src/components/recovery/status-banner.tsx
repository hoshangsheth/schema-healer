"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Download, RotateCcw, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import { springSoft } from "@/lib/motion";
import { statusFrom } from "@/lib/recovery-presentation";
import type { SchemaProcessingResponse } from "@/types/api";
import { Button } from "@/components/shared/button";
import { formatPercent } from "@/utils/format";

const VARIANT_STYLES = {
  verified: {
    shell: "border-success-100 bg-success-50/70",
    badge: "bg-success-100 text-success-700",
    heading: "text-success-700",
  },
  review: {
    shell: "border-warn-100 bg-warn-50/70",
    badge: "bg-warn-100 text-warn-700",
    heading: "text-warn-700",
  },
} as const;

export function StatusBanner({
  response,
  onDownload,
  onReset,
  filename,
  /** Hidden on touch, where the same actions live in the pinned bar. */
  showActions = true,
}: {
  response: SchemaProcessingResponse;
  onDownload: () => void;
  onReset: () => void;
  filename: string;
  showActions?: boolean;
}) {
  const status = statusFrom(response);
  const styles = VARIANT_STYLES[status.variant];
  const { recovery_rate } = response.healing_report.recovery_summary;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      aria-label="Recovery status"
      className={cn("rounded-panel border p-5 shadow-soft sm:p-6", styles.shell)}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              styles.badge,
            )}
          >
            {status.variant === "verified" ? (
              <ShieldCheck className="size-5.5" aria-hidden />
            ) : (
              <AlertTriangle className="size-5.5" aria-hidden />
            )}
          </span>

          <div className="min-w-0 space-y-1.5">
            <h1
              className={cn(
                "text-lg font-semibold tracking-[-0.02em] sm:text-xl",
                styles.heading,
              )}
            >
              {status.headline}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-600">
              {status.detail}
            </p>
            <p className="font-mono text-xs break-all text-ink-400">
              {filename} · {formatPercent(recovery_rate)} recovered
            </p>
          </div>
        </div>

        {showActions ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              onClick={onDownload}
              leadingIcon={<Download className="size-4" aria-hidden />}
            >
              Download rebuilt file
            </Button>
            <Button
              variant="secondary"
              onClick={onReset}
              leadingIcon={<RotateCcw className="size-4" aria-hidden />}
            >
              New file
            </Button>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
