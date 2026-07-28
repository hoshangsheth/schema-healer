"""
Fuzzy recovery matcher.

This matcher performs approximate schema recovery by comparing pending
normalized uploaded headers against the canonical schema using
RapidFuzz similarity scoring.

Successful matches update the existing SchemaMapping objects in place.
"""

from rapidfuzz import fuzz, process

from backend.models.schema_mapping_models import (
    MappingStatus,
    RecoveryMethod,
    SchemaMapping,
)
from backend.services.recovery_engine.recovery_matcher import RecoveryMatcher


class FuzzyMatcher(RecoveryMatcher):
    """
    Performs fuzzy schema recovery using RapidFuzz.

    Pending uploaded headers are compared against the canonical schema.
    Matches that satisfy the configured confidence threshold update the
    corresponding SchemaMapping in place.
    """

    def __init__(
        self,
        canonical_fields: list[str],
        confidence_threshold: float,
    ) -> None:
        """
        Initialize the fuzzy matcher.

        Parameters
        ----------
        canonical_fields:
            Canonical schema fields available for fuzzy matching.

        confidence_threshold:
            Minimum similarity score required to accept a fuzzy match.
        """
        self._canonical_fields = canonical_fields
        self._confidence_threshold = confidence_threshold

    def process(
        self,
        mappings: list[SchemaMapping],
    ) -> None:
        """
        Resolve pending schema mappings using fuzzy matching.

        Parameters
        ----------
        mappings:
            Collection of SchemaMapping objects to process.
        """

        # Create a working copy so each canonical field can only be
        # matched once during this recovery operation.
        available_canonical_fields = self._canonical_fields.copy()

        # Process each mapping independently.
        for mapping in mappings:

            # Skip mappings that have already been resolved.
            if mapping.status != MappingStatus.PENDING:
                continue

            # Find the closest canonical field using RapidFuzz.
            match_result = process.extractOne(
                query=mapping.normalized_source_header,
                choices=available_canonical_fields,
                scorer=fuzz.WRatio,
            )

            # No suitable candidates remain.
            if match_result is None:
                continue

            # Unpack the best fuzzy match.
            canonical_field, confidence_score, _ = match_result

            # Reject matches below the configured threshold.
            if confidence_score < self._confidence_threshold:
                continue

            # Update the mapping with the successful fuzzy match.
            mapping.canonical_field = canonical_field
            mapping.status = MappingStatus.RESOLVED
            mapping.recovery_method = RecoveryMethod.FUZZY

            # Remove the matched canonical field to enforce a
            # one-to-one mapping.
            available_canonical_fields.remove(canonical_field)