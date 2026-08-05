"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ErrorState } from "@/components/results/ErrorState";
import { IdleState } from "@/components/results/IdleState";
import { ProcessingState } from "@/components/results/ProcessingState";
import { RecoveryResult } from "@/components/results/RecoveryResult";
import { Section } from "@/components/shared/Section";
import { UploadZone } from "@/components/upload/UploadZone";
import { isApiConfigured } from "@/lib/api/config";
import { validateSchema } from "@/lib/api/schemaHealerClient";
import type { DemoState } from "@/types/result";

/**
 * Interactive SchemaHealer demo.
 *
 * Owns the request lifecycle for the real backend call and nothing else:
 * all recovery, matching and validation happen server-side.
 */
export function SchemaHealerDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<DemoState>({ phase: "idle" });

  // Guards against a resolved request writing state after the component
  // unmounts or the user resets mid-flight.
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  const runAnalysis = useCallback(async (target: File) => {
    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    setState({ phase: "processing", fileName: target.name });

    const response = await validateSchema(target, controller.signal);

    // A newer request (or a reset) superseded this one.
    if (controller.signal.aborted) {
      return;
    }

    setState(
      response.ok
        ? { phase: "success", fileName: target.name, result: response.data }
        : { phase: "error", fileName: target.name, error: response.error },
    );
  }, []);

  function handleFileSelected(selected: File) {
    setFile(selected);
    setState({ phase: "idle" });
  }

  function handleClear() {
    requestRef.current?.abort();
    setFile(null);
    setState({ phase: "idle" });
  }

  function handleSubmit() {
    if (file) {
      void runAnalysis(file);
    }
  }

  const isProcessing = state.phase === "processing";

  return (
    <Section
      id="demo"
      className="bg-ink-50"
      eyebrow="Try it"
      heading="Run a CSV through SchemaHealer"
      description="Upload a real file. It is sent to the SchemaHealer API, which runs the full recovery pipeline and returns the mappings shown here."
    >
      <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-[0_1px_2px_rgba(11,13,23,0.04),0_12px_32px_-12px_rgba(11,13,23,0.12)]">
        {!isApiConfigured() && (
          <p className="border-b border-warning-200 bg-warning-50 px-6 py-3 text-sm text-warning-700">
            <span className="font-medium">Backend not configured.</span> Set{" "}
            <code className="font-mono">NEXT_PUBLIC_API_URL</code> to the
            SchemaHealer API address before uploading.
          </p>
        )}

        <div className="grid gap-px bg-ink-200 lg:grid-cols-2">
          <div className="bg-white p-6 sm:p-8">
            <UploadZone
              selectedFile={file}
              isProcessing={isProcessing}
              onFileSelected={handleFileSelected}
              onClear={handleClear}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="bg-white p-6 sm:p-8">
            {state.phase === "idle" && <IdleState />}

            {state.phase === "processing" && (
              <ProcessingState fileName={state.fileName} />
            )}

            {state.phase === "success" && (
              <RecoveryResult
                fileName={state.fileName}
                result={state.result}
              />
            )}

            {state.phase === "error" && (
              <ErrorState
                error={state.error}
                fileName={state.fileName}
                onRetry={handleSubmit}
                onReset={handleClear}
              />
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
