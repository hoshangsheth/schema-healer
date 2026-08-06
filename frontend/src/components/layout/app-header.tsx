import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/shared/logo";

/** Slim application chrome. The workspace should feel like a tool, not a site. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-90 border-b border-line glass-panel">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <span aria-hidden className="hidden h-5 w-px bg-line sm:block" />
          <p className="hidden text-sm font-medium text-ink-500 sm:block">
            Recovery workspace
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-2 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Back to site</span>
        </Link>
      </div>
    </header>
  );
}
