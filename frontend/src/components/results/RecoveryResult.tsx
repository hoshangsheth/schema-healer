import { ColumnList } from "@/components/results/ColumnList";
import { MappingTable } from "@/components/results/MappingTable";
import { PlannedActions } from "@/components/results/PlannedActions";
import { ResultStats } from "@/components/results/ResultStats";
import { StatusCard } from "@/components/results/StatusCard";
import { summarizeResult } from "@/lib/recovery/outcome";
import type { SchemaProcessingResult } from "@/types/api";

interface RecoveryResultProps {
  fileName: string;
  result: SchemaProcessingResult;
}

/** Headline copy per outcome, phrased from what the response contains. */
function headlineFor(
  summary: ReturnType<typeof summarizeResult>,
): { title: string; description: string } {
  switch (summary.outcome) {
    case "passed":
      return {
        title: "Schema Valid",
        description: `All ${summary.totalColumns} columns already matched the expected schema. No recovery was required.`,
      };
    case "recovered":
      return {
        title: "Schema Recovered",
        description: `${summary.recoveredColumns.length} of ${summary.totalColumns} columns were renamed and have been mapped back to canonical fields. Every column resolved.`,
      };
    case "failed":
      return {
        title: "Recovery Incomplete",
        description:
          "The schema could not be fully resolved. The columns below need attention before this file can be processed downstream.",
      };
  }
}

/**
 * Full result panel for a successful API call.
 *
 * A failed recovery is still a successful API call — it renders here,
 * not through ErrorState.
 */
export function RecoveryResult({ fileName, result }: RecoveryResultProps) {
  const summary = summarizeResult(result);
  const { title, description } = headlineFor(summary);

  return (
    <div className="space-y-4">
      <StatusCard
        outcome={summary.outcome}
        title={title}
        description={description}
      />

      <p className="truncate text-xs text-ink-400">
        Analyzed <span className="font-mono">{fileName}</span>
      </p>

      <ResultStats summary={summary} />

      {summary.recoveredColumns.length > 0 && (
        <section aria-labelledby="detected-changes">
          <h4
            id="detected-changes"
            className="mb-2.5 text-sm font-semibold text-ink-900"
          >
            Detected changes
          </h4>
          <MappingTable columns={summary.recoveredColumns} />
        </section>
      )}

      <ColumnList
        title="Unresolved columns"
        description="No recovery strategy produced a confident match for these headers."
        columns={summary.unresolvedHeaders}
      />

      <ColumnList
        title="Duplicate canonical fields"
        description="More than one incoming column was mapped to the same canonical field."
        columns={summary.duplicateCanonicalFields}
        tone="warning"
      />

      <ColumnList
        title="Inconsistent mappings"
        description="These mappings were returned in an internally inconsistent state."
        columns={summary.invalidMappings}
        tone="warning"
      />

      {summary.outcome === "passed" && summary.unchangedColumns > 0 && (
        <p className="rounded-xl bg-ink-50 px-4 py-3 text-sm leading-6 text-ink-500">
          Every column in this file already carried its canonical name, so
          the recovery pipeline had nothing to repair.
        </p>
      )}

      <PlannedActions />
    </div>
  );
}
