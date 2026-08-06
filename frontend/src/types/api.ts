/**
 * Transport types for the SchemaHealer API.
 *
 * These mirror the FastAPI contract of `POST /schema/validate` exactly:
 *
 *   backend/api/models/schema_processing_response.py  -> SchemaProcessingResponse
 *   backend/models/schema_mapping_models.py           -> SchemaMapping
 *   backend/models/schema_validation_models.py        -> SchemaValidationResult
 *   backend/models/verification_models.py             -> VerificationResult
 *   backend/reports/models/healing_report_models.py   -> HealingReport
 *
 * Nothing here may be added, renamed or widened without a matching backend
 * change. Field names are snake_case because that is what the wire uses.
 */

/** `MappingStatus`: lifecycle state of a single uploaded column. */
export type MappingStatus = "pending" | "resolved";

/** `RecoveryMethod`: the strategy that resolved a mapping. */
export type RecoveryMethod = "rule" | "fuzzy" | "semantic";

/** `SchemaMapping`: the recovery outcome for one uploaded column. */
export interface SchemaMapping {
  source_header: string;
  normalized_source_header: string;
  canonical_field: string | null;
  status: MappingStatus;
  recovery_method: RecoveryMethod | null;
}

/** `SchemaValidationResult`: integrity check over the recovered mappings. */
export interface SchemaValidationResult {
  is_valid: boolean;
  unresolved_headers: string[];
  duplicate_canonical_fields: string[];
  invalid_mappings: string[];
}

/**
 * `VerificationSeverity` is an `IntEnum` on the backend and therefore travels
 * as a number, not a string.
 */
export const VerificationSeverity = {
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
} as const;

export type VerificationSeverityValue =
  (typeof VerificationSeverity)[keyof typeof VerificationSeverity];

/** `VerificationType`: the category of a verification finding. */
export type VerificationType =
  | "missing_required_columns"
  | "unresolved_columns"
  | "duplicate_columns";

/** `VerificationFinding`: one data quality issue found in the rebuilt file. */
export interface VerificationFinding {
  severity: VerificationSeverityValue;
  type: VerificationType;
  affected_columns: string[] | null;
  message: string;
}

/** `VerificationResult`: the overall check outcome for the rebuilt file. */
export interface VerificationResult {
  is_dataset_verified: boolean;
  overall_severity: VerificationSeverityValue;
  findings: VerificationFinding[];
}

/** `Summary`: the high level processing outcome. */
export interface HealingSummary {
  is_successful: boolean;
  requires_manual_intervention: boolean;
}

/** `RecoverySummary`: aggregated recovery statistics. */
export interface RecoverySummary {
  total_uploaded_columns: number;
  recovered_columns: number;
  unresolved_columns: number;
  /** Already expressed as a percentage from 0 to 100, rounded to 2 decimals. */
  recovery_rate: number;
}

/** `HealingReport`: the structured report presented to the user. */
export interface HealingReport {
  summary: HealingSummary;
  recovery_summary: RecoverySummary;
  verification_result: VerificationResult;
}

/** `SchemaProcessingResponse`: the full JSON body of `POST /schema/validate`. */
export interface SchemaProcessingResponse {
  mappings: SchemaMapping[];
  validation_result: SchemaValidationResult;
  verification_result: VerificationResult;
  healing_report: HealingReport;
}
