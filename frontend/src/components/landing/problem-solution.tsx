"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  BellRing,
  FileSearch,
  GitPullRequestClosed,
  PauseCircle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT, springSoft } from "@/lib/motion";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { SnapCarousel } from "@/components/shared/snap-carousel";

interface Step {
  icon: LucideIcon;
  title: string;
  detail: string;
}

const WITHOUT: Step[] = [
  {
    icon: GitPullRequestClosed,
    title: "A column gets renamed",
    detail: "`Deal Amount` becomes `Opportunity Amount` in the next export.",
  },
  {
    icon: AlertOctagon,
    title: "The import fails",
    detail: "The job is looking for a column that is no longer there.",
  },
  {
    icon: BellRing,
    title: "Someone gets paged",
    detail: "An engineer drops what they were doing to compare two files.",
  },
  {
    icon: FileSearch,
    title: "It gets patched by hand",
    detail: "A quick fix lands in the code, and nobody writes it down.",
  },
  {
    icon: PauseCircle,
    title: "Reports go stale",
    detail: "Dashboards sit on yesterday's numbers until the data is reloaded.",
  },
];

const WITH: Step[] = [
  {
    icon: ScanSearch,
    title: "The change is spotted on upload",
    detail: "Column names are tidied up and compared against your field list.",
  },
  {
    icon: Workflow,
    title: "Three attempts, in order",
    detail: "Known names first, then close matches, then AI for the rest.",
  },
  {
    icon: ShieldCheck,
    title: "The result is checked",
    detail: "Missing, unmatched and duplicated columns are caught before export.",
  },
  {
    icon: Sparkles,
    title: "You get a report",
    detail: "What was recovered, how, and anything that still needs a decision.",
  },
  {
    icon: Workflow,
    title: "The pipeline keeps running",
    detail: "The rebuilt file goes out with the column names your systems expect.",
  },
];

type Mode = "without" | "with";

function StepCard({
  step,
  index,
  mode,
}: {
  step: Step;
  index: number;
  mode: Mode;
}) {
  const Icon = step.icon;
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col gap-3 rounded-card border p-5",
        mode === "without"
          ? "border-danger-100 bg-danger-50/40"
          : "border-success-100 bg-success-50/40",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          mode === "without"
            ? "bg-danger-100 text-danger-600"
            : "bg-success-100 text-success-700",
        )}
      >
        <Icon className="size-4.5" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold tracking-[-0.01em] text-ink-900">
          {step.title}
        </p>
        <p className="text-[0.8125rem] leading-relaxed text-ink-500">{step.detail}</p>
      </div>
      <span
        className={cn(
          "mt-auto font-mono text-[0.6875rem]",
          mode === "without" ? "text-danger-500/70" : "text-success-600/70",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function ProblemSolution() {
  const [mode, setMode] = useState<Mode>("without");
  const steps = mode === "without" ? WITHOUT : WITH;

  return (
    <Section id="product" className="scroll-mt-24">
      <SectionHeading
        eyebrow="The cost of change"
        title="Two ways a renamed column can go"
        description="Column names change every time an upstream tool ships an update. The only question is whether it turns into an incident."
      />

      <Reveal className="mt-7 flex justify-center">
        <div
          role="tablist"
          aria-label="Compare outcomes"
          className="relative inline-flex w-full max-w-md rounded-full border border-line bg-surface p-1 shadow-soft sm:w-auto"
        >
          {(["without", "with"] as const).map((value) => {
            const active = mode === value;
            return (
              <button
                key={value}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setMode(value)}
                className={cn(
                  "relative z-10 min-h-11 flex-1 rounded-full px-4 text-sm font-medium transition-colors sm:flex-none sm:px-5",
                  active ? "text-white" : "text-ink-500",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="mode-pill"
                    transition={springSoft}
                    className={cn(
                      "absolute inset-0 rounded-full",
                      value === "without" ? "bg-danger-500" : "bg-success-600",
                    )}
                  />
                ) : null}
                <span className="relative sm:hidden">
                  {value === "without" ? "Without" : "With"}
                </span>
                <span className="relative hidden sm:inline">
                  {value === "without" ? "Without SchemaHealer" : "With SchemaHealer"}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {/* Touch: swipe through the sequence one beat at a time. */}
          <SnapCarousel
            ariaLabel={mode === "without" ? "Without SchemaHealer" : "With SchemaHealer"}
            className="mt-6 lg:hidden"
            itemClassName="w-[78%] sm:w-[45%]"
          >
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} mode={mode} />
            ))}
          </SnapCarousel>

          <ol className="mt-7 hidden gap-3 lg:grid lg:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex">
                <StepCard step={step} index={index} mode={mode} />
              </li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>

      <Reveal className="mt-6">
        <p
          className={cn(
            "mx-auto max-w-2xl rounded-xl border px-5 py-3.5 text-center text-sm font-medium",
            mode === "without"
              ? "border-danger-100 bg-danger-50 text-danger-700"
              : "border-success-100 bg-success-50 text-success-700",
          )}
        >
          {mode === "without"
            ? "Downtime, an interrupted engineer, and reports nobody trusts."
            : "A checked file, a record of what changed, and a pipeline that never stopped."}
        </p>
      </Reveal>
    </Section>
  );
}
