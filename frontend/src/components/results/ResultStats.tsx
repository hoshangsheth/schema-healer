import { Badge } from "@/components/shared/Badge";
import {
  recoveryMethodLabel,
  type RecoverySummary,
} from "@/lib/recovery/outcome";
import { RECOVERY_METHOD, type RecoveryMethod } from "@/types/api";

const METHOD_ORDER: RecoveryMethod[] = [
  RECOVERY_METHOD.RULE,
  RECOVERY_METHOD.FUZZY,
  RECOVERY_METHOD.SEMANTIC,
];

interface ResultStatsProps {
  summary: RecoverySummary;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums text-ink-900">
        {value}
      </dd>
    </div>
  );
}

/**
 * Counts derived from the response.
 *
 * Everything shown here is arithmetic over the returned mappings — no
 * timing, risk, or verification figures, which the backend does not yet
 * report.
 */
export function ResultStats({ summary }: ResultStatsProps) {
  const usedMethods = METHOD_ORDER.filter(
    (method) => summary.methodCounts[method] > 0,
  );

  return (
    <div>
      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Columns" value={summary.totalColumns} />
        <Stat label="Resolved" value={summary.resolvedColumns} />
        <Stat label="Unresolved" value={summary.unresolvedHeaders.length} />
      </dl>

      {usedMethods.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-500">
            Strategies used:
          </span>
          {usedMethods.map((method) => (
            <Badge key={method} tone="neutral">
              {recoveryMethodLabel(method)}
              <span className="tabular-nums text-ink-500">
                {summary.methodCounts[method]}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
