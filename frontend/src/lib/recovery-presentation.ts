import type {
  RecoveryMethod,
  SchemaProcessingResponse,
  VerificationFinding,
  VerificationSeverityValue,
  VerificationType,
} from "@/types/api";
import { VerificationSeverity } from "@/types/api";

/**
 * Presentation vocabulary for backend results.
 *
 * One deliberate constraint: the API reports *how* a column was recovered
 * (`recovery_method`), never a numeric confidence. The internal similarity
 * threshold and the model's own confidence are not serialised. Rather than
 * invent a percentage, match strength is described in words, based on the
 * strategy that actually resolved the mapping.
 */

export type Tone = "brand" | "teal" | "success" | "warn" | "danger" | "neutral";

export interface MethodPresentation {
  /** Plain English name shown in the interface. */
  label: string;
  /** What this strategy did, in the user's terms. */
  description: string;
  /** Filled segments out of 3 in the match strength meter. */
  strength: 1 | 2 | 3;
  strengthLabel: string;
  tone: Tone;
}

export const METHOD_PRESENTATION: Record<RecoveryMethod, MethodPresentation> = {
  rule: {
    label: "Exact",
    description:
      "The column name is already known. It matched an entry in the built-in list of common names and spellings.",
    strength: 3,
    strengthLabel: "Known name",
    tone: "success",
  },
  fuzzy: {
    label: "Close",
    description:
      "The name was not an exact match, but it was close enough to a known field to be accepted with confidence. Weaker matches are refused rather than guessed.",
    strength: 2,
    strengthLabel: "Close match",
    tone: "teal",
  },
  semantic: {
    label: "AI",
    description:
      "The wording was unfamiliar, so an AI model worked out what it means. The answer was checked against your field list before it was accepted.",
    strength: 2,
    strengthLabel: "AI recovered",
    tone: "brand",
  },
};

export const UNRESOLVED_PRESENTATION = {
  label: "Unresolved",
  description:
    "Nothing produced a reliable match, so this column keeps its original name and needs a person to decide.",
  strength: 0 as const,
  strengthLabel: "Needs review",
  tone: "warn" as Tone,
};

export interface SeverityPresentation {
  label: string;
  tone: Tone;
}

export const SEVERITY_PRESENTATION: Record<
  VerificationSeverityValue,
  SeverityPresentation
> = {
  [VerificationSeverity.INFO]: { label: "Info", tone: "teal" },
  [VerificationSeverity.WARNING]: { label: "Warning", tone: "warn" },
  [VerificationSeverity.ERROR]: { label: "Error", tone: "danger" },
};

export const FINDING_TITLES: Record<VerificationType, string> = {
  missing_required_columns: "Missing recovered columns",
  unresolved_columns: "Columns awaiting review",
  duplicate_columns: "Two columns mapped to the same field",
};

/** Risk level derived from the verification outcome the backend reported. */
export interface RiskPresentation {
  level: "Low" | "Elevated" | "High";
  tone: Tone;
  summary: string;
}

export function riskFrom(response: SchemaProcessingResponse): RiskPresentation {
  const { verification_result: verification, healing_report: report } = response;

  if (verification.overall_severity === VerificationSeverity.ERROR) {
    return {
      level: "High",
      tone: "danger",
      summary:
        "Verification failed. Review the findings below before sending this file to another system.",
    };
  }
  if (
    verification.overall_severity === VerificationSeverity.WARNING ||
    report.recovery_summary.unresolved_columns > 0
  ) {
    return {
      level: "Elevated",
      tone: "warn",
      summary:
        "The file passed verification, but some columns are worth a second look.",
    };
  }
  return {
    level: "Low",
    tone: "success",
    summary:
      "Every column was recovered and the file passed all verification checks.",
  };
}

/** Headline status shown in the results banner. */
export interface StatusPresentation {
  headline: string;
  detail: string;
  tone: Tone;
  variant: "verified" | "review";
}

export function statusFrom(response: SchemaProcessingResponse): StatusPresentation {
  const { healing_report: report, verification_result: verification } = response;
  const { recovered_columns, total_uploaded_columns, unresolved_columns } =
    report.recovery_summary;

  if (verification.is_dataset_verified && unresolved_columns === 0) {
    return {
      headline: "File recovered and verified",
      detail: `All ${total_uploaded_columns} columns were matched to your field list and passed every check.`,
      tone: "success",
      variant: "verified",
    };
  }

  if (report.summary.requires_manual_intervention) {
    return {
      headline: "Recovered, with items to review",
      detail: `${recovered_columns} of ${total_uploaded_columns} columns were matched automatically. Verification flagged issues that need a decision before this file is used elsewhere.`,
      tone: "warn",
      variant: "review",
    };
  }

  return {
    headline: "File recovered",
    detail: `${recovered_columns} of ${total_uploaded_columns} columns were matched. Review the verification findings below.`,
    tone: "warn",
    variant: "review",
  };
}

/** Count mappings per strategy, for the timeline and the summary strip. */
export function methodBreakdown(
  response: SchemaProcessingResponse,
): Record<RecoveryMethod | "unresolved", number> {
  const counts: Record<RecoveryMethod | "unresolved", number> = {
    rule: 0,
    fuzzy: 0,
    semantic: 0,
    unresolved: 0,
  };

  for (const mapping of response.mappings) {
    if (mapping.status === "resolved" && mapping.recovery_method) {
      counts[mapping.recovery_method] += 1;
    } else {
      counts.unresolved += 1;
    }
  }

  return counts;
}

/** Most serious findings first. */
export function findingsBySeverity(
  findings: VerificationFinding[],
): VerificationFinding[] {
  return [...findings].sort((a, b) => b.severity - a.severity);
}
