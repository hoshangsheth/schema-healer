/**
 * TypeScript mirror of the SchemaHealer backend API contract.
 *
 * These types are a direct translation of the Pydantic models in
 * `backend/models/`. They must not drift from the backend — the backend
 * is the source of truth.
 *
 *   backend/models/schema_mapping_models.py     -> MappingStatus, RecoveryMethod, SchemaMapping
 *   backend/models/schema_validation_models.py  -> SchemaValidationResult
 *   backend/models/schema_processing_models.py  -> SchemaProcessingResult
 */

/** Lifecycle state of a single mapping. Mirrors `MappingStatus`. */
export const MAPPING_STATUS = {
  PENDING: "pending",
  RESOLVED: "resolved",
  UNRECOGNIZED: "unrecognized",
} as const;

export type MappingStatus =
  (typeof MAPPING_STATUS)[keyof typeof MAPPING_STATUS];

/** Recovery strategy that resolved a mapping. Mirrors `RecoveryMethod`. */
export const RECOVERY_METHOD = {
  RULE: "rule",
  FUZZY: "fuzzy",
  SEMANTIC: "semantic",
} as const;

export type RecoveryMethod =
  (typeof RECOVERY_METHOD)[keyof typeof RECOVERY_METHOD];

/**
 * Recovery lifecycle of a single uploaded CSV header.
 *
 * Note: the backend does NOT currently expose a per-mapping confidence
 * score. Confidence exists internally (fuzzy similarity, semantic
 * confidence) but is not part of `SchemaMapping`, so the UI must not
 * display one.
 */
export interface SchemaMapping {
  source_header: string;
  normalized_source_header: string;
  canonical_field: string | null;
  status: MappingStatus;
  recovery_method: RecoveryMethod | null;
}

/** Integrity check performed after the recovery pipeline completes. */
export interface SchemaValidationResult {
  is_valid: boolean;
  unresolved_headers: string[];
  duplicate_canonical_fields: string[];
  invalid_mappings: string[];
}

/** Full 200 response body of `POST /schema/validate`. */
export interface SchemaProcessingResult {
  mappings: SchemaMapping[];
  validation_result: SchemaValidationResult;
}
