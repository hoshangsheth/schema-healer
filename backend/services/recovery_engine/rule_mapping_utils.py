"""
Rule mapping utilities.

Provides shared helper functions for validating, normalizing,
and preparing rule-based schema mappings.

These utilities are shared across recovery matchers to ensure
consistent processing of rule mappings throughout the recovery pipeline.
"""


def normalize_alias(alias: str) -> str:
    """
    Normalize an alias for deterministic lookup.

    Parameters
    ----------
    alias:
        Alias to normalize.

    Returns
    -------
    str
        Normalized alias.
    """

    return alias.strip().lower()


def validate_rule_mappings(
    rule_mappings: dict[str, list[str]],
) -> dict[str, list[str]]:
    """
    Validate the rule mapping configuration.

    Parameters
    ----------
    rule_mappings:
        Dictionary mapping canonical field names to
        their approved aliases.

    Returns
    -------
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

        normalized_canonical = normalize_alias(
            canonical_field
        )

        normalized_aliases: list[str] = []

        for alias in aliases:

            if not isinstance(alias, str):
                raise TypeError(
                    f"Alias '{alias}' under "
                    f"'{canonical_field}' must be a string."
                )

            normalized_alias = normalize_alias(alias)

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


def build_alias_lookup(
    rule_mappings: dict[str, list[str]],
) -> dict[str, str]:
    """
    Build the runtime alias lookup dictionary.

    Parameters
    ----------
    rule_mappings:
        Validated and normalized rule mappings.

    Returns
    -------
    dict[str, str]
        Dictionary mapping normalized aliases
        to canonical field names.
    """

    alias_lookup: dict[str, str] = {}

    for canonical_field, aliases in rule_mappings.items():
        for alias in aliases:
            alias_lookup[alias] = canonical_field

    return alias_lookup


def build_canonical_alias_lookup(
    rule_mappings: dict[str, list[str]],
) -> dict[str, list[str]]:
    """
    Build a lookup mapping canonical field names to all of their
    normalized aliases.

    Parameters
    ----------
    rule_mappings:
        Validated rule mappings where each canonical field maps
        to its approved aliases.

    Returns
    -------
    dict[str, list[str]]
        Dictionary mapping canonical field names to lists of
        normalized aliases.
    """

    canonical_alias_lookup: dict[str, list[str]] = {}

    for canonical_field, aliases in rule_mappings.items():
        canonical_alias_lookup[canonical_field] = aliases.copy()

    return canonical_alias_lookup