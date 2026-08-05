import type { ReactNode } from "react";

interface SectionProps {
  /** Anchor target used by the navigation links. */
  id?: string;
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  heading?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Standard page section: consistent vertical rhythm, max width, and an
 * optional centred header block.
 */
export function Section({
  id,
  eyebrow,
  heading,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full px-5 py-20 sm:px-8 lg:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        {(eyebrow || heading || description) && (
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-7 text-ink-500">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
