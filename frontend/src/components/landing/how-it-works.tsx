"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  FileCheck2,
  ListFilter,
  Sparkles,
  Table2,
  Upload,
  Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";

interface Stage {
  icon: LucideIcon;
  title: string;
  detail: string;
}

const STAGES: Stage[] = [
  {
    icon: Upload,
    title: "Upload",
    detail:
      "You send a CSV file. The separator is detected automatically, so exports using commas, semicolons, tabs or pipes all read correctly.",
  },
  {
    icon: FileCheck2,
    title: "Check the file",
    detail:
      "Files that are not CSV, and files with no readable header row, are turned away straight away with a clear reason.",
  },
  {
    icon: ListFilter,
    title: "Match known names",
    detail:
      "Column names are tidied up and looked up in a built-in list covering more than three hundred standard fields and their common variations.",
  },
  {
    icon: Waypoints,
    title: "Find close matches",
    detail:
      "Anything left over is compared against your field list. Weak matches are refused rather than guessed, and no field can be claimed twice.",
  },
  {
    icon: Sparkles,
    title: "Ask the AI model",
    detail:
      "Names that get this far are sent to an AI model along with your field list. Its answers are checked before they are accepted.",
  },
  {
    icon: Table2,
    title: "Rebuild the file",
    detail:
      "The recovered names are applied to every row. The data itself is untouched, only the column headings change.",
  },
  {
    icon: CheckCircle2,
    title: "Verify",
    detail:
      "The rebuilt file is checked for missing columns, names that could not be matched, and two columns landing on the same field.",
  },
  {
    icon: ClipboardList,
    title: "Report",
    detail:
      "The numbers and the checks are pulled together into the report you see in the workspace.",
  },
  {
    icon: Download,
    title: "Download",
    detail:
      "The rebuilt file is exported and streamed back to you. It is the same file you previewed on screen.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="scroll-mt-24">
      <SectionHeading
        eyebrow="How it works"
        title="Nine steps, one upload"
        description="A single upload runs the whole sequence. Each step only sees what the one before it could not solve, so the simplest answer always wins."
      />

      <TouchSteps />
      <DesktopSteps />

      <Reveal className="mt-6">
        <p className="mx-auto max-w-2xl text-center text-sm text-ink-400">
          The sequence stops as soon as every column is resolved. If the known names
          cover the whole file, the AI model is never called.
        </p>
      </Reveal>
    </Section>
  );
}

/**
 * Touch layout: a compact list where one step is open at a time.
 *
 * Nine expanded paragraphs would be a long scroll on a phone, so the titles
 * stay scannable and the detail is a tap away.
 */
function TouchSteps() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ol className="mt-7 overflow-hidden rounded-card border border-line bg-surface shadow-soft lg:hidden">
      {STAGES.map((stage, index) => {
        const Icon = stage.icon;
        const open = openIndex === index;

        return (
          <li key={stage.title} className="border-b border-line last:border-0">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex min-h-16 w-full items-center gap-3.5 px-4 text-left transition-colors active:bg-surface-2"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                  open ? "bg-brand-500 text-white" : "bg-surface-2 text-brand-600",
                )}
              >
                <Icon className="size-4.5" aria-hidden />
              </span>

              <span className="flex-1">
                <span className="mr-2 font-mono text-xs text-ink-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.9375rem] font-medium text-ink-900">
                  {stage.title}
                </span>
              </span>

              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="text-ink-400"
              >
                <ChevronDown className="size-4" aria-hidden />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 pl-[4.375rem] text-[0.875rem] leading-relaxed text-ink-500">
                    {stage.detail}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

/** Desktop layout: the full timeline with a scroll linked progress rail. */
function DesktopSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 60%"],
  });
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });
  const railHeight = useTransform(railProgress, (value) => `${value * 100}%`);

  return (
    <div ref={containerRef} className="relative mt-10 hidden lg:block">
      <div
        aria-hidden
        className="absolute top-2 bottom-2 left-[1.4375rem] w-px bg-line"
      >
        <motion.div
          style={{ height: railHeight }}
          className="w-px bg-gradient-to-b from-brand-500 via-brand-500 to-teal-500"
        />
      </div>

      <ol className="space-y-3">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.li
              key={stage.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
              className="relative flex gap-5"
            >
              <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-brand-600 shadow-soft">
                <Icon className="size-5" aria-hidden />
              </span>

              <div className="flex-1 rounded-card border border-line bg-surface p-5 shadow-soft transition-colors hover:border-brand-200">
                <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-900">
                  <span className="mr-2 font-mono text-xs text-ink-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {stage.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-[0.875rem] leading-relaxed text-ink-500">
                  {stage.detail}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
