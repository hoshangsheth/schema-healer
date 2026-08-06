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

from backend.domain.schema.canonical_schema import CanonicalSchema

class FuzzyMatcher(RecoveryMatcher):
    """
    Performs fuzzy schema recovery using RapidFuzz.

    Pending uploaded headers are compared against the canonical schema.
    Matches that satisfy the configured confidence threshold update the
    corresponding SchemaMapping in place.
    """

    def __init__(
        self,
        canonical_schema: CanonicalSchema,
        alias_lookup: dict[str, str],
        canonical_alias_lookup: dict[str, list[str]],
        confidence_threshold: float
    ) -> None:
        """
        Initialize the fuzzy matcher.

        Parameters
        ----------
        canonical_schema:
            Canonical schema available for fuzzy matching.

        confidence_threshold:
            Minimum similarity score required to accept a fuzzy match.
        """
        self._canonical_schema = canonical_schema
        self._alias_lookup = alias_lookup
        self._confidence_threshold = confidence_threshold
        self._canonical_alias_lookup = canonical_alias_lookup

    def process(
        self,
        mappings: list[SchemaMapping],
    ) -> None:
        """
        Resolve pending schema mappings using fuzzy matching.

        Parameters
        ----------
        alias_lookup:
            Dictionary mapping normalized aliases
            to canonical field names.
        """

        # Create a working copy so each canonical field can only be
        # matched once during this recovery operation.
        available_aliases = list(
            self._alias_lookup.keys()
        )

        # Process each mapping independently.
        for mapping in mappings:

            # Skip mappings that have already been resolved.
            if mapping.status != MappingStatus.PENDING:
                continue

            # Find the closest matching alias using RapidFuzz.
            match_result = process.extractOne(
                query=mapping.normalized_source_header,
                choices=available_aliases,
                scorer=fuzz.WRatio,
            )

            # No suitable candidates remain.
            if match_result is None:
                continue

            # Unpack the best fuzzy match.
            matched_alias, confidence_score, _ = match_result

            canonical_field = self._alias_lookup[matched_alias]

            # print("\n" + "=" * 80)
            # print(f"[FUZZY] Source Header    : {mapping.source_header}")
            # print(f"[FUZZY] Normalized      : {mapping.normalized_source_header}")
            # print(f"[FUZZY] Matched Alias   : {matched_alias}")
            # print(f"[FUZZY] Canonical Field : {canonical_field}")
            # print(f"[FUZZY] Similarity      : {confidence_score:.2f}")
            # print(f"[FUZZY] Threshold       : {self._confidence_threshold}")

            # Reject matches below the configured threshold.
            if confidence_score < self._confidence_threshold:
                continue

            # Update the mapping with the successful fuzzy match.
            mapping.canonical_field = canonical_field
            mapping.status = MappingStatus.RESOLVED
            mapping.recovery_method = RecoveryMethod.FUZZY

            # Remove the matched canonical field to enforce a
            # one-to-one mapping.
            aliases_to_remove = self._canonical_alias_lookup[canonical_field]
            # print(f"[FUZZY] Removing Aliases: {aliases_to_remove}")

            for alias in aliases_to_remove:
                if alias in available_aliases:
                    available_aliases.remove(alias)