/**
 * A single, presentable error shape for everything the recovery flow can hit.
 *
 * Raw backend payloads, stack traces and fetch exceptions never reach the UI:
 * they are normalised here into a code the interface can render deliberately.
 */

export type ApiErrorCode =
  | "invalid_file_type"
  | "empty_file"
  | "file_too_large"
  | "no_file"
  | "backend_unavailable"
  | "backend_error"
  | "request_cancelled"
  | "unknown";

export interface ApiErrorPayload {
  code: ApiErrorCode;
  /** Short, user-facing headline. */
  title: string;
  /** One or two sentences explaining what to do next. */
  message: string;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly title: string;
  readonly status: number;

  constructor(payload: ApiErrorPayload, status: number) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.title = payload.title;
    this.status = status;
  }

  toPayload(): ApiErrorPayload {
    return { code: this.code, title: this.title, message: this.message };
  }
}

const CATALOGUE: Record<ApiErrorCode, Omit<ApiErrorPayload, "code">> = {
  invalid_file_type: {
    title: "That file type isn't supported",
    message: "SchemaHealer reads CSV files. Export your data as .csv and try again.",
  },
  empty_file: {
    title: "This CSV has no header row",
    message:
      "The uploaded file contains no readable column headers, so there is no schema to recover.",
  },
  file_too_large: {
    title: "File is too large to upload",
    message:
      "Trim the export or split it into smaller files, then upload again.",
  },
  no_file: {
    title: "No file was attached",
    message: "Choose a CSV file to run schema recovery.",
  },
  backend_unavailable: {
    title: "Recovery service is unreachable",
    message:
      "We couldn't reach the SchemaHealer API. Check that the backend is running, then retry.",
  },
  backend_error: {
    title: "Recovery could not be completed",
    message:
      "The recovery service returned an unexpected error while processing this file. Retrying usually resolves it.",
  },
  request_cancelled: {
    title: "Upload cancelled",
    message: "The recovery run was stopped before it finished.",
  },
  unknown: {
    title: "Something went wrong",
    message: "An unexpected error interrupted the recovery run. Please try again.",
  },
};

/** Build a full payload from a code, optionally overriding the message. */
export function buildApiError(
  code: ApiErrorCode,
  overrides?: Partial<Omit<ApiErrorPayload, "code">>,
): ApiErrorPayload {
  return { code, ...CATALOGUE[code], ...overrides };
}

/**
 * Translate a FastAPI `detail` string into a known error code.
 *
 * The backend raises `InvalidFileTypeError` and `EmptyFileError` as HTTP 400
 * with a plain-text detail; both are matched here.
 */
export function codeFromBackendDetail(detail: unknown): ApiErrorCode {
  const text = typeof detail === "string" ? detail.toLowerCase() : "";
  if (text.includes("csv files are supported")) return "invalid_file_type";
  if (text.includes("empty")) return "empty_file";
  return "backend_error";
}

/** Narrow an unknown thrown value to a presentable payload. */
export function toApiErrorPayload(error: unknown): ApiErrorPayload {
  if (error instanceof ApiError) return error.toPayload();
  if (error instanceof DOMException && error.name === "AbortError") {
    return buildApiError("request_cancelled");
  }
  if (error instanceof TypeError) {
    // `fetch` rejects with a TypeError when the network itself fails.
    return buildApiError("backend_unavailable");
  }
  return buildApiError("unknown");
}
