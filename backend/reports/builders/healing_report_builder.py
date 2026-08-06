"""
Healing Report builder.

This module implements the HealingReportBuilder responsible for
constructing a structured HealingReport from the outputs produced
throughout the SchemaHealer processing pipeline.

The builder aggregates recovery statistics together with dataset
verification results into a concise, user-oriented reporting artifact.

Responsibilities:
- Build the overall processing summary.
- Build recovery summary statistics.
- Assemble the complete HealingReport.

This module intentionally does not:
- Perform schema recovery.
- Perform dataset verification.
- Modify DataFrames.
- Generate API responses.
- Export CSV files.
"""

# IMPORTS
from backend.models.schema_mapping_models import (
    MappingStatus,
    SchemaMapping,
)
from backend.models.verification_models import (
    VerificationResult,
    VerificationSeverity,
)
from backend.reports.models.healing_report_models import (
    HealingReport,
    RecoverySummary,
    Summary,
)

# HEALING REPORT BUILDER
class HealingReportBuilder:
    """
    Builds the structured Healing Report presented to downstream
    consumers after schema processing has completed.
    """

    # BUILDS THE ENTIRE REPORT
    def build(
        self,
        mappings: list[SchemaMapping],
        verification_result: VerificationResult,
    ) -> HealingReport:
        """
        Build the complete Healing Report.

        Parameters:

        mappings:
            Schema mappings produced by the recovery pipeline.

        verification_result:
            The outcome of dataset verification.

        Returns:

        HealingReport:
            The completed Healing Report.
        """

        # Build the high-level processing summary.
        summary = self._build_summary(
            verification_result=verification_result,
        )

        # Build the schema recovery summary.
        recovery_summary = self._build_recovery_summary(
            mappings=mappings,
        )

        # Assemble and return the complete Healing Report.
        return HealingReport(
            summary=summary,
            recovery_summary=recovery_summary,
            verification_result=verification_result,
        )

    # HELPER FUNCTION
    def _build_summary(
        self,
        verification_result: VerificationResult,
    ) -> Summary:
        """
        Build the high-level processing summary.

        Parameters:

        verification_result:
            The outcome of dataset verification.

        Returns:

        Summary:
            High-level processing outcome presented to the user.
        """

        return Summary(
            is_successful=True,
            requires_manual_intervention=(
                verification_result.overall_severity
                == VerificationSeverity.ERROR
            ),
        )


    # HELPER FUNCTION
    def _build_recovery_summary(
        self,
        mappings: list[SchemaMapping],
    ) -> RecoverySummary:
        """
        Build the schema recovery summary.

        Parameters:

        mappings:
            Schema mappings produced by the recovery pipeline.

        Returns:

        RecoverySummary:
            Aggregated schema recovery statistics.
        """

        # Calculate the total number of uploaded columns.
        total_uploaded_columns = len(mappings)

        # Count successfully recovered columns.
        recovered_columns = sum(
            1
            for mapping in mappings
            if mapping.status == MappingStatus.RESOLVED
        )

        # Count unresolved columns requiring manual intervention.
        unresolved_columns = total_uploaded_columns - recovered_columns

        # Calculate the overall recovery rate.
        recovery_rate = round(
            (recovered_columns / total_uploaded_columns) * 100,
            2,
        ) if total_uploaded_columns > 0 else 0.0

        return RecoverySummary(
            total_uploaded_columns=total_uploaded_columns,
            recovered_columns=recovered_columns,
            unresolved_columns=unresolved_columns,
            recovery_rate=recovery_rate,
        )

    
