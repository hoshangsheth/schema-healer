import { ApiError, buildApiError, type ApiErrorPayload } from "@/lib/api-error";
import type { SchemaProcessingResponse } from "@/types/api";
import { parseCsv, stripBom, type ParsedCsv } from "@/utils/csv";

/**
 * The single place the browser talks to the recovery API.
 *
 * Components never call `fetch` themselves; they consume the TanStack Query
 * hooks in `@/hooks`, which call into this module.
 */

export interface RecoveredDataset {
  /** Exact CSV bytes produced by the backend exporter. */
  blob: Blob;
  filename: string;
  preview: ParsedCsv;
}

export interface RecoveryRun {
  report: SchemaProcessingResponse;
  dataset: RecoveredDataset;
}

async function readErrorPayload(response: Response): Promise<ApiErrorPayload> {
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === "object" &&
      "error" in body &&
      body.error &&
      typeof body.error === "object" &&
      "code" in body.error
    ) {
      return body.error as ApiErrorPayload;
    }
  } catch {
    /* fall through to the generic payload */
  }
  return buildApiError(response.status >= 500 ? "backend_error" : "unknown");
}

function formDataFor(file: File): FormData {
  const body = new FormData();
  body.append("file", file, file.name);
  return body;
}

async function postFile(
  endpoint: string,
  file: File,
  signal?: AbortSignal,
): Promise<Response> {
  const response = await fetch(endpoint, {
    method: "POST",
    body: formDataFor(file),
    signal,
  });

  if (!response.ok) {
    throw new ApiError(await readErrorPayload(response), response.status);
  }

  return response;
}

/** Run the recovery pipeline and return the structured report. */
export async function fetchHealingReport(
  file: File,
  signal?: AbortSignal,
): Promise<SchemaProcessingResponse> {
  const response = await postFile("/api/schema/validate", file, signal);
  return (await response.json()) as SchemaProcessingResponse;
}

/**
 * Fetch the rebuilt file, exactly as the service exported it.
 *
 * The blob is built from the raw bytes rather than from decoded text, so what
 * the user downloads is byte for byte what the service produced. The decoded
 * copy is only used to render the preview.
 */
export async function fetchRecoveredDataset(
  file: File,
  signal?: AbortSignal,
): Promise<RecoveredDataset> {
  const response = await postFile("/api/schema/export", file, signal);
  const contentType = response.headers.get("content-type") ?? "text/csv";
  const bytes = await response.arrayBuffer();
  const text = stripBom(new TextDecoder("utf-8").decode(bytes));

  return {
    blob: new Blob([bytes], { type: contentType }),
    filename: filenameFrom(response) ?? "recovered_dataset.csv",
    preview: parseCsv(text),
  };
}

/**
 * Execute a complete recovery run.
 *
 * The JSON response carries the report but no data rows, and the CSV response
 * carries the rows but no report: the endpoint returns one or the other. Both
 * are therefore requested in parallel from a single user action, and the CSV
 * body is retained so the preview and the download share identical bytes and
 * only one export round trip is ever made.
 */
export async function runRecovery(
  file: File,
  signal?: AbortSignal,
): Promise<RecoveryRun> {
  const [report, dataset] = await Promise.all([
    fetchHealingReport(file, signal),
    fetchRecoveredDataset(file, signal),
  ]);

  return { report, dataset };
}

function filenameFrom(response: Response): string | null {
  const disposition = response.headers.get("content-disposition");
  if (!disposition) return null;
  const match = /filename="?([^"';]+)"?/i.exec(disposition);
  return match?.[1]?.trim() ?? null;
}

/** Trigger a browser download for CSV bytes already received from the backend. */
export function downloadDataset(dataset: RecoveredDataset): void {
  const url = URL.createObjectURL(dataset.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = dataset.filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
