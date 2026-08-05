import { Button } from "@/components/shared/Button";
import { DownloadIcon } from "@/components/shared/Icons";

/**
 * Reserved area for capabilities the backend does not expose yet.
 *
 * Everything here is visibly disabled and labelled as unavailable. The
 * download control is wired to nothing on purpose — the backend does not
 * return a recovered CSV, and a button that silently does nothing would
 * be worse than one that says so.
 *
 * When Vertical Slice 5 lands, this component is where the healing
 * report, verification status, and CSV download become real.
 */
export function PlannedActions() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-700">
            Download recovered CSV
          </p>
          <p className="mt-0.5 text-xs leading-5 text-ink-500">
            Not available yet. The API currently returns column mappings
            only, not a rewritten file.
          </p>
        </div>
        <Button variant="secondary" disabled aria-describedby="download-note">
          <DownloadIcon className="h-4 w-4" />
          Download
        </Button>
      </div>
      <p id="download-note" className="sr-only">
        Recovered CSV download is not implemented in the current build.
      </p>
    </div>
  );
}
