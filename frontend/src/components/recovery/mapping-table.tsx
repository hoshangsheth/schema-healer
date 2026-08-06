"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Filter, Search, TableProperties } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import {
  METHOD_PRESENTATION,
  UNRESOLVED_PRESENTATION,
  methodBreakdown,
} from "@/lib/recovery-presentation";
import type { RecoveryMethod, SchemaMapping, SchemaProcessingResponse } from "@/types/api";
import { Card, CardHeader } from "@/components/shared/card";
import { EmptyState } from "@/components/shared/feedback";
import { MappingCards } from "@/components/recovery/mapping-cards";
import { StrengthMeter } from "@/components/shared/strength-meter";
import { Tooltip } from "@/components/shared/tooltip";
import { humanizeFieldName } from "@/utils/format";

type FilterKey = "all" | RecoveryMethod | "unresolved";

const FILTER_LABELS: Record<Exclude<FilterKey, "all">, string> = {
  rule: "Known name",
  fuzzy: "Close match",
  semantic: "AI match",
  unresolved: "Needs review",
};

/**
 * Column by column account of the run: the name that arrived, the field it was
 * matched to, and how the match was made.
 */
export function MappingTable({ response }: { response: SchemaProcessingResponse }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = methodBreakdown(response);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: response.mappings.length },
    { key: "rule", label: FILTER_LABELS.rule, count: counts.rule },
    { key: "fuzzy", label: FILTER_LABELS.fuzzy, count: counts.fuzzy },
    { key: "semantic", label: FILTER_LABELS.semantic, count: counts.semantic },
    { key: "unresolved", label: FILTER_LABELS.unresolved, count: counts.unresolved },
  ];

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return response.mappings.filter((mapping) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unresolved"
            ? mapping.status === "pending"
            : mapping.recovery_method === filter;

      if (!matchesFilter) return false;
      if (!needle) return true;

      return (
        mapping.source_header.toLowerCase().includes(needle) ||
        mapping.normalized_source_header.toLowerCase().includes(needle) ||
        (mapping.canonical_field ?? "").toLowerCase().includes(needle)
      );
    });
  }, [response.mappings, query, filter]);

  return (
    <Card>
      <CardHeader
        title="Column by column"
        description="Every column that arrived, what it became, and how that was decided."
        icon={<TableProperties className="size-4" aria-hidden />}
      />

      <div className="flex flex-col gap-3 border-b border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="scrollbar-none -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Filter className="mr-1 size-3.5 shrink-0 text-ink-400" aria-hidden />
          {filters.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={active}
                disabled={item.count === 0 && item.key !== "all"}
                className={cn(
                  "relative min-h-11 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-40 lg:min-h-9",
                  active ? "text-white" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="mapping-filter"
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    className="absolute inset-0 rounded-full bg-ink-800"
                  />
                ) : null}
                <span className="relative">
                  {item.label}
                  <span
                    className={cn(
                      "ml-1.5 tabular-nums",
                      active ? "text-white/70" : "text-ink-300",
                    )}
                  >
                    {item.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative flex items-center sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 size-3.5 text-ink-400"
            aria-hidden
          />
          <span className="sr-only">Search columns</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search columns"
            aria-label="Search columns"
            className="h-9 w-full rounded-lg border border-line bg-surface-2 pl-8.5 pr-3 text-sm text-ink-800 placeholder:text-ink-400 transition-colors focus:border-brand-300 focus:bg-surface"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" aria-hidden />}
          title="No columns match"
          description="Try a different search term or clear the active filter."
        />
      ) : (
        <>
          {/* Touch: cards that read top to bottom, no sideways scrolling. */}
          <div className="max-h-[34rem] overflow-y-auto scrollbar-slim lg:hidden">
            <MappingCards mappings={visible} />
          </div>

          <div className="hidden max-h-[32rem] overflow-auto scrollbar-slim lg:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-surface-2/95 backdrop-blur">
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-400 sm:px-6"
                >
                  Column received
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-400"
                >
                  Matched to
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-400 lg:table-cell"
                >
                  Match strength
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((mapping, index) => (
                <MappingRow
                  key={`${mapping.source_header}-${index}`}
                  mapping={mapping}
                />
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </Card>
  );
}

function MappingRow({ mapping }: { mapping: SchemaMapping }) {
  const resolved = mapping.status === "resolved" && mapping.recovery_method !== null;
  const presentation = resolved
    ? METHOD_PRESENTATION[mapping.recovery_method as RecoveryMethod]
    : UNRESOLVED_PRESENTATION;

  return (
    <tr
      className={cn(
        "border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2/60",
        !resolved && "bg-warn-50/40",
      )}
    >
      <td className="px-5 py-3 align-top sm:px-6">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[0.8125rem] font-medium text-ink-900">
            {mapping.source_header}
          </span>
          {mapping.normalized_source_header !== mapping.source_header ? (
            <span className="font-mono text-[0.6875rem] text-ink-400">
              read as: {mapping.normalized_source_header}
            </span>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-3 align-top">
        {resolved && mapping.canonical_field ? (
          <div className="flex items-start gap-2">
            <ArrowRight
              className="mt-1 size-3.5 shrink-0 text-ink-300 lg:hidden"
              aria-hidden
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[0.8125rem] font-medium text-ink-900">
                {mapping.canonical_field}
              </span>
              <span className="text-[0.6875rem] text-ink-400">
                {humanizeFieldName(mapping.canonical_field)}
              </span>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center rounded-md bg-warn-100 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-warn-700">
            Kept original name
          </span>
        )}
      </td>

      <td className="hidden px-4 py-3 align-top lg:table-cell">
        <Tooltip label={presentation.description}>
          <StrengthMeter
            segments={presentation.strength}
            tone={presentation.tone}
            label={presentation.strengthLabel}
          />
        </Tooltip>
      </td>
    </tr>
  );
}
