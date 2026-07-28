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
        rule_mappings: dict[str, list[str]]
    ) -> None:
        """
        Initialize the rule matcher.

        Parameters
        ----------
        rule_mappings:
            Dictionary mapping canonical field names to their approved aliases.
        """

        normalized_rule_mappings = self._validate_rule_mappings(
            rule_mappings
        )

        self._alias_lookup = self._build_alias_lookup(
            normalized_rule_mappings
        )

    # Normalize alias
    @staticmethod
    def _normalize_alias(alias: str) -> str:
        """
        Normalize an alias for deterministic lookup.

        Parameters:

        alias:
            Alias to normalize.

        Returns:

        str:
            Normalized alias.
        """

        return alias.strip().lower()


    # Validate the mappings
    def _validate_rule_mappings(
        self,
        rule_mappings: dict[str, list[str]],
    ) -> dict[str, list[str]]:
        """
        Validate the rule mapping configuration.

        Parameters:

        rule_mappings:
            Dictionary mapping canonical field names to
            their approved aliases.

        Returns:
            
            dict[str, list[str]]
                Validated and normalized rule mappings.
        """

        if not isinstance(rule_mappings, dict):
            raise TypeError(
                "Rule mappings must be a dictionary."
            )


        seen_aliases: dict[str, str] = {}
        normalized_rule_mappings: dict[str, list[str]] = {}

        for canonical_field, aliases in rule_mappings.items():

            if not isinstance(canonical_field, str):
                raise TypeError(
                    "Canonical field names must be strings."
                )

            if not isinstance(aliases, list):
                raise TypeError(
                    f"Aliases for '{canonical_field}' must be a list."
                )

            if not aliases:
                raise ValueError(
                    f"Canonical field '{canonical_field}' "
                    "has no aliases."
                )

            normalized_canonical = self._normalize_alias(
                canonical_field
            )

            normalized_aliases: list[str] = []

            for alias in aliases:

                if not isinstance(alias, str):
                    raise TypeError(
                        f"Alias '{alias}' under "
                        f"'{canonical_field}' must be a string."
                    )

                normalized_alias = self._normalize_alias(alias)

                if not normalized_alias:
                    raise ValueError(
                        f"Blank alias found under "
                        f"'{canonical_field}'."
                    )

                if normalized_alias in normalized_aliases:
                    raise ValueError(
                        f"Duplicate alias '{normalized_alias}' "
                        f"within '{canonical_field}'."
                    )
                
                normalized_aliases.append(normalized_alias)

            if normalized_canonical not in normalized_aliases:
                raise ValueError(
                    f"Canonical field '{canonical_field}' "
                    "must include itself as an alias."
                )

            for alias in normalized_aliases:

                previous_owner = seen_aliases.get(alias)

                if previous_owner is not None:
                    raise ValueError(
                        f"Duplicate alias '{alias}' "
                        f"found under '{canonical_field}'. "
                        f"Already owned by "
                        f"'{previous_owner}'."
                    )

                seen_aliases[alias] = normalized_canonical

            normalized_rule_mappings[
                normalized_canonical
            ] = normalized_aliases

        return normalized_rule_mappings
    
    # Access the aliases
    def _build_alias_lookup(
        self,
        rule_mappings: dict[str, list[str]],
    ) -> dict[str, str]:
        """
        Build the runtime alias lookup dictionary.

        Parameters:
        
        rule_mappings:
            Validated and normalized rule mappings.

        Returns:
        
        dict[str, str]
            Dictionary mapping normalized aliases
            to canonical field names.
        """

        alias_lookup: dict[str, str] = {}

        for canonical_field, aliases in rule_mappings.items():
            for alias in aliases:
                alias_lookup[alias] = canonical_field
                
        return alias_lookup
    

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