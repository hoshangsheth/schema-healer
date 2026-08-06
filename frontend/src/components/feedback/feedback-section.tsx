import { MessageSquareHeart } from "lucide-react";

import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/shared/reveal";
import { FeedbackForm } from "@/components/feedback/feedback-form";

/**
 * Quiet invitation to send feedback.
 *
 * Deliberately understated: no modal, no prompt, no interruption. It sits at
 * the end of the page for people who already have something to say, and it
 * disappears entirely when no endpoint is configured.
 */
export function FeedbackPanel({ className }: { className?: string }) {
  if (!siteConfig.feedbackEndpoint) return null;

  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className={cn(
        "overflow-hidden rounded-panel border border-line bg-surface shadow-soft",
        className,
      )}
    >
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="space-y-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <MessageSquareHeart className="size-5" aria-hidden />
          </span>
          <h2
            id="feedback-heading"
            className="text-xl font-semibold tracking-[-0.02em] text-ink-900 sm:text-2xl"
          >
            Help improve SchemaHealer
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-500">
            If something felt off, a column was matched badly, or there is a format you
            wish were supported, say so. Short notes are welcome, and they shape what
            gets built next.
          </p>
        </div>

        <FeedbackForm />
      </div>
    </section>
  );
}

/** Page level wrapper used on the landing page, above the footer. */
export function FeedbackSection() {
  if (!siteConfig.feedbackEndpoint) return null;

  return (
    <div className="px-5 pb-16 sm:px-8">
      <Reveal className="mx-auto w-full max-w-6xl">
        <FeedbackPanel />
      </Reveal>
    </div>
  );
}
