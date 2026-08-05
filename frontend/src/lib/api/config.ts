/**
 * API configuration.
 *
 * The backend base URL is supplied exclusively through the
 * `NEXT_PUBLIC_API_URL` environment variable so the same build works
 * against a local FastAPI process and a Render staging deployment.
 *
 * No URL is hardcoded anywhere else in the frontend.
 */

/**
 * Raw value of `NEXT_PUBLIC_API_URL`.
 *
 * `process.env.NEXT_PUBLIC_*` is inlined at build time, so it must be
 * referenced with a static property access rather than a dynamic lookup.
 */
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Resolved backend base URL, without a trailing slash.
 *
 * Returns `null` when the variable is missing so the UI can show a
 * configuration message instead of firing a request at a bad origin.
 */
export function getApiBaseUrl(): string | null {
  const value = RAW_API_URL?.trim();

  if (!value) {
    return null;
  }

  return value.replace(/\/+$/, "");
}

/** Whether the frontend has a usable backend configuration. */
export function isApiConfigured(): boolean {
  return getApiBaseUrl() !== null;
}

/**
 * Client-side request timeout in milliseconds.
 *
 * Semantic recovery calls Gemini, and the backend's own LLM timeout
 * defaults to 30s with up to 3 attempts, so the client budget is
 * deliberately generous.
 */
export const REQUEST_TIMEOUT_MS = 120_000;

/**
 * File constraints enforced by the backend.
 *
 * The backend validates the extension in
 * `services/schema_processing_service.py`. It does not currently impose
 * a maximum file size, so none is advertised or enforced here.
 */
export const ACCEPTED_FILE_EXTENSION = ".csv";
export const ACCEPTED_MIME_TYPES = [
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
] as const;
