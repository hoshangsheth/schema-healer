"use client";

import { motion } from "framer-motion";
import { CircleDashed, ListFilter, Sparkles, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { METHOD_PRESENTATION, methodBreakdown } from "@/lib/recovery-presentation";
import type { SchemaProcessingResponse } from "@/types/api";
import { Card, CardHeader } from "@/components/shared/card";
import { formatPercent, pluralize } from "@/utils/format";

const STAGE_ICONS: Record<string, LucideIcon> = {
  rule: ListFilter,
  fuzzy: Waypoints,
  semantic: Sparkles,
  unresolved: CircleDashed,
};

/**
 * How the run unfolded: how many columns each method resolved, and what was
 * left over. Derived entirely from `mappings`.
 */
export function RecoveryTimeline({ response }: { response: SchemaProcessingResponse }) {
  const counts = methodBreakdown(response);
  const total = response.healing_report.recovery_summary.total_uploaded_columns;

  const stages = [
    {
      key: "rule" as const,
      title: "Known names",
      count: counts.rule,
      caption: METHOD_PRESENTATION.rule.description,
      fill: "bg-success-500",
      tint: "bg-success-50 text-success-600",
    },
    {
      key: "fuzzy" as const,
      title: "Close matches",
      count: counts.fuzzy,
      caption: METHOD_PRESENTATION.fuzzy.description,
      fill: "bg-teal-500",
      tint: "bg-teal-50 text-teal-600",
    },
    {
      key: "semantic" as const,
      title: "AI recovery",
      count: counts.semantic,
      caption: METHOD_PRESENTATION.semantic.description,
      fill: "bg-brand-500",
      tint: "bg-brand-50 text-brand-600",
    },
    {
      key: "unresolved" as const,
      title: "Left for review",
      count: counts.unresolved,
      caption:
        "Nothing produced a reliable match, so these columns keep the names they arrived with.",
      fill: "bg-warn-500",
      tint: "bg-warn-50 text-warn-600",
    },
  ];

  return (
    <Card>
      <CardHeader
        title="How it was recovered"
        description="Each method only saw the columns the one before it could not resolve."
        icon={<Waypoints className="size-4" aria-hidden />}
      />

      <ol className="divide-y divide-line">
        {stages.map((stage, index) => {
          const Icon = STAGE_ICONS[stage.key];
          const share = total > 0 ? stage.count / total : 0;
          const empty = stage.count === 0;

          return (
            <li key={stage.key} className="px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    empty ? "bg-surface-2 text-ink-300" : stage.tint,
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        empty ? "text-ink-400" : "text-ink-900",
                      )}
                    >
                      {stage.title}
                    </p>
                    <p className="text-xs tabular-nums text-ink-500">
                      {stage.count} {pluralize(stage.count, "column")}
                      {stage.count > 0 ? ` · ${formatPercent(share * 100, 0)}` : ""}
                    </p>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${share * 100}%` }}
                      transition={{
                        duration: 0.6,
                        ease: EASE_OUT,
                        delay: 0.08 + index * 0.06,
                      }}
                      className={cn("h-full rounded-full", stage.fill)}
                    />
                  </div>

                  <p className="text-[0.8125rem] leading-relaxed text-ink-500">
                    {!empty
                      ? stage.caption
                      : stage.key === "unresolved"
                        ? "Every column was matched."
                        : "Nothing was resolved at this step."}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
