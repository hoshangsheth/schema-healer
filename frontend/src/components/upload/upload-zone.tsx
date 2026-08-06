"use client";

import { useCallback, useMemo } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { FileSpreadsheet, FolderOpen, UploadCloud } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT, springSoft } from "@/lib/motion";
import { buildApiError } from "@/lib/api-error";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/shared/button";
import {
  ACCEPTED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  formatBytes,
  validateCsvFile,
} from "@/utils/file";

/**
 * Drag and drop upload surface.
 *
 * Files are checked in the browser against the same rules the service applies,
 * so an unsupported file is refused straight away with a readable reason rather
 * than after a round trip.
 */
export function UploadZone({
  onFileAccepted,
  disabled = false,
}: {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}) {
  const { push } = useToast();

  const rejectFile = useCallback(
    (reason: "invalid_file_type" | "file_too_large") => {
      const error = buildApiError(reason);
      push({ tone: "warn", title: error.title, message: error.message });
    },
    [push],
  );

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const tooLarge = rejections.some((rejection) =>
          rejection.errors.some((error) => error.code === "file-too-large"),
        );
        rejectFile(tooLarge ? "file_too_large" : "invalid_file_type");
        return;
      }

      const file = accepted[0];
      if (!file) return;

      const problem = validateCsvFile(file);
      if (problem) {
        rejectFile(problem);
        return;
      }

      onFileAccepted(file);
    },
    [onFileAccepted, rejectFile],
  );

  const accept = useMemo(
    () =>
      Object.fromEntries(ACCEPTED_MIME_TYPES.map((type) => [type, [".csv"]])) as Record<
        string,
        string[]
      >,
    [],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    maxSize: MAX_UPLOAD_BYTES,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative overflow-hidden rounded-panel border-2 border-dashed transition-colors duration-200",
        isDragReject
          ? "border-danger-300 bg-danger-50/60"
          : isDragActive
            ? "border-brand-400 bg-brand-50/70"
            : "border-line-strong bg-surface hover:border-brand-300",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input {...getInputProps()} aria-label="Upload a CSV file" />

      {/* Sweep highlight while a file is over the zone. */}
      <AnimatePresence>
        {isDragActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/60 via-transparent to-teal-100/50"
          />
        ) : null}
      </AnimatePresence>

      <div className="relative flex flex-col items-center gap-4 px-5 py-10 text-center sm:gap-5 sm:px-6 sm:py-16">
        <motion.div
          animate={{
            y: isDragActive ? -6 : 0,
            scale: isDragActive ? 1.05 : 1,
          }}
          transition={springSoft}
          className="relative"
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-2xl blur-xl transition-colors",
              isDragActive ? "bg-brand-300/50" : "bg-brand-200/30",
            )}
          />
          <span
            className={cn(
              "relative flex size-16 items-center justify-center rounded-2xl border transition-colors",
              isDragActive
                ? "border-brand-300 bg-brand-100 text-brand-700"
                : "border-line bg-surface-2 text-brand-600",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDragActive ? "drop" : "idle"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
              >
                {isDragActive ? (
                  <FileSpreadsheet className="size-7" aria-hidden />
                ) : (
                  <UploadCloud className="size-7" aria-hidden />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <div className="space-y-1.5">
          <p className="text-lg font-semibold tracking-[-0.02em] text-ink-900">
            {isDragActive ? "Drop to start" : "Choose a CSV file"}
            <span className="hidden sm:inline">{isDragActive ? "" : " or drop it here"}</span>
          </p>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-ink-500">
            Your file is processed in memory and returned rebuilt, with a report of every
            column that changed.
          </p>
        </div>

        {/* On touch there is nothing to drag from, so the button is the
            primary action rather than a fallback. */}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={open}
          disabled={disabled}
          className="w-full max-w-xs justify-center sm:w-auto"
          leadingIcon={<FolderOpen className="size-4" aria-hidden />}
        >
          Choose a CSV file
        </Button>

        <p className="text-xs text-ink-400">
          CSV only · up to {formatBytes(MAX_UPLOAD_BYTES)} · comma, semicolon, tab or pipe
          separated
        </p>
      </div>
    </div>
  );
}
