"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";
import { springSoft } from "@/lib/motion";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

/**
 * Segmented control.
 *
 * Used on touch screens to swap between views that sit side by side on a wide
 * screen. Each segment is a full height tap target and the indicator slides
 * with a shared layout animation.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  layoutId,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** Unique per instance, so two controls never share an indicator. */
  layoutId: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex w-full gap-1 rounded-xl border border-line bg-surface-2 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative min-h-10 flex-1 rounded-lg px-2 text-[0.8125rem] font-medium transition-colors",
              active ? "text-ink-900" : "text-ink-500",
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                transition={springSoft}
                className="absolute inset-0 rounded-lg bg-surface shadow-soft"
              />
            ) : null}
            <span className="relative flex items-center justify-center gap-1.5">
              {option.label}
              {typeof option.count === "number" ? (
                <span
                  className={cn(
                    "tabular-nums",
                    active ? "text-ink-400" : "text-ink-300",
                  )}
                >
                  {option.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
