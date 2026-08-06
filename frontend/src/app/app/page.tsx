"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileSpreadsheet, Sparkles, X } from "lucide-react";

import { pageTransition } from "@/lib/motion";
import { downloadDataset } from "@/services/schema-healer";
import { useRecoveryRun } from "@/hooks/use-recovery-run";
import { useToast } from "@/components/shared/toast";
import { Aurora } from "@/components/shared/aurora";
import { Button } from "@/components/shared/button";
import { ErrorCard } from "@/components/shared/feedback";
import { Eyebrow } from "@/components/shared/badge";
import { UploadZone } from "@/components/upload/upload-zone";
import { ProcessingPipeline } from "@/components/recovery/processing-pipeline";
import { ResultsView } from "@/components/recovery/results-view";
import { formatBytes } from "@/utils/file";

/**
 * The recovery workspace.
 *
 * One linear flow: choose a file, watch it run, read the report. The selected
 * file is kept in state so a retry never needs a second pick.
 */
export default function WorkspacePage() {
  const [file, setFile] = useState<File | null>(null);
  const { start, cancel, reset, run, error, isRunning, isSuccess } = useRecoveryRun();
  const { push } = useToast();

  const handleFile = useCallback(
    (accepted: File) => {
      setFile(accepted);
      start(accepted);
    },
    [start],
  );

  const handleRetry = useCallback(() => {
    if (file) start(file);
  }, [file, start]);

  const handleReset = useCallback(() => {
    reset();
    setFile(null);
  }, [reset]);

  const handleCancel = useCallback(() => {
    cancel();
    setFile(null);
  }, [cancel]);

  const handleDownload = useCallback(() => {
    if (!run) return;
    downloadDataset(run.dataset);
    push({
      tone: "success",
      title: "Download started",
      message: `${run.dataset.filename} is the file the recovery service produced.`,
    });
  }, [run, push]);

  // Announce the outcome once, when the run resolves.
  useEffect(() => {
    if (!isSuccess || !run) return;
    const { summary, recovery_summary: recovery } = run.report.healing_report;

    push(
      summary.requires_manual_intervention
        ? {
            tone: "warn",
            title: "Recovered, with items to review",
            message: `${recovery.unresolved_columns} of ${recovery.total_uploaded_columns} columns need a decision.`,
          }
        : {
            tone: "success",
            title: "File recovered and verified",
            message: `All ${recovery.total_uploaded_columns} columns were matched to your field list.`,
          },
    );
  }, [isSuccess, run, push]);

  const stage = isRunning ? "processing" : run ? "results" : "idle";

  return (
    <div className="relative">
      <Aurora className="h-[24rem]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        <AnimatePresence mode="wait">
          {stage === "idle" ? (
            <motion.div
              key="idle"
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mx-auto max-w-3xl space-y-5"
            >
              <div className="space-y-3 text-center">
                <Eyebrow>
                  <Sparkles className="size-3" aria-hidden />
                  Recovery workspace
                </Eyebrow>
                <h1 className="text-balance text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-ink-900 sm:text-4xl">
                  Upload the file that changed
                </h1>
                <p className="mx-auto max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-ink-500 sm:text-base">
                  Your file is matched against your field list, checked, and returned with
                  the column names your systems expect, plus a report of every change.
                </p>
              </div>

              {error ? (
                <ErrorCard
                  error={error}
                  onRetry={file ? handleRetry : undefined}
                  onReset={handleReset}
                />
              ) : null}

              <UploadZone onFileAccepted={handleFile} />

              {file && !isRunning ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-soft">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-500">
                      <FileSpreadsheet className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate font-mono text-[0.8125rem] text-ink-800">
                        {file.name}
                      </p>
                      <p className="text-xs text-ink-400">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleReset}
                    leadingIcon={<X className="size-3.5" aria-hidden />}
                  >
                    Clear
                  </Button>
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {stage === "processing" && file ? (
            <motion.div
              key="processing"
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mx-auto max-w-3xl"
            >
              <ProcessingPipeline
                file={file}
                isRunning={isRunning}
                isComplete={false}
                onCancel={handleCancel}
              />
            </motion.div>
          ) : null}

          {stage === "results" && run ? (
            <motion.div
              key="results"
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ResultsView
                run={run}
                filename={file?.name ?? run.dataset.filename}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
