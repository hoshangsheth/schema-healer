"""
Rule-based recovery matcher.

This matcher performs deterministic schema recovery by comparing each
pending normalized header against a preloaded dictionary of rule mappings.
Successful matches update the existing SchemaMapping objects in place.
"""

# IMPORTS
from backend.models.schema_mapping_models import (
    MappingStatus,
    RecoveryMethod,
    SchemaMapping,
)
from backend.services.recovery_engine.recovery_matcher import RecoveryMatcher

from backend.services.recovery_engine.rule_mapping_utils import (
    build_alias_lookup,
    validate_rule_mappings,
)

# RULE MATCHER
class RuleMatcher(RecoveryMatcher):
    """
    Performs deterministic rule-based schema recovery.

    Each uploaded header is compared against a dictionary of normalized
    rule mappings. When a match is found, the corresponding
    SchemaMapping is updated in place.
    """

    def __init__(
        self,
        alias_lookup: dict[str, str]
    ) -> None:
        """
        Initialize the rule matcher.

        Parameters
        ----------
        alias_lookup:
            Dictionary mapping normalized aliases
            to canonical field names.
        """
        self._alias_lookup = alias_lookup
    

    # Schema processing
    def process(
        self,
        mappings: list[SchemaMapping],
    ) -> None:
        """
        Resolve pending schema mappings using deterministic rules.

        Parameters:

        mappings:
            Collection of SchemaMapping objects to process.
        """

        # Process each mapping independently.
        for mapping in mappings:

            # Ignore mappings that have already been resolved by a
            # previous recovery stage.
            if mapping.status != MappingStatus.PENDING:
                continue

            # Perform a deterministic dictionary lookup using the
            # normalized uploaded header.
            canonical_field = self._alias_lookup.get(
                mapping.normalized_source_header
            )

            # If no rule exists, allow the next matcher in the pipeline
            # to attempt recovery.
            if canonical_field is None:
                continue

            # Update the mapping with the successful rule-based result.
            mapping.canonical_field = canonical_field
            mapping.status = MappingStatus.RESOLVED
            mapping.recovery_method = RecoveryMethod.RULE