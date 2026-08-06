/**
 * Upload constraints and file helpers.
 *
 * The backend does not impose a size limit of its own, so this ceiling is a
 * front-end guard: it keeps a mistaken multi-gigabyte upload from tying up the
 * recovery pipeline, and it gives the user an immediate, explainable failure
 * instead of a timeout. Tune it with `NEXT_PUBLIC_MAX_UPLOAD_MB`.
 */

export const MAX_UPLOAD_BYTES =
  Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ?? 50) * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = [".csv"] as const;

/**
 * MIME types browsers report for CSV. The list is intentionally permissive
 * because Windows and Excel frequently report `application/vnd.ms-excel` for a
 * plain `.csv`; the extension is the authoritative check, matching the
 * backend, which validates on filename only.
 */
export const ACCEPTED_MIME_TYPES = [
  "text/csv",
  "text/plain",
  "application/csv",
  "application/vnd.ms-excel",
] as const;

export type FileRejectionReason = "invalid_file_type" | "file_too_large";

export function hasCsvExtension(filename: string): boolean {
  return filename.trim().toLowerCase().endsWith(".csv");
}

/** Mirror of the backend's own guard, applied before the network round-trip. */
export function validateCsvFile(file: File): FileRejectionReason | null {
  if (!hasCsvExtension(file.name)) return "invalid_file_type";
  if (file.size > MAX_UPLOAD_BYTES) return "file_too_large";
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
