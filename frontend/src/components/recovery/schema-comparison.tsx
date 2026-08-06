"use client";

import { ArrowLeftRight } from "lucide-react";

import { cn } from "@/lib/cn";
import type { SchemaProcessingResponse } from "@/types/api";
import { Card, CardHeader } from "@/components/shared/card";
import { pluralize } from "@/utils/format";

/**
 * Before and after: the column names that arrived, next to the ones in the
 * rebuilt file.
 */
export function SchemaComparison({
  response,
  recoveredHeaders,
}: {
  response: SchemaProcessingResponse;
  recoveredHeaders: string[];
}) {
  const uploaded = response.mappings.map((mapping) => ({
    label: mapping.source_header,
    changed: mapping.status === "resolved",
  }));

  const unresolvedHeaders = new Set(
    response.mappings
      .filter((mapping) => mapping.status !== "resolved")
      .map((mapping) => mapping.source_header),
  );

  return (
    <Card>
      <CardHeader
        title="Before and after"
        description="The column names you sent, and the ones you get back."
        icon={<ArrowLeftRight className="size-4" aria-hidden />}
      />

      <div className="grid gap-px bg-line sm:grid-cols-2">
        <SchemaColumn
          title="Received"
          caption={`${uploaded.length} ${pluralize(uploaded.length, "name")} as they arrived`}
          items={uploaded.map((item) => ({
            label: item.label,
            tone: item.changed ? "muted" : "warn",
          }))}
        />
        <SchemaColumn
          title="Rebuilt"
          caption={`${recoveredHeaders.length} ${pluralize(recoveredHeaders.length, "name")} in the download`}
          items={recoveredHeaders.map((header) => ({
            label: header,
            tone: unresolvedHeaders.has(header) ? "warn" : "resolved",
          }))}
        />
      </div>
    </Card>
  );
}

function SchemaColumn({
  title,
  caption,
  items,
}: {
  title: string;
  caption: string;
  items: { label: string; tone: "muted" | "resolved" | "warn" }[];
}) {
  return (
    <div className="min-w-0 bg-surface p-5 sm:p-6">
      <div className="mb-3">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <p className="text-xs text-ink-400">{caption}</p>
      </div>

      <ul className="flex max-h-64 flex-wrap gap-1.5 overflow-auto scrollbar-slim">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className={cn(
              "rounded-md px-2 py-1 font-mono text-[0.6875rem]",
              item.tone === "resolved" && "bg-success-50 text-success-700",
              item.tone === "warn" && "bg-warn-50 text-warn-700",
              item.tone === "muted" && "bg-surface-2 text-ink-500",
            )}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
