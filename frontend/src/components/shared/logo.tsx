import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * Wordmark. The glyph is a shield with a mended seam: a break that has been
 * closed.
 */
export function Logo({
  href = "/",
  className,
  showWord = true,
}: {
  href?: string | null;
  className?: string;
  showWord?: boolean;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-8 items-center justify-center rounded-[0.6rem] bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_6px_16px_-8px_rgba(74,44,192,0.9)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4.5"
          aria-hidden
        >
          <path
            d="M12 2.75 4.75 5.5v6.02c0 4.36 2.94 8.24 7.25 9.73 4.31-1.49 7.25-5.37 7.25-9.73V5.5L12 2.75Z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.4 12.2h2.1l1.2-2.4 1.3 4.4 1-2h1.6"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWord ? (
        <span className="text-[1.0625rem] font-semibold tracking-[-0.025em] text-ink-900">
          Schema<span className="text-brand-600">Healer</span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-lg"
      aria-label="SchemaHealer home"
    >
      {content}
    </Link>
  );
}
