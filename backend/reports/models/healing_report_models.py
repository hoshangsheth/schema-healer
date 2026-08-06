"""
Healing Report domain models.

This module defines the business models representing the structured
Healing Report produced by the SchemaHealer processing pipeline.

The Healing Report summarizes schema recovery and dataset verification
results into a concise, user-oriented report suitable for presentation
by downstream consumers.

These models are framework-independent domain objects and intentionally
contain no report generation logic, recovery logic, verification logic,
DataFrame operations, or API response models.
"""

# IMPORTS
from dataclasses import dataclass
from backend.models.verification_models import VerificationResult


# SUMMARY
@dataclass(frozen=True)
class Summary:
    """
    Represents the overall outcome of schema processing.

    This model provides a concise, high-level summary of the processing
    outcome suitable for presentation to end users.

    Attributes:
        is_successful:
            Indicates whether schema processing completed successfully.

        requires_manual_intervention:
            Indicates whether manual review is required before the
            recovered dataset can be fully trusted.

        downloadable:
            Indicates whether a recovered CSV is available for download.
    """

    is_successful: bool
    requires_manual_intervention: bool


# RECOVERY SUMMARY
@dataclass(frozen=True)
class RecoverySummary:
    """
    Represents a high-level summary of schema recovery.

    This model provides aggregated recovery statistics derived from the
    schema recovery pipeline for presentation to end users.

    Attributes:
        total_uploaded_columns:
            Total number of uploaded columns processed.

        recovered_columns:
            Number of uploaded columns successfully recovered.

        unresolved_columns:
            Number of uploaded columns requiring manual intervention.

        recovery_rate:
            Percentage of uploaded columns successfully recovered.
    """

    total_uploaded_columns: int
    recovered_columns: int
    unresolved_columns: int
    recovery_rate: float


# THE REPORT
@dataclass(frozen=True)
class HealingReport:
    """
    Represents the complete Healing Report produced by the SchemaHealer
    processing pipeline.

    The Healing Report aggregates the high-level processing summary,
    recovery summary, and dataset verification outcome into a single,
    structured reporting artifact suitable for downstream consumers.

    Attributes:
        summary:
            High-level processing outcome presented to the user.

        recovery_summary:
            Aggregated recovery statistics describing schema recovery
            performance.

        verification_result:
            The complete dataset verification outcome produced by the
            Verification Service.
    """

    summary: Summary
    recovery_summary: RecoverySummary
    verification_result: VerificationResult