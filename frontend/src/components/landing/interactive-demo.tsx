"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { METHOD_PRESENTATION } from "@/lib/recovery-presentation";
import type { RecoveryMethod } from "@/types/api";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { ButtonLink } from "@/components/shared/button";
import { StrengthMeter } from "@/components/shared/strength-meter";
import { formatPercent } from "@/utils/format";

/**
 * Interactive preview of a recovery run.
 *
 * The samples are the CSV fixtures that ship with the project, and the results
 * shown for the first two methods are the engine's actual output for those
 * files. Rows marked as AI are the column names that genuinely get past both
 * earlier steps, shown with the field the model resolves them to.
 */

interface DemoRow {
  source: string;
  canonical: string;
  method: RecoveryMethod;
}

interface DemoSample {
  id: string;
  label: string;
  filename: string;
  blurb: string;
  rows: DemoRow[];
}

const SAMPLES: DemoSample[] = [
  {
    id: "vendor",
    label: "Vendor export",
    filename: "03_hubspot_export.csv",
    blurb:
      "A marketing platform export. Most column names are recognised outright; the rest are close enough to match.",
    rows: [
      { source: "Company", canonical: "company_name", method: "rule" },
      { source: "Email", canonical: "email", method: "rule" },
      { source: "Mobile Phone Number", canonical: "phone_number", method: "fuzzy" },
      { source: "Lifecycle Stage", canonical: "customer_lifecycle_status", method: "rule" },
      { source: "Deal Amount", canonical: "deal_value", method: "rule" },
      { source: "State/Region", canonical: "state", method: "fuzzy" },
      { source: "Website URL", canonical: "website", method: "fuzzy" },
      { source: "Create Date", canonical: "account_created_at", method: "fuzzy" },
    ],
  },
  {
    id: "typos",
    label: "Typos and edits",
    filename: "06_minor_typos.csv",
    blurb:
      "A hand edited export with misspelled headings. Close matching recovers them, and one typo too far gone for that goes to the model.",
    rows: [
      { source: "customer_id", canonical: "customer_id", method: "rule" },
      { source: "frist_name", canonical: "first_name", method: "fuzzy" },
      { source: "job_titel", canonical: "job_title", method: "fuzzy" },
      { source: "emial", canonical: "email", method: "semantic" },
      { source: "deal_stage", canonical: "pipeline_stage", method: "rule" },
      { source: "owner_name", canonical: "account_owner", method: "rule" },
    ],
  },
  {
    id: "unknown",
    label: "Unfamiliar system",
    filename: "09_business_terms.csv",
    blurb:
      "An in-house system using everyday business words instead of field names. This is where the AI step earns its place.",
    rows: [
      { source: "Given Name", canonical: "first_name", method: "rule" },
      { source: "Cell", canonical: "mobile_number", method: "rule" },
      { source: "Role", canonical: "job_title", method: "fuzzy" },
      { source: "Business Sector", canonical: "industry", method: "fuzzy" },
      { source: "Organization", canonical: "company_name", method: "semantic" },
      { source: "Sales Opportunity", canonical: "opportunity_name", method: "semantic" },
      { source: "Nation", canonical: "country", method: "semantic" },
      { source: "Relationship Manager", canonical: "account_manager", method: "rule" },
    ],
  },
];

const BREAKDOWN_LABELS: Record<RecoveryMethod, string> = {
  rule: "Known name",
  fuzzy: "Close match",
  semantic: "AI match",
};

