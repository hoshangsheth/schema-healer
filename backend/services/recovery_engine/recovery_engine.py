"""
Recovery Engine orchestration.

The Recovery Engine coordinates schema recovery by executing a sequence of
recovery strategies against a shared collection of SchemaMapping objects.

It owns workflow orchestration only.

Recovery logic belongs to the individual matcher implementations.
"""

# IMPORTS
from backend.models.schema_mapping_models import (
    MappingStatus,
    SchemaMapping
)
from backend.services.recovery_engine.recovery_matcher import RecoveryMatcher
from backend.services.normalization.header_normalizer import normalize_header


# RECOVERY ENGINE
class RecoveryEngine:
    """
    Coordinates schema recovery through an ordered matcher pipeline.
    """

    def __init__(
        self,
        matchers: list[RecoveryMatcher]
    ) -> None:
        """
        Initialize the Recovery Engine.

        Parameters:
        matchers:
            Ordered collection of recovery matchers forming the recovery
            pipeline.
        """

        self._matchers: tuple[RecoveryMatcher, ...] = tuple(matchers)

    def recover(
        self,
        uploaded_headers: list[str]
    ) -> list[SchemaMapping]:
        """
        Execute the recovery pipeline for the uploaded headers.

        Parameters:
        uploaded_headers:
            Column headers extracted from the uploaded dataset.

        Returns:
        list[SchemaMapping]
            Schema mappings after the recovery pipeline has completed.
        """

        mappings = [
            SchemaMapping(
                source_header=header,
                normalized_source_header=normalize_header(header)
            )
            for header in uploaded_headers
        ]

        for matcher in self._matchers:
            unresolved = [
                mapping for mapping
                in mappings
                if mapping.status == MappingStatus.PENDING
            ]

            if not unresolved:
                break

            matcher.process(unresolved)

        return mappings