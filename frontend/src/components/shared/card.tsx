import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the lifted panel treatment used for primary surfaces. */
  elevated?: boolean;
}

export function Card({ elevated = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface",
        elevated ? "shadow-panel" : "shadow-soft",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-600">
            {icon}
          </span>
        ) : null}
        <div className="space-y-1">
          <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-900">
            {title}
          </h3>
          {description ? (
            <p className="text-[0.8125rem] leading-relaxed text-ink-500">{description}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
