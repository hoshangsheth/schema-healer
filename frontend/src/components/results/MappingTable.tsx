import { Badge, type BadgeTone } from "@/components/shared/Badge";
import { ArrowRightIcon } from "@/components/shared/Icons";
import {
  recoveryMethodLabel,
  type RecoveredColumn,
} from "@/lib/recovery/outcome";
import { RECOVERY_METHOD, type RecoveryMethod } from "@/types/api";

const METHOD_TONE: Record<RecoveryMethod, BadgeTone> = {
  [RECOVERY_METHOD.RULE]: "neutral",
  [RECOVERY_METHOD.FUZZY]: "warning",
  [RECOVERY_METHOD.SEMANTIC]: "brand",
};

interface MappingTableProps {
  columns: RecoveredColumn[];
}

/**
 * Table of columns whose incoming name differed from the canonical field
 * they were mapped onto.
 *
 * There is no confidence column: the current API response does not carry
 * a per-mapping confidence value, and inventing one would misrepresent
 * the result.
 */
export function MappingTable({ columns }: MappingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Columns recovered from the uploaded CSV, with the canonical
            field each was mapped to and the strategy that resolved it.
          </caption>
          <thead>
            <tr className="bg-ink-50">
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500"
              >
                Detected column
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500"
              >
                Recovered as
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500"
              >
                Strategy
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200 bg-white">
            {columns.map((column) => (
              <tr key={`${column.sourceHeader}-${column.canonicalField}`}>
                <td className="px-4 py-3">
                  <span className="font-mono text-[13px] text-ink-700">
                    {column.sourceHeader}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <ArrowRightIcon
                      className="h-3.5 w-3.5 shrink-0 text-ink-400"
                    />
                    <span className="font-mono text-[13px] font-medium text-brand-700">
                      {column.canonicalField}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  {column.recoveryMethod ? (
                    <Badge tone={METHOD_TONE[column.recoveryMethod]}>
                      {recoveryMethodLabel(column.recoveryMethod)}
                    </Badge>
                  ) : (
                    <span className="text-xs text-ink-400">Not reported</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
