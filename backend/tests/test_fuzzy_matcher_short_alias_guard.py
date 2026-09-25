"""
Regression test for the fuzzy matcher's short-alias false positives.

Prior to this fix, FuzzyMatcher accepted any match scoring above the
configured WRatio threshold, with no check on the length of the matched
alias. WRatio's partial-ratio component scores short aliases generously
whenever they appear as a substring-ish fragment of a longer, unrelated
header, so short aliases produced wrong, silently accepted matches:

- "Opp Owner" matched the alias "owner" (WRatio 90) and resolved to
  account_owner, when the header almost certainly meant
  opportunity_owner or deal_owner.
- "tag_bucket_3" matched the alias "bu" (WRatio 90) and resolved to
  business_unit, with no real relationship between the two strings.

Both scored above the default 85.0 threshold and were accepted without
any signal that the match was unreliable.

The fix adds a stricter, non-partial fuzz.ratio check for any match
against a short alias (FuzzyMatcher.SHORT_ALIAS_MAX_LENGTH and
SHORT_ALIAS_RATIO_FLOOR). A match that fails the stricter check is left
PENDING instead of being resolved, so it falls through to the semantic
(LLM) tier rather than writing a wrong canonical field. That is the
correct failure mode: an extra LLM call costs a little, a silently wrong
mapping costs a client's data.

Run:
    pytest backend/tests/test_fuzzy_matcher_short_alias_guard.py
"""

import pytest

from backend.models.schema_mapping_models import MappingStatus, SchemaMapping
from backend.services.recovery_engine.fuzzy_matcher import FuzzyMatcher
from backend.services.recovery_engine.rule_mapping_utils import (
    build_alias_lookup,
    build_canonical_alias_lookup,
    normalize_alias,
    validate_rule_mappings,
)


# A small, self-contained rule table covering both the reported false
# positives and a handful of genuine short-alias matches, so this test
# does not depend on the full production rule_mappings.json.
RULE_MAPPINGS = {
    "account_owner": ["account_owner", "owner"],
    "opportunity_owner": ["opportunity_owner", "opp_owner", "deal_owner"],
    "business_unit": ["business_unit", "bu"],
    "postal_code": ["postal_code", "zip"],
    "mobile_number": ["mobile_number", "mobile"],
    "first_name": ["first_name", "first"],
}


@pytest.fixture
def fuzzy_matcher() -> FuzzyMatcher:
    validated = validate_rule_mappings(RULE_MAPPINGS)
    alias_lookup = build_alias_lookup(validated)
    canonical_alias_lookup = build_canonical_alias_lookup(validated)
    return FuzzyMatcher(
        canonical_schema=None,
        alias_lookup=alias_lookup,
        canonical_alias_lookup=canonical_alias_lookup,
        confidence_threshold=85.0,
    )


def _mapping(source_header: str) -> SchemaMapping:
    return SchemaMapping(
        source_header=source_header,
        normalized_source_header=normalize_alias(source_header),
    )


class TestShortAliasFalsePositivesAreRejected:
    """The two real false positives found in testing must not resolve."""

    def test_opp_owner_no_longer_resolves_to_account_owner(self, fuzzy_matcher):
        mapping = _mapping("Opp Owner")
        fuzzy_matcher.process([mapping])

        assert mapping.status == MappingStatus.PENDING
        assert mapping.canonical_field is None

    def test_tag_bucket_no_longer_resolves_to_business_unit(self, fuzzy_matcher):
        mapping = _mapping("tag_bucket_3")
        fuzzy_matcher.process([mapping])

        assert mapping.status == MappingStatus.PENDING
        assert mapping.canonical_field is None


class TestGenuineShortAliasMatchesStillWork:
    """The guard must not reject legitimate short-alias matches."""

    def test_zip_typo_still_resolves(self, fuzzy_matcher):
        mapping = _mapping("zipp")
        fuzzy_matcher.process([mapping])

        assert mapping.status == MappingStatus.RESOLVED
        assert mapping.canonical_field == "postal_code"

    def test_mobile_with_trailing_word_still_resolves(self, fuzzy_matcher):
        mapping = _mapping("mobile no")
        fuzzy_matcher.process([mapping])

        assert mapping.status == MappingStatus.RESOLVED
        assert mapping.canonical_field == "mobile_number"


class TestLongAliasMatchingIsUnaffected:
    """The guard only applies to short aliases; longer ones are untouched."""

    def test_deal_owner_typo_still_resolves_to_opportunity_owner(self, fuzzy_matcher):
        mapping = _mapping("dealownr")
        fuzzy_matcher.process([mapping])

        assert mapping.status == MappingStatus.RESOLVED
        assert mapping.canonical_field == "opportunity_owner"
