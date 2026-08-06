import "server-only";

import {
  ApiError,
  buildApiError,
  codeFromBackendDetail,
  type ApiErrorPayload,
} from "@/lib/api-error";
import { MAX_UPLOAD_BYTES, hasCsvExtension } from "@/utils/file";

/**
 * Server-side bridge to the FastAPI service.
 *
 * Everything the browser sends goes through a Next route handler rather than
 * straight to FastAPI. Two reasons:
 *
 *   1. The backend registers no CORS middleware, so a direct browser call from
 *      another origin would be blocked, and adding middleware would mean
 *      changing the backend.
 *   2. The upstream address stays server-side, which keeps deployment topology
 *      out of the client bundle.
 */

const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";

/** Recovery may call an LLM, so the ceiling is generous but finite. */
const REQUEST_TIMEOUT_MS = Number(process.env.BACKEND_TIMEOUT_MS ?? 180_000);

export type BackendOutput = "json" | "csv";

function backendBaseUrl(): string {
  const configured = process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL;
  return configured.replace(/\/+$/, "");
}

/** Pull the uploaded file out of the incoming request and pre-validate it. */
export async function readUploadedFile(request: Request): Promise<File> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new ApiError(buildApiError("no_file"), 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new ApiError(buildApiError("no_file"), 400);
  }
  if (!hasCsvExtension(file.name)) {
    throw new ApiError(buildApiError("invalid_file_type"), 400);
  }
  // A zero-byte CSV is an empty file, not a missing one.
  if (file.size === 0) {
    throw new ApiError(buildApiError("empty_file"), 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ApiError(buildApiError("file_too_large"), 413);
  }

  return file;
}

/**
 * Forward a CSV to `POST /schema/validate` and return the raw upstream
 * response, leaving body handling to the caller (JSON parse or CSV stream).
 */
export async function forwardToBackend(
  file: File,
  output: BackendOutput,
  signal?: AbortSignal,
): Promise<Response> {
  const body = new FormData();
  body.append("file", file, file.name);

  const url = `${backendBaseUrl()}/schema/validate?output=${output}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body,
      cache: "no-store",
      signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError(
        buildApiError("backend_error", {
          title: "Recovery timed out",
          message:
            "The recovery service did not respond in time. Files with a lot of columns take longer, so try again or upload a smaller sample.",
        }),
        504,
      );
    }
    throw new ApiError(buildApiError("backend_unavailable"), 503);
  }

  if (!response.ok) {
    throw await backendErrorFrom(response);
  }

  return response;
}

/** Translate a non-2xx FastAPI response into a presentable ApiError. */
async function backendErrorFrom(response: Response): Promise<ApiError> {
  let detail: unknown;
  try {
    const payload: unknown = await response.json();
    detail =
      payload && typeof payload === "object" && "detail" in payload
        ? (payload as { detail: unknown }).detail
        : undefined;
  } catch {
    detail = undefined;
  }

  if (response.status === 400) {
    return new ApiError(buildApiError(codeFromBackendDetail(detail)), 400);
  }
  if (response.status === 422) {
    return new ApiError(buildApiError("no_file"), 400);
  }
  return new ApiError(buildApiError("backend_error"), 502);
}

/** Uniform JSON error envelope returned by every proxy route. */
export function errorResponse(error: unknown): Response {
  const apiError =
    error instanceof ApiError
      ? error
      : new ApiError(buildApiError("unknown"), 500);

  const payload: ApiErrorPayload = apiError.toPayload();

  return Response.json({ error: payload }, { status: apiError.status });
}
