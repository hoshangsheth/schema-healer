"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";

import { EASE_OUT } from "@/lib/motion";
import { useIsDesktop } from "@/hooks/use-media-query";
import type { RecoveryRun } from "@/services/schema-healer";
import { Button } from "@/components/shared/button";
import { Segmented, type SegmentOption } from "@/components/shared/segmented";
import { StickyBar } from "@/components/shared/sticky-bar";
import { StatusBanner } from "@/components/recovery/status-banner";
import { RecoveryTimeline } from "@/components/recovery/recovery-timeline";
import { SchemaComparison } from "@/components/recovery/schema-comparison";
import { MappingTable } from "@/components/recovery/mapping-table";
import { HealingReportPanel } from "@/components/report/healing-report";
import { DatasetPreview } from "@/components/preview/dataset-preview";
import { FeedbackPanel } from "@/components/feedback/feedback-section";

type MobileView = "overview" | "columns" | "data";

/**
 * The results screen.
 *
 * Desktop reads everything in one column. On a phone that becomes a very long
 * scroll through three unrelated concerns, so the same panels are split across
 * a segmented control and the download stays pinned within thumb reach.
 *
 * Results only exist after an upload, well after hydration, so choosing the
 * layout with a media query here is safe and avoids rendering both trees.
 */
export function ResultsView({
  run,
  filename,
  onDownload,
  onReset,
}: {
  run: RecoveryRun;
  filename: string;
  onDownload: () => void;
  onReset: () => void;
}) {
  const isDesktop = useIsDesktop();
  const [view, setView] = useState<MobileView>("overview");

  const banner = (
    <StatusBanner
      response={run.report}
      filename={filename}
      onDownload={onDownload}
      onReset={onReset}
      showActions={isDesktop}
    />
  );

  if (isDesktop) {
    return (
      <div className="space-y-4">
        {banner}
        <HealingReportPanel response={run.report} />
        <div className="grid gap-4 lg:grid-cols-2">
          <RecoveryTimeline response={run.report} />
          <SchemaComparison
            response={run.report}
            recoveredHeaders={run.dataset.preview.headers}
          />
        </div>
        <MappingTable response={run.report} />
        <DatasetPreview dataset={run.dataset} onDownload={onDownload} />
        <FeedbackPanel className="mt-2" />
      </div>
    );
  }

  const options: SegmentOption<MobileView>[] = [
    { value: "overview", label: "Overview" },
    {
      value: "columns",
      label: "Columns",
      count: run.report.mappings.length,
    },
    { value: "data", label: "Data", count: run.dataset.preview.totalRows },
  ];

  return (
    <div className="space-y-4">
      {banner}

      <Segmented
        options={options}
        value={view}
        onChange={setView}
        ariaLabel="Results sections"
        layoutId="results-segment"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="space-y-4"
        >
          {view === "overview" ? (
            <>
              <HealingReportPanel response={run.report} />
              <RecoveryTimeline response={run.report} />
              <SchemaComparison
                response={run.report}
                recoveredHeaders={run.dataset.preview.headers}
              />
              <FeedbackPanel />
            </>
          ) : null}

          {view === "columns" ? <MappingTable response={run.report} /> : null}

          {view === "data" ? (
            <DatasetPreview dataset={run.dataset} onDownload={onDownload} />
          ) : null}
        </motion.div>
      </AnimatePresence>

      <StickyBar revealAfterViewports={0}>
        <div className="flex items-center gap-2">
          <Button
            onClick={onDownload}
            className="min-h-12 flex-1"
            leadingIcon={<Download className="size-4" aria-hidden />}
          >
            Download CSV
          </Button>
          <Button
            variant="secondary"
            onClick={onReset}
            aria-label="Start over with a new file"
            className="min-h-12 w-12 shrink-0 px-0"
          >
            <RotateCcw className="size-4" aria-hidden />
          </Button>
        </div>
      </StickyBar>
    </div>
  );
}
