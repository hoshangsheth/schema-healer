/**
 * Derivation of the user-facing outcome from a real backend response.
 *
 * The backend does not return an explicit PASSED / RECOVERED / FAILED
 * status. It returns per-column mappings plus an integrity check. This
 * module is the single place where those facts are turned into the
 * outcome the UI presents, so the rule stays visible and testable.
 *
 * This is presentation logic only. It does not re-implement matching,
 * validation, or any other backend responsibility.
 *
 * Rules, using only fields the API actually returns:
 *
 *   FAILED     validation_result.is_valid === false
 *              (an unresolved header, a duplicated canonical field, or
 *              an internally inconsistent mapping)
 *
 *   PASSED     is_valid === true and every column already carried its
 *              canonical name — normalized_source_header equals
 *              canonical_field for all mappings. No drift was present.
 *
 *   RECOVERED  is_valid === true and at least one column had to be
 *              mapped onto a different canonical field.
 */

import {
  RECOVERY_METHOD,
  type RecoveryMethod,
  type SchemaMapping,
  type SchemaProcessingResult,
} from "@/types/api";
import type { RecoveryOutcome } from "@/types/result";

/** A column whose incoming name differed from its canonical field. */
export interface RecoveredColumn {
  /** Header exactly as it appeared in the uploaded CSV. */
  sourceHeader: string;
  /** Canonical field the column was mapped onto. */
  canonicalField: string;
  /** Strategy that resolved it, when the backend reported one. */
  recoveryMethod: RecoveryMethod | null;
}

/** Counts per recovery strategy, for the summary row. */
export type RecoveryMethodCounts = Record<RecoveryMethod, number>;

/** Everything the result components need, computed once. */
export interface RecoverySummary {
  outcome: RecoveryOutcome;
  /** Total columns found in the uploaded CSV. */
  totalColumns: number;
  /** Columns that reached a canonical field. */
  resolvedColumns: number;
  /** Columns whose name changed and were mapped to a canonical field. */
  recoveredColumns: RecoveredColumn[];
  /** Columns that already matched their canonical field. */
  unchangedColumns: number;
  methodCounts: RecoveryMethodCounts;
  /** Headers the pipeline could not resolve at all. */
  unresolvedHeaders: string[];
  /** Canonical fields claimed by more than one incoming column. */
  duplicateCanonicalFields: string[];
  /** Headers whose mapping came back internally inconsistent. */
  invalidMappings: string[];
}

/** True when the column's incoming name already was its canonical name. */
function isUnchanged(mapping: SchemaMapping): boolean {
  return (
    mapping.canonical_field !== null &&
    mapping.normalized_source_header === mapping.canonical_field
  );
}

function countMethods(mappings: SchemaMapping[]): RecoveryMethodCounts {
  const counts: RecoveryMethodCounts = {
    [RECOVERY_METHOD.RULE]: 0,
    [RECOVERY_METHOD.FUZZY]: 0,
    [RECOVERY_METHOD.SEMANTIC]: 0,
  };

  for (const mapping of mappings) {
    if (mapping.recovery_method !== null) {
      counts[mapping.recovery_method] += 1;
    }
  }

  return counts;
}

/** Build the complete summary for a processing result. */
export function summarizeResult(
  result: SchemaProcessingResult,
): RecoverySummary {
  const { mappings, validation_result: validation } = result;

  const resolved = mappings.filter(
    (mapping) => mapping.canonical_field !== null,
  );

  const recoveredColumns: RecoveredColumn[] = resolved
    .filter((mapping) => !isUnchanged(mapping))
    .map((mapping) => ({
      sourceHeader: mapping.source_header,
      // Narrowed by the `resolved` filter above.
      canonicalField: mapping.canonical_field as string,
      recoveryMethod: mapping.recovery_method,
    }));

  const outcome: RecoveryOutcome = !validation.is_valid
    ? "failed"
    : recoveredColumns.length === 0
      ? "passed"
      : "recovered";

  return {
    outcome,
    totalColumns: mappings.length,
    resolvedColumns: resolved.length,
    recoveredColumns,
    unchangedColumns: resolved.length - recoveredColumns.length,
    methodCounts: countMethods(mappings),
    unresolvedHeaders: validation.unresolved_headers,
    duplicateCanonicalFields: validation.duplicate_canonical_fields,
    invalidMappings: validation.invalid_mappings,
  };
}

/** Display label for a recovery strategy badge. */
export function recoveryMethodLabel(method: RecoveryMethod): string {
  switch (method) {
    case RECOVERY_METHOD.RULE:
      return "Rule";
    case RECOVERY_METHOD.FUZZY:
      return "Fuzzy";
    case RECOVERY_METHOD.SEMANTIC:
      return "Semantic";
  }
}
