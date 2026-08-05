import type { ReactNode } from "react";

export type BadgeTone =
  | "brand"
  | "success"
  | "danger"
  | "neutral"
  | "warning";

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-success-50 text-success-700 ring-success-200",
  danger: "bg-danger-50 text-danger-700 ring-danger-200",
  warning: "bg-warning-50 text-warning-700 ring-warning-200",
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

/** Small pill label. Always carries its meaning in text, not colour alone. */
export function Badge({
  tone = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
