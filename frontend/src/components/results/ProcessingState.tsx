const STAGES = [
  "Reading the header row",
  "Comparing against the expected schema",
  "Running rule, fuzzy, and semantic recovery",
] as const;

interface ProcessingStateProps {
  fileName: string;
}

/**
 * Shown while the request is in flight.
 *
 * The stages describe the pipeline the backend actually runs, but the
 * UI receives no progress events, so nothing here claims to know which
 * stage is currently executing.
 */
export function ProcessingState({ fileName }: ProcessingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-brand-200 bg-brand-50/50 px-6 py-12 text-center"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 motion-reduce:animate-none"
      />
      <h3 className="mt-5 text-base font-semibold text-ink-900">
        Analyzing schema…
      </h3>
      <p className="mt-1.5 max-w-xs truncate text-sm text-ink-500">
        {fileName}
      </p>

      <ul className="mt-6 space-y-1.5 text-sm text-ink-500">
        {STAGES.map((stage) => (
          <li key={stage}>{stage}</li>
        ))}
      </ul>

      <p className="mt-6 max-w-xs text-xs leading-5 text-ink-400">
        Semantic recovery calls a language model, so this can take a few
        seconds when columns need it.
      </p>
    </div>
  );
}
