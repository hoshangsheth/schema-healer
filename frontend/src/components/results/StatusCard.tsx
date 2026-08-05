import type { ReactNode } from "react";

import {
  AlertTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@/components/shared/Icons";
import type { RecoveryOutcome } from "@/types/result";

type StatusTone = "success" | "brand" | "danger";

const OUTCOME_TONE: Record<RecoveryOutcome, StatusTone> = {
  passed: "success",
  recovered: "brand",
  failed: "danger",
};

const TONE_SHELL: Record<StatusTone, string> = {
  success: "border-success-200 bg-success-50",
  brand: "border-brand-200 bg-brand-50",
  danger: "border-danger-200 bg-danger-50",
};

const TONE_ICON: Record<StatusTone, string> = {
  success: "bg-white text-success-600 ring-success-200",
  brand: "bg-white text-brand-600 ring-brand-200",
  danger: "bg-white text-danger-600 ring-danger-200",
};

const TONE_TITLE: Record<StatusTone, string> = {
  success: "text-success-700",
  brand: "text-brand-700",
  danger: "text-danger-700",
};

function iconFor(tone: StatusTone) {
  if (tone === "success") {
    return <CheckCircleIcon className="h-5 w-5" />;
  }

  if (tone === "brand") {
    return <SparklesIcon className="h-5 w-5" />;
  }

  return <AlertTriangleIcon className="h-5 w-5" />;
}

interface StatusCardProps {
  outcome: RecoveryOutcome;
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * Headline banner for a result.
 *
 * The outcome is stated in the title text as well as the colour, so the
 * status never depends on colour alone.
 */
export function StatusCard({
  outcome,
  title,
  description,
  children,
}: StatusCardProps) {
  const tone = OUTCOME_TONE[outcome];

  return (
    <div className={`rounded-2xl border p-5 ${TONE_SHELL[tone]}`}>
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${TONE_ICON[tone]}`}
        >
          {iconFor(tone)}
        </span>
        <div className="min-w-0">
          <h3 className={`text-base font-semibold ${TONE_TITLE[tone]}`}>
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-700">{description}</p>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