export function InteractiveDemo() {
  const [activeId, setActiveId] = useState(SAMPLES[0].id);
  const sample = SAMPLES.find((item) => item.id === activeId) ?? SAMPLES[0];

  const breakdown = useMemo(() => {
    return sample.rows.reduce<Record<RecoveryMethod, number>>(
      (counts, row) => ({ ...counts, [row.method]: counts[row.method] + 1 }),
      { rule: 0, fuzzy: 0, semantic: 0 },
    );
  }, [sample]);

  return (
    <Section id="demo" className="scroll-mt-24">
      <SectionHeading
        eyebrow="See it work"
        title="Watch a changed file get rebuilt"
        description="Pick a sample file and follow every column from the name that arrived to the field it belongs in."
      />

      <Reveal className="mt-9">
        <div className="overflow-hidden rounded-panel border border-line bg-surface shadow-panel">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            {/* Scrollable on narrow screens so the tabs never wrap. */}
            <div
              role="tablist"
              aria-label="Sample files"
              className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto rounded-xl bg-surface-2 p-1 sm:mx-0 sm:flex-wrap sm:overflow-visible"
            >
              {SAMPLES.map((item) => {
                const active = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      "relative min-h-10 shrink-0 rounded-lg px-3.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors",
                      active ? "text-ink-900" : "text-ink-500 hover:text-ink-800",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="demo-tab"
                        className="absolute inset-0 rounded-lg bg-surface shadow-soft"
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="font-mono text-xs text-ink-400">{sample.filename}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <p className="border-b border-line bg-surface-2/50 px-5 py-3 text-[0.8125rem] leading-relaxed text-ink-500 sm:px-6">
                {sample.blurb}
              </p>

              <div className="grid gap-px bg-line md:grid-cols-[1.6fr_1fr]">
                <ul className="min-w-0 divide-y divide-line bg-surface">
                  {sample.rows.map((row) => {
                    const method = METHOD_PRESENTATION[row.method];
                    return (
                      <li
                        key={row.source}
                        className="flex min-w-0 flex-col gap-1.5 px-5 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
                      >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2.5 gap-y-1 sm:flex-nowrap sm:gap-3">
                          <span className="min-w-0 font-mono text-[0.8125rem] break-all text-ink-500 sm:truncate">
                            {row.source}
                          </span>
                          <ArrowRight
                            className="size-3.5 shrink-0 text-ink-300"
                            aria-hidden
                          />
                          <span className="min-w-0 font-mono text-[0.8125rem] font-medium break-all text-ink-900 sm:truncate">
                            {row.canonical}
                          </span>
                        </div>
                        <StrengthMeter
                          segments={method.strength}
                          tone={method.tone}
                          label={method.strengthLabel}
                          className="shrink-0"
                        />
                      </li>
                    );
                  })}
                </ul>

                <div className="min-w-0 space-y-4 bg-surface p-5 sm:p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-success-50 text-success-600">
                      <ShieldCheck className="size-4.5" aria-hidden />
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-ink-900">Verified</p>
                      <p className="text-xs text-ink-400">
                        {sample.rows.length} of {sample.rows.length} columns recovered
                      </p>
                    </div>
                  </div>

                  <dl className="space-y-2.5">
                    {(
                      [
                        ["rule", breakdown.rule],
                        ["fuzzy", breakdown.fuzzy],
                        ["semantic", breakdown.semantic],
                      ] as const
                    ).map(([key, count]) => {
                      const share = count / sample.rows.length;
                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <dt className="font-medium text-ink-600">
                              {BREAKDOWN_LABELS[key]}
                            </dt>
                            <dd className="tabular-nums text-ink-400">
                              {count} · {formatPercent(share * 100, 0)}
                            </dd>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                            <motion.div
                              key={`${sample.id}-${key}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${share * 100}%` }}
                              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.12 }}
                              className={cn(
                                "h-full rounded-full",
                                key === "rule" && "bg-success-500",
                                key === "fuzzy" && "bg-teal-500",
                                key === "semantic" && "bg-brand-500",
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </dl>

                  {/* The checklist repeats what the badge above already says,
                      so it is desktop only to keep the phone layout short. */}
                  <ul className="hidden space-y-2 border-t border-line pt-4 lg:block">
                    {[
                      "No columns missing",
                      "No field claimed twice",
                      "Nothing needs review",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[0.8125rem] text-ink-500"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-3.5 shrink-0 text-success-500"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <ButtonLink
                    href="/app"
                    size="md"
                    fullWidth
                    className="justify-center"
                    trailingIcon={<ArrowUpRight className="size-3.5" aria-hidden />}
                  >
                    Run it on your own file
                  </ButtonLink>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="border-t border-line bg-surface-2/50 px-5 py-3 text-xs leading-relaxed text-ink-400 sm:px-6">
            These are the engine&rsquo;s real results for the sample files included with
            the project. Upload your own file for a live run.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
