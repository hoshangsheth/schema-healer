"use client";

import {
  Braces,
  ClipboardList,
  Download,
  Gauge,
  LifeBuoy,
  ListChecks,
  ShieldCheck,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { SnapCarousel } from "@/components/shared/snap-carousel";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

/** Every claim here maps to something the service actually does. */
const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Prevent downtime",
    description:
      "Changed column names are sorted out before your import job sees them, so the run that would have failed simply works.",
    accent: "text-brand-600 bg-brand-50",
  },
  {
    icon: Layers,
    title: "Three ways to recover",
    description:
      "A built-in list of known names is tried first, close matching handles typos and reworded headings, and an AI model resolves anything left.",
    accent: "text-teal-600 bg-teal-50",
  },
  {
    icon: Gauge,
    title: "Match strength you can read",
    description:
      "Each column shows how it was matched, from a known name through to an AI recovery, rather than an unexplained score.",
    accent: "text-brand-600 bg-brand-50",
  },
  {
    icon: ListChecks,
    title: "Automatic checks",
    description:
      "Before the file is released it is checked for missing columns, names that could not be matched, and two columns landing on the same field.",
    accent: "text-success-600 bg-success-50",
  },
  {
    icon: ClipboardList,
    title: "A report you can share",
    description:
      "How much was recovered, what was matched and how, what still needs review, and whether the file is safe to use.",
    accent: "text-teal-600 bg-teal-50",
  },
  {
    icon: Braces,
    title: "A ready-made field list",
    description:
      "Over three hundred standard customer and sales fields, covering contacts, companies, leads, deals, activity, marketing and support.",
    accent: "text-brand-600 bg-brand-50",
  },
  {
    icon: Download,
    title: "Clean file, ready to use",
    description:
      "Download the rebuilt file with the column names your systems expect. Column order and every value are preserved exactly.",
    accent: "text-success-600 bg-success-50",
  },
  {
    icon: LifeBuoy,
    title: "Keeps working without AI",
    description:
      "If the AI step is unavailable, recovery still completes on the other two methods and the affected columns are flagged for review.",
    accent: "text-warn-600 bg-warn-50",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <article className="group h-full w-full rounded-card border border-line bg-surface p-5 shadow-soft transition-[transform,border-color,box-shadow] duration-300 lg:hover:-translate-y-1 lg:hover:border-brand-200 lg:hover:shadow-lift">
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-xl transition-transform duration-300 lg:group-hover:scale-105",
          feature.accent,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-900">
        {feature.title}
      </h3>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">
        {feature.description}
      </p>
    </article>
  );
}

export function FeatureGrid() {
  return (
    <Section className="bg-surface-2/60">
      <SectionHeading
        eyebrow="What you get"
        title="Built for teams that get paged"
        description="Automatic recovery is only useful if you can check its work. Every step leaves evidence behind."
      />

      {/* Touch: one swipe rail instead of eight stacked cards. */}
      <SnapCarousel
        ariaLabel="Capabilities"
        className="mt-7 lg:hidden"
        itemClassName="w-[78%] sm:w-[45%]"
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </SnapCarousel>

      <div className="mt-9 hidden gap-4 lg:grid lg:grid-cols-4">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} index={index % 4}>
            <FeatureCard feature={feature} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
