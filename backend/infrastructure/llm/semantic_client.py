"""
Infrastructure adapter for SchemaHealer's semantic recovery pipeline.

This module provides the bridge between the business layer and the
generic LLM client.

Responsibilities:
- Convert SemanticPrompt objects into LLMRequest objects.
- Submit semantic prompts through the generic LLM client.
- Validate the structured LLM response.
- Convert validated responses into SemanticMatchResult domain models.

This module intentionally contains no recovery or business logic.
Its responsibility is limited to request translation and response
parsing.
"""

from backend.exceptions.semantic_exceptions import (
    SemanticResponseError
)
from backend.infrastructure.llm.client import (
    generate_json_response
)
from backend.infrastructure.llm.models import (
    LLMRequest
)
from backend.models.semantic_models import (
    SemanticMatch,
    SemanticMatchResult,
    SemanticPrompt
)

def generate_semantic_matches(
    prompt: SemanticPrompt,
) -> SemanticMatchResult:
    """
    Generate semantic schema matches using the configured
    language model.

    The semantic prompt is converted into a generic LLM request,
    submitted through the LLM client, and the validated response
    is returned as a SemanticMatchResult.

    Args:
        prompt:
            Fully constructed semantic prompt.

    Returns:
        A validated SemanticMatchResult containing semantic
        matches returned by the language model.

    Raises:
        SemanticResponseError:
            If the returned response violates the expected
            semantic response contract.
    """

    request = _build_request(prompt)

    response = generate_json_response(request)

    return _parse_matches(response.structured_output)


def _build_request(
    prompt: SemanticPrompt,
) -> LLMRequest:
    """
    Convert a semantic prompt into the generic request format
    expected by the LLM client.

    Args:
        prompt:
            Fully constructed semantic prompt.

    Returns:
        An LLMRequest ready to be submitted to the configured
        language model.
    """

    return LLMRequest(
        system_prompt=prompt.system_prompt,
        user_prompt=prompt.user_prompt,
        prompt_version=prompt.prompt_version
    )


def _parse_matches(
    structured_output: dict,
) -> SemanticMatchResult:
    """
    Parse the structured LLM response into validated
    semantic domain models.

    Args:
        structured_output:
            Structured JSON response returned by the
            generic LLM client.

    Returns:
        A validated SemanticMatchResult.

    Raises:
        SemanticResponseError:
            If the response does not match the expected
            semantic response contract.
    """

    if "matches" not in structured_output:
        raise SemanticResponseError(
            "Semantic response is missing the 'matches' field."
        )

    matches = structured_output["matches"]

    if not isinstance(matches, list):
        raise SemanticResponseError(
            "'matches' must be a list."
        )

    semantic_matches: list[SemanticMatch] = []

    for match in matches:

        _validate_match(match)

        semantic_matches.append(
            SemanticMatch(
                normalized_source_header=match[
                    "normalized_source_header"
                ],
                canonical_field_name=match[
                    "canonical_field_name"
                ],
                confidence=match["confidence"],
            )
        )

    return SemanticMatchResult(
        matches=semantic_matches
    )


from typing import Any


def _validate_match(
    match: dict[str, Any]
) -> None:
    """
    Validate a single semantic match returned by the language model.

    Args:
        match:
            Dictionary representing a single semantic match.

    Raises:
        SemanticResponseError:
            If the semantic match violates the expected response
            contract.
    """

    required_fields = (
        "normalized_source_header",
        "canonical_field_name",
        "confidence",
    )

    for field in required_fields:
        if field not in match:
            raise SemanticResponseError(
                f"Semantic match is missing the '{field}' field."
            )

    if not isinstance(
        match["normalized_source_header"],
        str,
    ):
        raise SemanticResponseError(
            "'normalized_source_header' must be a string."
        )

    canonical_field_name = match["canonical_field_name"]

    if (
        canonical_field_name is not None
        and not isinstance(canonical_field_name, str)
    ):
        raise SemanticResponseError(
            "'canonical_field_name' must be a string or null."
        )

    confidence = match["confidence"]

    if (
        isinstance(confidence, bool)
        or not isinstance(confidence, (int, float))
    ):
        raise SemanticResponseError(
            "'confidence' must be a numeric value."
        )

    if not 0.0 <= confidence <= 1.0:
        raise SemanticResponseError(
            "'confidence' must be between 0.0 and 1.0."
        )

    # Validate the relationship between canonical_field_name
    # and confidence.
    if (
        canonical_field_name is None
        and confidence != 0.0
    ):
        raise SemanticResponseError(
            "confidence must be 0.0 when "
            "canonical_field_name is null."
        )