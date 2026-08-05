import { WandIcon } from "@/components/shared/Icons";

/** Placeholder shown before any file has been analysed. */
export function IdleState() {
  return (
    <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-400 shadow-sm ring-1 ring-inset ring-ink-200">
        <WandIcon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink-900">
        No results yet
      </h3>
      <p className="mt-1.5 max-w-xs text-sm leading-6 text-ink-500">
        Upload a CSV and run the analysis. Results appear here once the
        recovery pipeline has finished.
      </p>
    </div>
  );
}
