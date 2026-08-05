/**
 * Translation of transport and HTTP failures into `ApiError`.
 *
 * Raw response bodies, stack traces and FastAPI validation payloads are
 * never surfaced to the user. Everything that reaches the UI is a short
 * message written for a human.
 */

import type { ApiError, ApiErrorKind } from "@/types/result";

/** Shape of a FastAPI `HTTPException` body. */
interface FastApiErrorBody {
  detail?: unknown;
}

/**
 * Extract a displayable message from a FastAPI error body.
 *
 * `detail` is a plain string for the backend's own `HTTPException`s and
 * a list of objects for 422 request-validation errors. Only the string
 * form is trusted for display.
 */
function readDetail(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const detail = (body as FastApiErrorBody).detail;

  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail.trim();
  }

  return null;
}

function buildError(
  kind: ApiErrorKind,
  message: string,
  status: number | undefined,
  retryable: boolean,
): ApiError {
  return { kind, message, status, retryable };
}

/**
 * Map a non-2xx response onto an `ApiError`.
 *
 * @param status HTTP status code.
 * @param body   Parsed response body, when the body was valid JSON.
 */
export function errorFromResponse(status: number, body: unknown): ApiError {
  const detail = readDetail(body);

  if (status === 400) {
    // The backend raises 400 for a non-CSV upload and for a CSV with no
    // header row. The detail text distinguishes them.
    const isEmpty = detail?.toLowerCase().includes("empty") ?? false;

    return buildError(
      isEmpty ? "empty_file" : "invalid_file",
      detail ?? "The uploaded file could not be processed.",
      status,
      false,
    );
  }

  if (status === 413) {
    return buildError(
      "invalid_file",
      "The uploaded file was rejected because it is too large.",
      status,
      false,
    );
  }

  if (status === 422) {
    // FastAPI request-validation failure. The body is a list of
    // per-field objects that is not meaningful to an end user.
    return buildError(
      "invalid_file",
      "The upload was rejected by the server. Please select a CSV file and try again.",
      status,
      false,
    );
  }

  if (status === 429) {
    return buildError(
      "rate_limited",
      "Too many requests have been sent. Please wait a moment and try again.",
      status,
      true,
    );
  }

  if (status >= 500) {
    return buildError(
      "server_error",
      "SchemaHealer could not complete the analysis. This is a problem on the server, not with your file.",
      status,
      true,
    );
  }

  return buildError(
    "server_error",
    detail ?? "The server returned an unexpected response.",
    status,
    true,
  );
}

/** Failure raised before any response was received. */
export function errorFromTransport(cause: unknown): ApiError {
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return buildError(
      "timeout",
      "The request took too long and was cancelled. The backend may still be starting up.",
      undefined,
      true,
    );
  }

  return buildError(
    "network",
    "SchemaHealer could not reach the backend. Check that the API is running and reachable.",
    undefined,
    true,
  );
}

/** Response arrived, but its body did not match the expected contract. */
export function errorFromMalformedResponse(): ApiError {
  return buildError(
    "malformed_response",
    "The backend returned a response SchemaHealer could not interpret.",
    undefined,
    true,
  );
}

/** The frontend is missing `NEXT_PUBLIC_API_URL`. */
export function errorFromMissingConfiguration(): ApiError {
  return buildError(
    "network",
    "The API address is not configured. Set NEXT_PUBLIC_API_URL and reload.",
    undefined,
    false,
  );
}
