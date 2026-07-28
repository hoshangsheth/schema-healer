"""
Semantic domain models.

This module defines the business models used by the Semantic Recovery
workflow. These models represent provider-agnostic contracts shared
between the Prompt Builder, Semantic Matching Service, and other
components involved in AI-assisted schema recovery.

The models defined here intentionally contain only domain data and
must not include business logic, provider-specific SDK objects,
or infrastructure concerns.
"""

# IMPORTS
from dataclasses import dataclass

# SEMANTIC PROMPT
@dataclass(frozen=True)
class SemanticPrompt:
    """
    Represents the complete prompt required for semantic schema recovery.

    The prompt builder constructs this object, which is then consumed by the
    Semantic Matching Service. It is intentionally provider-agnostic and contains
    only prompt content, not provider-specific configuration.
    """

    system_prompt: str
    user_prompt: str
    prompt_version: str

# SEMANTIC MATCH
@dataclass(frozen=True, slots=True)
class SemanticMatch:
    """
    Represents a single semantic field match returned by the LLM.
    """

    normalized_source_header: str
    canonical_field_name: str
    confidence: float

# SEMANTIC MATCH RESULT
@dataclass(frozen=True, slots=True)
class SemanticMatchResult:
    """
    Collection of semantic matches returned by the LLM.
    """

    matches: list[SemanticMatch]