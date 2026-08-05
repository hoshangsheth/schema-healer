import { Button } from "@/components/shared/Button";
import {
  AlertTriangleIcon,
  PlugIcon,
  RefreshIcon,
} from "@/components/shared/Icons";
import type { ApiError } from "@/types/result";

interface ErrorStateProps {
  error: ApiError;
  fileName: string;
  onRetry: () => void;
  onReset: () => void;
}

/** Short heading per failure category. */
function headingFor(error: ApiError): string {
  switch (error.kind) {
    case "invalid_file":
      return "That file could not be accepted";
    case "empty_file":
      return "That file has no header row";
    case "rate_limited":
      return "Too many requests";
    case "timeout":
      return "The request timed out";
    case "network":
      return "Cannot reach SchemaHealer";
    case "malformed_response":
      return "Unexpected response";
    case "server_error":
      return "Analysis could not be completed";
  }
}

/**
 * System and transport failures.
 *
 * This is deliberately distinct from a failed recovery: a failed
 * recovery is a real product outcome and renders through StatusCard.
 * Nothing here exposes a raw body or stack trace.
 */
export function ErrorState({
  error,
  fileName,
  onRetry,
  onReset,
}: ErrorStateProps) {
  const isConnectivity =
    error.kind === "network" || error.kind === "timeout";

  return (
    <div
      role="alert"
      className="flex h-full min-h-[20rem] flex-col justify-center rounded-2xl border border-danger-200 bg-danger-50/60 p-6"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-danger-600 shadow-sm ring-1 ring-inset ring-danger-200">
        {isConnectivity ? (
          <PlugIcon className="h-5 w-5" />
        ) : (
          <AlertTriangleIcon className="h-5 w-5" />
        )}
      </span>

      <h3 className="mt-4 text-base font-semibold text-danger-700">
        {headingFor(error)}
      </h3>
      <p className="mt-1.5 text-sm leading-6 text-ink-700">{error.message}</p>

      <p className="mt-3 truncate text-xs text-ink-400">
        File: <span className="font-mono">{fileName}</span>
      </p>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        {error.retryable && (
          <Button onClick={onRetry}>
            <RefreshIcon className="h-4 w-4" />
            Retry
          </Button>
        )}
        <Button variant="secondary" onClick={onReset}>
          Start over
        </Button>
      </div>
    </div>
  );
}
