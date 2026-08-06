"use client";

import { Building2, HeartHandshake, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { SnapCarousel } from "@/components/shared/snap-carousel";

interface Point {
  icon: LucideIcon;
  title: string;
  body: string;
}

const POINTS: Point[] = [
  {
    icon: Building2,
    title: "The problem",
    body: "Customer data arrives as spreadsheets exported from other systems. Every time one of those systems is updated, a column can be renamed, reworded or reordered. The import that ran fine yesterday stops working, and someone has to find out why.",
  },
  {
    icon: Workflow,
    title: "What SchemaHealer does",
    body: "It reads the file before your systems do, works out which of your own fields each column belongs to, and rebuilds the file with the names you expect. Familiar column names are matched instantly, close variations are caught by comparison, and anything unusual is handed to an AI model that understands what the wording means.",
  },
  {
    icon: HeartHandshake,
    title: "Why it earns trust",
    body: "Nothing is renamed quietly. You get a report showing every column, what it became and how the decision was made, plus a list of anything that still needs a person to look at it. If the AI step is unavailable, the rest of the work still completes.",
  },
];

function PointCard({ point }: { point: Point }) {
  const Icon = point.icon;
  return (
    <article className="h-full w-full rounded-card border border-line bg-surface p-5 shadow-soft">
      <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-900">
        {point.title}
      </h3>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">{point.body}</p>
    </article>
  );
}

export function About() {
  return (
    <Section id="about" className="scroll-mt-24">
      <SectionHeading
        eyebrow="About"
        title="Built for the day an export changes shape"
        description="SchemaHealer is a safety layer for the files your business runs on. It keeps a renamed column from turning into a broken report."
      />

      <SnapCarousel
        ariaLabel="About SchemaHealer"
        className="mt-7 md:hidden"
        itemClassName="w-[86%]"
      >
        {POINTS.map((point) => (
          <PointCard key={point.title} point={point} />
        ))}
      </SnapCarousel>

      <div className="mt-9 hidden gap-4 md:grid md:grid-cols-3">
        {POINTS.map((point, index) => (
          <Reveal key={point.title} index={index}>
            <PointCard point={point} />
          </Reveal>
        ))}
      </div>

      <Reveal index={1} className="mt-4">
        <div className="rounded-card border border-line bg-surface-2/70 px-5 py-4 sm:px-6">
          <p className="text-sm leading-relaxed text-ink-600">
            <span className="font-medium text-ink-900">About the builder.</span> I am a
            GenAI engineer working on practical applications of AI in data
            infrastructure. I built SchemaHealer to solve schema drift the way it
            actually shows up in production, with AI-assisted recovery that stays
            explainable end to end.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
