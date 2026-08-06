"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/recovery-presentation";

const TONE_ACCENT: Record<Tone, string> = {
  brand: "text-brand-600",
  teal: "text-teal-600",
  success: "text-success-600",
  warn: "text-warn-600",
  danger: "text-danger-600",
  neutral: "text-ink-800",
};

/** Number that counts up on mount, or lands immediately for reduced motion. */
export function CountUp({
  value,
  duration = 900,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced motion never animates, so the value is rendered directly below.
    if (reduceMotion) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      // Ease-out cubic keeps the last digits from crawling.
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(value * eased);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduceMotion]);

  return (
    <span>
      {(reduceMotion ? value : display).toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface p-3.5 shadow-soft sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-400 sm:text-xs sm:tracking-[0.1em]">
          {label}
        </p>
        {icon ? <span className={cn("shrink-0", TONE_ACCENT[tone])}>{icon}</span> : null}
      </div>
      <p
        className={cn(
          "mt-2 text-[1.375rem] font-semibold tracking-[-0.03em] tabular-nums sm:mt-2.5 sm:text-[1.75rem]",
          TONE_ACCENT[tone],
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-ink-400">{hint}</p> : null}
    </div>
  );
}
