import type { ComponentType } from "react";

import { Section } from "@/components/shared/Section";
import {
  ClockIcon,
  EyeIcon,
  ShieldIcon,
  WandIcon,
} from "@/components/shared/Icons";

interface ValueCard {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

const CARDS: ValueCard[] = [
  {
    icon: ShieldIcon,
    title: "Prevent downtime",
    body: "Catch recoverable schema drift at the point of ingestion, before downstream processing fails on a column it cannot find.",
  },
  {
    icon: WandIcon,
    title: "Recover automatically",
    body: "Three strategies run in order — deterministic rules, fuzzy similarity, then semantic matching — so obvious cases never reach a model.",
  },
  {
    icon: ClockIcon,
    title: "Save engineering time",
    body: "Replace the repetitive work of tracing a failed run back to a renamed column and hand-writing the mapping again.",
  },
  {
    icon: EyeIcon,
    title: "Trust every repair",
    body: "Each column reports the canonical field it was mapped to and the strategy that resolved it. Nothing is changed silently.",
  },
];

export function ValueCards() {
  return (
    <Section
      className="bg-ink-50"
      eyebrow="Why SchemaHealer"
      heading="Recovery you can inspect"
      description="SchemaHealer is built to make schema decisions explicit, not to quietly rewrite your data."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-base font-semibold text-ink-900">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-500">{body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
