import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/recovery-presentation";

const TONE_FILL: Record<Tone, string> = {
  brand: "bg-brand-500",
  teal: "bg-teal-500",
  success: "bg-success-500",
  warn: "bg-warn-500",
  danger: "bg-danger-500",
  neutral: "bg-ink-300",
};

/**
 * Match strength indicator.
 *
 * The service reports how a column was matched, not a numeric score, so
 * strength is shown as filled segments with a written label rather than a
 * percentage. Rendered as plain markup: it appears once per table row, so a
 * static indicator keeps long result tables cheap to render.
 */
export function StrengthMeter({
  segments,
  tone,
  label,
  className,
}: {
  segments: 0 | 1 | 2 | 3;
  tone: Tone;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex items-center gap-1" aria-hidden>
        {[0, 1, 2].map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 w-4 rounded-full",
              segment < segments ? TONE_FILL[tone] : "bg-surface-3",
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-ink-500">{label}</span>
    </div>
  );
}
