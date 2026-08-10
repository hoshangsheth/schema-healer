"""
Regression tests for SemanticMatcher error handling.

Verifies that both known semantic-recovery failure modes degrade the
pipeline gracefully (leave affected mappings PENDING) instead of
propagating as an unhandled exception:

- LLMGenerationError   (provider communication failure)
- SemanticResponseError (provider responded, but violated the
  expected response contract)

Run:
    pytest backend/tests/test_semantic_matcher_error_handling.py
"""

import pytest

from backend.domain.schema.canonical_schema import (
    CanonicalField,
    CanonicalSchema,
)
from backend.exceptions.llm_exceptions import LLMGenerationError
from backend.exceptions.semantic_exceptions import SemanticResponseError
from backend.models.schema_mapping_models import (
    MappingStatus,
    SchemaMapping,
)
from backend.services.recovery_engine import semantic_matcher as semantic_matcher_module
from backend.services.recovery_engine.semantic_matcher import SemanticMatcher


def _build_pending_mapping() -> SchemaMapping:
    return SchemaMapping(
        source_header="Mobile",
        normalized_source_header="mobile",
    )


def _build_canonical_schema() -> CanonicalSchema:
    return CanonicalSchema(
        fields=[CanonicalField(name="phone")],
    )


@pytest.mark.parametrize(
    "raised_exception",
    [LLMGenerationError("provider unavailable"), SemanticResponseError("invalid contract")],
)
def test_process_leaves_mapping_pending_on_semantic_failure(monkeypatch, raised_exception):
    """
    Both LLMGenerationError and SemanticResponseError must be caught
    inside SemanticMatcher.process(): the mapping stays PENDING and no
    exception escapes the matcher.
    """

    def _raise(*_args, **_kwargs):
        raise raised_exception

    monkeypatch.setattr(
        semantic_matcher_module,
        "generate_semantic_matches",
        _raise,
    )

    matcher = SemanticMatcher(canonical_schema=_build_canonical_schema())
    mapping = _build_pending_mapping()

    # Must not raise.
    matcher.process([mapping])

    assert mapping.status is MappingStatus.PENDING
    assert mapping.canonical_field is None
