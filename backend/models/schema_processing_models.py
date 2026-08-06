"""
Models representing the result of the schema processing workflow.
"""

# IMPORTS
import pandas as pd
from dataclasses import dataclass
from backend.models.schema_mapping_models import SchemaMapping
from backend.models.schema_validation_models import SchemaValidationResult
from backend.models.verification_models import VerificationResult
from backend.reports.models.healing_report_models import HealingReport

# SCHEMA PROCESSING RESULT
@dataclass(frozen=True)
class SchemaProcessingResult:
    """
    Represents the complete outcome of the schema processing pipeline.

    This model aggregates every artifact produced throughout schema
    processing into a single orchestration result for downstream
    consumers.

    Attributes:

    mappings:
        Recovery results for each uploaded column.

    validation_result:
        Validation outcome for the recovered mappings.

    recovered_dataframe:
        The recovered dataset produced after schema recovery.

    verification_result:
        Dataset verification outcome.

    healing_report:
        Structured Healing Report summarizing schema recovery and
        dataset verification.
    """

    mappings: list[SchemaMapping]

    validation_result: SchemaValidationResult

    recovered_dataframe: pd.DataFrame

    verification_result: VerificationResult

    healing_report: HealingReport
