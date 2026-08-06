"use client";

import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/shared/button";
import { StickyBar } from "@/components/shared/sticky-bar";

/**
 * Pinned call to action for touch screens.
 *
 * Appears once the hero has scrolled away and steps aside when the feedback
 * form comes into view, so it never sits on top of a field someone is typing
 * into.
 */
export function MobileCta() {
  return (
    <StickyBar hideNearId="feedback">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">
            Try it on your own file
          </p>
          <p className="truncate text-xs text-ink-400">
            No account, results in under a minute
          </p>
        </div>
        <ButtonLink
          href="/app"
          size="md"
          className="shrink-0"
          trailingIcon={<ArrowRight className="size-4" aria-hidden />}
        >
          Upload CSV
        </ButtonLink>
      </div>
    </StickyBar>
  );
}
