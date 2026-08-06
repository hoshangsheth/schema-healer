"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { EASE_OUT } from "@/lib/motion";
import { truncate } from "@/utils/format";

/** Fields shown before a record needs expanding. */
const COLLAPSED_FIELDS = 4;

/**
 * Touch layout for the rebuilt file.
 *
 * A wide file cannot be read as a table on a phone without scrolling sideways
 * through every column, so each row becomes a record card of label and value
 * pairs, with the long tail of fields behind a tap.
 */
export function DatasetCards({
  headers,
  rows,
  startIndex,
}: {
  headers: string[];
  rows: string[][];
  startIndex: number;
}) {
  return (
    <ul className="divide-y divide-line">
      {rows.map((row, index) => (
        <RecordCard
          key={startIndex + index}
          headers={headers}
          row={row}
          position={startIndex + index + 1}
        />
      ))}
    </ul>
  );
}

function RecordCard({
  headers,
  row,
  position,
}: {
  headers: string[];
  row: string[];
  position: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = headers.length > COLLAPSED_FIELDS;
  const shown = expanded ? headers : headers.slice(0, COLLAPSED_FIELDS);

  return (
    <li className="px-4 py-3.5">
      <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-300">
        Row {position}
      </p>

      <dl className="space-y-1.5">
        {shown.map((header, index) => (
          <FieldRow key={`${header}-${index}`} label={header} value={row[index]} />
        ))}
      </dl>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-brand-600"
        >
          {expanded
            ? "Show fewer fields"
            : `Show all ${headers.length} fields`}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <ChevronDown className="size-3.5" aria-hidden />
          </motion.span>
        </button>
      ) : null}
    </li>
  );
}

function FieldRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="min-w-0 shrink-0 basis-2/5 truncate font-mono text-[0.6875rem] text-ink-400">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-right text-[0.8125rem] break-words text-ink-700">
        {value ? truncate(value, 48) : <span className="text-ink-300">-</span>}
      </dd>
    </div>
  );
}
