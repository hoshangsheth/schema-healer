"""
Schema validation utilities.

Validates the integrity of the recovered pipeline output by inspecting
SchemaMapping objects after all recovery strategies have completed.
"""

# IMPORTS
from collections import Counter
from backend.models.schema_mapping_models import (
    MappingStatus,
    SchemaMapping
)
from backend.models.schema_validation_models import SchemaValidationResult

# VALIDATE SCHEMA
def validate_schema(
    mappings: list[SchemaMapping]
) -> SchemaValidationResult:
    """
    Validate the integrity of recovered schema mappings.

    Parameters:
    mappings:
        Collection of SchemaMapping objects produced by the
        recovery pipeline.

    Returns:
    SchemaValidationResult
        Validation outcome describing whether the recovered mappings
        are internally consistent.
    """

    unresolved_headers: list[str] = []
    duplicate_canonical_fields: list[str] = []
    invalid_mappings: list[str] = []
    resolved_fields: list[str] = []

    for mapping in mappings:
        if mapping.status == MappingStatus.PENDING:
            unresolved_headers.append(mapping.source_header)
            continue

        if mapping.canonical_field is None:
            invalid_mappings.append(mapping.source_header)
            continue

        if mapping.recovery_method is None:
            invalid_mappings.append(mapping.source_header)
            continue

        resolved_fields.append(mapping.canonical_field)

    field_counts = Counter(resolved_fields)

    duplicate_canonical_fields = [
        field
        for field, count in field_counts.items()
        if count > 1
    ]

    is_valid = (
        not unresolved_headers
        and not duplicate_canonical_fields
        and not invalid_mappings
    )

    return SchemaValidationResult(
        is_valid=is_valid,
        unresolved_headers=unresolved_headers,
        duplicate_canonical_fields=duplicate_canonical_fields,
        invalid_mappings=invalid_mappings,
    )