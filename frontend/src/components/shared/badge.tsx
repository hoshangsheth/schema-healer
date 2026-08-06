import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/recovery-presentation";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  success: "bg-success-50 text-success-700 ring-success-100",
  warn: "bg-warn-50 text-warn-700 ring-warn-100",
  danger: "bg-danger-50 text-danger-700 ring-danger-100",
  neutral: "bg-surface-2 text-ink-600 ring-line",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Small uppercase eyebrow used above section headings. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-700 shadow-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
