"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  Search,
  TableCellsMerge,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { RecoveredDataset } from "@/services/schema-healer";
import { Button } from "@/components/shared/button";
import { Card, CardHeader } from "@/components/shared/card";
import { EmptyState } from "@/components/shared/feedback";
import { DatasetCards } from "@/components/preview/dataset-cards";
import { formatCount, pluralize, truncate } from "@/utils/format";
import { PREVIEW_ROW_LIMIT } from "@/utils/csv";

const PAGE_SIZE = 25;

/**
 * Preview of the rebuilt file.
 *
 * The rows are read from the CSV the service exported, which is the same file
 * the download button saves, so the preview cannot disagree with what the user
 * receives.
 */
export function DatasetPreview({
  dataset,
  onDownload,
}: {
  dataset: RecoveredDataset;
  onDownload: () => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const { headers, rows, totalRows, truncated } = dataset.preview;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(needle)));
  }, [rows, query]);

  const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <Card>
      <CardHeader
        title="Rebuilt file"
        description={
          <>
            {formatCount(totalRows)} {pluralize(totalRows, "row")} · {headers.length}{" "}
            {pluralize(headers.length, "column")}
            {truncated
              ? `, previewing the first ${formatCount(PREVIEW_ROW_LIMIT)}`
              : ""}
          </>
        }
        icon={<Database className="size-4" aria-hidden />}
        action={
          <Button
            size="sm"
            variant="secondary"
            onClick={onDownload}
            leadingIcon={<Download className="size-3.5" aria-hidden />}
          >
            Download
          </Button>
        }
      />

      <div className="border-b border-line px-5 py-3.5 sm:px-6">
        <label className="relative flex items-center sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 size-3.5 text-ink-400"
            aria-hidden
          />
          <span className="sr-only">Search rows</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Search rows"
            aria-label="Search rows"
            className="h-9 w-full rounded-lg border border-line bg-surface-2 pl-8.5 pr-3 text-sm text-ink-800 placeholder:text-ink-400 transition-colors focus:border-brand-300 focus:bg-surface"
          />
        </label>
      </div>

      {headers.length === 0 ? (
        <EmptyState
          icon={<TableCellsMerge className="size-5" aria-hidden />}
          title="Nothing to preview"
          description="The rebuilt file contains no readable columns."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" aria-hidden />}
          title="No rows match your search"
          description="Try a shorter term, or clear the search to see the whole file."
          action={
            <Button size="sm" variant="ghost" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <>
          {/* Touch: one card per row, so a wide file never scrolls sideways. */}
          <div className="max-h-[32rem] overflow-y-auto scrollbar-slim lg:hidden">
            <DatasetCards
              headers={headers}
              rows={visible}
              startIndex={safePage * PAGE_SIZE}
            />
          </div>

          <div className="hidden max-h-[30rem] overflow-auto scrollbar-slim lg:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-surface-2/95 backdrop-blur">
                <tr className="border-b border-line">
                  <th
                    scope="col"
                    className="w-12 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-300"
                  >
                    #
                  </th>
                  {headers.map((header, index) => (
                    <th
                      key={`${header}-${index}`}
                      scope="col"
                      className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-semibold text-ink-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, rowIndex) => (
                  <tr
                    key={safePage * PAGE_SIZE + rowIndex}
                    className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-4 py-2.5 text-xs tabular-nums text-ink-300">
                      {safePage * PAGE_SIZE + rowIndex + 1}
                    </td>
                    {headers.map((_, columnIndex) => (
                      <td
                        key={columnIndex}
                        className={cn(
                          "whitespace-nowrap px-4 py-2.5 text-[0.8125rem] text-ink-700",
                          row[columnIndex] ? "" : "text-ink-300",
                        )}
                      >
                        {row[columnIndex] ? truncate(row[columnIndex]) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 sm:px-6">
            <p className="text-xs text-ink-400">
              Showing {formatCount(safePage * PAGE_SIZE + 1)} to{" "}
              {formatCount(safePage * PAGE_SIZE + visible.length)} of{" "}
              {formatCount(filtered.length)}
              {query ? " matching" : ""} {pluralize(filtered.length, "row")}
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={safePage === 0}
                leadingIcon={<ChevronLeft className="size-3.5" aria-hidden />}
              >
                Previous
              </Button>
              <span className="px-1 text-xs tabular-nums text-ink-500">
                {safePage + 1} / {pageCount}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((current) => Math.min(current + 1, pageCount - 1))}
                disabled={safePage >= pageCount - 1}
                trailingIcon={<ChevronRight className="size-3.5" aria-hidden />}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
