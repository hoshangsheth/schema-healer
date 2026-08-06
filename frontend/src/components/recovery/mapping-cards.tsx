"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownRight, Info } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import {
  METHOD_PRESENTATION,
  UNRESOLVED_PRESENTATION,
} from "@/lib/recovery-presentation";
import type { RecoveryMethod, SchemaMapping } from "@/types/api";
import { StrengthMeter } from "@/components/shared/strength-meter";
import { humanizeFieldName } from "@/utils/format";

/**
 * Touch layout for the column mappings.
 *
 * A table of three columns forces horizontal scrolling on a phone, so each
 * mapping becomes a card that reads top to bottom. The explanation of how the
 * match was made lives behind a tap here, because the desktop tooltip depends
 * on hover and never opens on a touch screen.
 */
export function MappingCards({ mappings }: { mappings: SchemaMapping[] }) {
  return (
    <ul className="divide-y divide-line">
      {mappings.map((mapping, index) => (
        <MappingCard key={`${mapping.source_header}-${index}`} mapping={mapping} />
      ))}
    </ul>
  );
}

function MappingCard({ mapping }: { mapping: SchemaMapping }) {
  const [open, setOpen] = useState(false);
  const resolved = mapping.status === "resolved" && mapping.recovery_method !== null;
  const presentation = resolved
    ? METHOD_PRESENTATION[mapping.recovery_method as RecoveryMethod]
    : UNRESOLVED_PRESENTATION;

  return (
    <li className={cn("px-4 py-3.5", !resolved && "bg-warn-50/40")}>
      <div className="space-y-1.5">
        <p className="font-mono text-[0.8125rem] text-ink-500">
          {mapping.source_header}
        </p>

        <div className="flex items-start gap-2">
          <CornerDownRight
            className="mt-0.5 size-3.5 shrink-0 text-ink-300"
            aria-hidden
          />
          {resolved && mapping.canonical_field ? (
            <div className="min-w-0">
              <p className="font-mono text-[0.875rem] font-medium break-words text-ink-900">
                {mapping.canonical_field}
              </p>
              <p className="text-[0.75rem] text-ink-400">
                {humanizeFieldName(mapping.canonical_field)}
              </p>
            </div>
          ) : (
            <span className="inline-flex items-center rounded-md bg-warn-100 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-warn-700">
              Kept original name
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <StrengthMeter
          segments={presentation.strength}
          tone={presentation.tone}
          label={presentation.strengthLabel}
        />

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={`Why this column was matched as ${presentation.strengthLabel}`}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
            open
              ? "border-brand-200 bg-brand-50 text-brand-600"
              : "border-line text-ink-400 active:bg-surface-2",
          )}
        >
          <Info className="size-4" aria-hidden />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden text-[0.8125rem] leading-relaxed text-ink-500"
          >
            <span className="mt-2.5 block rounded-lg bg-surface-2 p-3">
              {presentation.description}
              {mapping.normalized_source_header !== mapping.source_header ? (
                <span className="mt-1.5 block font-mono text-[0.6875rem] text-ink-400">
                  read as: {mapping.normalized_source_header}
                </span>
              ) : null}
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
