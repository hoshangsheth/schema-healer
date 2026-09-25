"""
Fuzzy recovery matcher.

This matcher performs approximate schema recovery by comparing pending
normalized uploaded headers against the canonical schema using
RapidFuzz similarity scoring.

Successful matches update the existing SchemaMapping objects in place.

Short-alias guard
------------------
`fuzz.WRatio` includes a partial-ratio component, which scores generously
whenever a short string is "contained enough" in a longer one. Aliases such
as "bu", "dob", or "owner" are legitimate exact aliases (and are caught by
RuleMatcher when the input matches them exactly), but as *fuzzy* targets
they are dangerous: unrelated noisy headers can score above the configured
threshold purely because the alias is short, not because the match is
actually meaningful.

Testing against realistic messy CRM headers surfaced this concretely:
"Opp Owner" matched the alias "owner" (business owner) at WRatio 90, and
"tag_bucket_3" matched the alias "bu" (business_unit) at WRatio 90 too, both
above the default 85 threshold and both wrong. Meanwhile genuinely useful
short-alias matches ("zipp" for "zip", "mobile no" for "mobile") stay well
above a plain `fuzz.ratio` bar even though they fail on length alone.

SHORT_ALIAS_MAX_LENGTH and SHORT_ALIAS_RATIO_FLOOR below encode that
distinction: any winning match against an alias at or under the length
cutoff must also clear a stricter, non-partial ratio check before it is
accepted. Anything that fails this still falls through to the semantic
(LLM) tier rather than being silently resolved wrong.
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
    Matches that satisfy the configured confidence threshold, and the
    short-alias guard below, update the corresponding SchemaMapping in
    place.
    """

    # Aliases at or under this length are treated as "short" and subject
    # to the stricter secondary check, since WRatio's partial-ratio
    # component scores them unreliably. Chosen from the data: every alias
    # implicated in a real false positive during testing was 5 characters
    # or fewer ("owner", "bu").
    SHORT_ALIAS_MAX_LENGTH = 6

    # Minimum plain fuzz.ratio (full-string, not partial) a short-alias
    # match must also clear. 80 rejects both false positives found in
    # testing ("opp owner" vs "owner" scores 71.4, "tag_bucket_3" vs "bu"
    # scores 28.6) while keeping the genuine ones ("mobile no" vs "mobile"
    # scores 80.0, "zipp" vs "zip" scores 85.7).
    SHORT_ALIAS_RATIO_FLOOR = 80.0

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

            # Short-alias guard: a match against a short alias needs a
            # stricter, non-partial similarity check too, or it falls
            # through to the semantic tier instead of being resolved on
            # a WRatio score that short strings can satisfy too easily.
            if len(matched_alias) <= self.SHORT_ALIAS_MAX_LENGTH:
                strict_score = fuzz.ratio(
                    mapping.normalized_source_header,
                    matched_alias,
                )

                if strict_score < self.SHORT_ALIAS_RATIO_FLOOR:
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