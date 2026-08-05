/**
 * Presentation-level types for the interactive demo.
 *
 * These describe how the UI models the request lifecycle. They are
 * deliberately separate from `types/api.ts`, which mirrors the backend
 * contract exactly.
 */

import type { SchemaProcessingResult } from "@/types/api";

/**
 * Business outcome shown to the user.
 *
 * The backend does not return an explicit outcome status, so this is
 * derived from the real response in `lib/recovery/outcome.ts`. See that
 * module for the derivation rules.
 */
export type RecoveryOutcome = "passed" | "recovered" | "failed";

/**
 * Categories of failure that are NOT a business outcome.
 *
 * `invalid_file` and `empty_file` come from backend 400 responses.
 * The rest are transport/system level and never indicate that recovery
 * itself failed.
 */
export type ApiErrorKind =
  | "invalid_file"
  | "empty_file"
  | "rate_limited"
  | "server_error"
  | "network"
  | "timeout"
  | "malformed_response";

/** Normalized error surfaced to the UI. Never contains a stack trace. */
export interface ApiError {
  kind: ApiErrorKind;
  /** Human-readable message safe to render directly. */
  message: string;
  /** HTTP status when the failure came from a response. */
  status?: number;
  /**
   * Whether retrying the same upload is plausibly useful.
   * A rejected file type is not retryable; a 502 is.
   */
  retryable: boolean;
}

/** Finite state of the demo panel. */
export type DemoState =
  | { phase: "idle" }
  | { phase: "processing"; fileName: string }
  | { phase: "success"; fileName: string; result: SchemaProcessingResult }
  | { phase: "error"; fileName: string; error: ApiError };
