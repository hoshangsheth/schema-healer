"""
Schema processing API response models.

This module defines the response models exposed by the schema
processing API.

These models represent the public HTTP contract returned to API
consumers and intentionally exclude internal processing artifacts
that are not suitable for JSON serialization.
"""

# IMPORTS
from pydantic import BaseModel

from backend.models.schema_mapping_models import SchemaMapping
from backend.models.schema_validation_models import (
    SchemaValidationResult
)
from backend.models.verification_models import (
    VerificationResult
)
from backend.reports.models.healing_report_models import (
    HealingReport
)

# SCHEMA PROCESSING RESPONSE
class SchemaProcessingResponse(BaseModel):
    """
    Represents the public API response returned after schema
    processing completes successfully.

    This model exposes the user-facing processing artifacts while
    intentionally excluding internal pipeline objects that are not
    suitable for JSON serialization.

    Attributes:

    mappings:
        Recovery results for each uploaded column.

    validation_result:
        Validation outcome for the recovered mappings.

    verification_result:
        Dataset verification outcome.

    healing_report:
        Structured Healing Report summarizing schema recovery and
        dataset verification.
    """

    mappings: list[SchemaMapping]

    validation_result: SchemaValidationResult

    verification_result: VerificationResult

    healing_report: HealingReport