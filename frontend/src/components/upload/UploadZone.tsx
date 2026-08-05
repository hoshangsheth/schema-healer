"use client";

import { useId, useRef, useState, type DragEvent } from "react";

import { ACCEPTED_FILE_EXTENSION } from "@/lib/api/config";
import { Button } from "@/components/shared/Button";
import {
  FileIcon,
  RefreshIcon,
  UploadIcon,
  WandIcon,
} from "@/components/shared/Icons";

interface UploadZoneProps {
  selectedFile: File | null;
  isProcessing: boolean;
  onFileSelected: (file: File) => void;
  onClear: () => void;
  onSubmit: () => void;
}

/** Human-readable file size. */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(kilobytes / 1024).toFixed(2)} MB`;
}

/**
 * The backend accepts a file whose name ends in `.csv`
 * (`schema_processing_service.process_uploaded_schema`). The same check
 * runs here so an obviously wrong file is rejected without a round trip.
 * No size limit is applied because the backend does not impose one.
 */
function isCsvFile(file: File): boolean {
  return file.name.trim().toLowerCase().endsWith(ACCEPTED_FILE_EXTENSION);
}

export function UploadZone({
  selectedFile,
  isProcessing,
  onFileSelected,
  onClear,
  onSubmit,
}: UploadZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function accept(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!isCsvFile(file)) {
      setLocalError("Only CSV files are supported. Please choose a .csv file.");
      return;
    }

    setLocalError(null);
    onFileSelected(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (isProcessing) {
      return;
    }

    accept(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!isProcessing) {
      setIsDragging(true);
    }
  }

  function handleClear() {
    setLocalError(null);

    // Allow the same file to be picked again after a reset.
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onClear();
  }

  const dropZoneTone = isDragging
    ? "border-brand-400 bg-brand-50"
    : selectedFile
      ? "border-brand-200 bg-brand-50/40"
      : "border-ink-200 bg-ink-50/60 hover:border-brand-300 hover:bg-brand-50/40";

  return (
    <div className="flex h-full flex-col">
      <h3 className="text-base font-semibold text-ink-900">Upload a CSV</h3>
      <p className="mt-1 text-sm leading-6 text-ink-500">
        SchemaHealer reads the header row of your file. Row values are not
        used for matching.
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={`mt-5 flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${dropZoneTone} ${
          isProcessing ? "opacity-60" : ""
        }`}
      >
        {selectedFile ? (
          <>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-inset ring-brand-100">
              <FileIcon className="h-6 w-6" />
            </span>
            <p className="mt-4 max-w-full truncate text-sm font-medium text-ink-900">
              {selectedFile.name}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-400 shadow-sm ring-1 ring-inset ring-ink-200">
              <UploadIcon className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-medium text-ink-900">
              Drag and drop your CSV here
            </p>
            <p className="mt-1 text-xs text-ink-500">or browse for a file</p>
          </>
        )}

        {/*
          A real file input keeps the control keyboard-operable and
          screen-reader friendly; the label below is its visible trigger.
        */}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_FILE_EXTENSION}
          disabled={isProcessing}
          onChange={(event) => accept(event.target.files?.[0])}
          className="sr-only"
        />

        <label
          htmlFor={inputId}
          className={`mt-5 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-ink-900 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50 ${
            isProcessing ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {selectedFile ? "Choose a different file" : "Browse Files"}
        </label>
      </div>

      {localError && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700 ring-1 ring-inset ring-danger-200"
        >
          {localError}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={selectedFile === null || isProcessing}
          onClick={onSubmit}
        >
          <WandIcon className="h-4 w-4" />
          {isProcessing ? "Analyzing schema…" : "Analyze schema"}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          disabled={selectedFile === null || isProcessing}
          onClick={handleClear}
        >
          <RefreshIcon className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
