/**
 * Client for the SchemaHealer FastAPI backend.
 *
 * This module owns all network access. Components never call `fetch`
 * directly and never see an HTTP status code.
 */

import {
  getApiBaseUrl,
  REQUEST_TIMEOUT_MS,
} from "@/lib/api/config";
import {
  errorFromMalformedResponse,
  errorFromMissingConfiguration,
  errorFromResponse,
  errorFromTransport,
} from "@/lib/api/errors";
import type { SchemaProcessingResult } from "@/types/api";
import type { ApiError } from "@/types/result";

/** Discriminated result so callers never have to catch. */
export type ValidateSchemaResult =
  | { ok: true; data: SchemaProcessingResult }
  | { ok: false; error: ApiError };

/**
 * Structural check of the 200 body.
 *
 * Guards against a proxy or misconfigured origin returning HTML or an
 * unrelated JSON document with a 200 status.
 */
function isSchemaProcessingResult(
  value: unknown,
): value is SchemaProcessingResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<SchemaProcessingResult>;

  if (!Array.isArray(candidate.mappings)) {
    return false;
  }

  const validation = candidate.validation_result;

  return (
    typeof validation === "object" &&
    validation !== null &&
    typeof validation.is_valid === "boolean" &&
    Array.isArray(validation.unresolved_headers) &&
    Array.isArray(validation.duplicate_canonical_fields) &&
    Array.isArray(validation.invalid_mappings)
  );
}

/** Parse a response body as JSON, returning `null` when it is not JSON. */
async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Submit a CSV file to `POST /schema/validate`.
 *
 * The field name `file` and the multipart encoding are dictated by the
 * `UploadFile = File(...)` parameter on the backend endpoint.
 *
 * @param file   CSV selected by the user.
 * @param signal Optional caller-owned abort signal, combined with the
 *               built-in request timeout.
 */
export async function validateSchema(
  file: File,
  signal?: AbortSignal,
): Promise<ValidateSchemaResult> {
  const baseUrl = getApiBaseUrl();

  if (baseUrl === null) {
    return { ok: false, error: errorFromMissingConfiguration() };
  }

  const formData = new FormData();
  formData.append("file", file);

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    REQUEST_TIMEOUT_MS,
  );

  const abortSignal =
    signal === undefined
      ? timeoutController.signal
      : AbortSignal.any([signal, timeoutController.signal]);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/schema/validate`, {
      method: "POST",
      body: formData,
      signal: abortSignal,
    });
  } catch (cause) {
    return { ok: false, error: errorFromTransport(cause) };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const body = await readJson(response);
    return { ok: false, error: errorFromResponse(response.status, body) };
  }

  const body = await readJson(response);

  if (!isSchemaProcessingResult(body)) {
    return { ok: false, error: errorFromMalformedResponse() };
  }

  return { ok: true, data: body };
}
