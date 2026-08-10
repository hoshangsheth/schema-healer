"""
Business implementation of semantic schema recovery.

The SemanticMatcher coordinates semantic schema matching for
unresolved source columns. It delegates prompt construction to
the PromptBuilder, semantic inference to the semantic client,
and applies validated semantic matches back onto the recovery
mappings.

This module contains business orchestration only. It does not
perform prompt formatting, provider communication, or response
parsing.
"""

# IMPORTS
import logging

from backend.services.recovery_engine.recovery_matcher import RecoveryMatcher
from backend.domain.schema.canonical_schema import CanonicalSchema

from backend.exceptions.llm_exceptions import LLMGenerationError
from backend.exceptions.semantic_exceptions import SemanticResponseError

from backend.models.schema_mapping_models import (
    MappingStatus,
    RecoveryMethod,
    SchemaMapping
)

from backend.models.semantic_models import SemanticMatchResult

from backend.services.recovery_engine.prompt_builder import PromptBuilder

from backend.infrastructure.llm.semantic_client import (
    generate_semantic_matches
)

# MODULE LOGGER
logger = logging.getLogger(__name__)

class SemanticMatcher(RecoveryMatcher):
    """
    Business implementation of semantic schema recovery.

    This matcher coordinates the semantic recovery workflow for
    unresolved schema mappings. It delegates prompt construction
    to the PromptBuilder and semantic inference to the semantic
    client before applying validated semantic matches back onto
    the recovery mappings.
    """

    def __init__(
        self,
        canonical_schema: CanonicalSchema,
    ) -> None:
        """
        Initialize the semantic matcher.

        Args:
            canonical_schema:
                Canonical schema used for prompt generation and
                business validation of semantic matches.
        """

        self._canonical_schema = canonical_schema
        self._prompt_builder = PromptBuilder()


    def process(
        self,
        mappings: list[SchemaMapping]
    ) -> None:
        """
        Perform semantic recovery for unresolved schema mappings.

        Pending mappings are converted into a semantic prompt,
        submitted to the semantic client, and any validated
        semantic matches are applied back onto the recovery
        mappings.

        Args:
            mappings:
                Collection of schema mappings to process.
        """

        pending_mappings = self._get_pending_mappings(
            mappings
        )

        if not pending_mappings:
            return

        prompt = self._prompt_builder.build(
            canonical_schema=self._canonical_schema,
            mappings=pending_mappings
        )

        logger.info("Starting semantic recovery.")
        try:
            semantic_result = generate_semantic_matches(
                prompt=prompt
            )

        except LLMGenerationError:
            logger.warning(
                "Semantic recovery unavailable. Continuing with rule and fuzzy recovery only."
            )
            # Semantic recovery is unavailable.
            # Leave unresolved mappings in their original PENDING state
            # and continue the recovery pipeline.
            return

        except SemanticResponseError as exc:
            logger.warning(
                "Semantic recovery returned an invalid response: %s. "
                "Continuing with rule and fuzzy recovery only.",
                exc,
            )
            # The LLM responded, but its output violated the expected
            # contract. Treat this the same as an unavailable provider:
            # leave unresolved mappings PENDING and continue the pipeline
            # instead of failing the whole request.
            return
        logger.info("Semantic recovery completed successfully.")

        self._apply_matches(
            mappings=pending_mappings,
            semantic_result=semantic_result
        )


    def _get_pending_mappings(
        self,
        mappings: list[SchemaMapping]
    ) -> list[SchemaMapping]:
        """
        Return the schema mappings that still require semantic
        recovery.

        Args:
            mappings:
                Collection of schema mappings.

        Returns:
            A list containing only mappings whose status is
            MappingStatus.PENDING.
        """

        return [
            mapping
            for mapping in mappings
            if mapping.status is MappingStatus.PENDING
        ]


    def _apply_matches(
        self,
        mappings: list[SchemaMapping],
        semantic_result: SemanticMatchResult,
    ) -> None:
        """
        Apply validated semantic matches to the corresponding
        schema mappings.

        Args:
            mappings:
                Pending schema mappings eligible for semantic recovery.

            semantic_result:
                Validated semantic matches returned by the semantic
                client.
        """

        mapping_lookup = {
            mapping.normalized_source_header: mapping
            for mapping in mappings
        }

        valid_canonical_fields = {
            field.name
            for field in self._canonical_schema.fields
        }

        for semantic_match in semantic_result.matches:

            mapping = mapping_lookup.get(
                semantic_match.normalized_source_header,
            )

            if mapping is None:
                continue

            # The language model determined that no sufficiently
            # reliable semantic match exists for this header.
            # Leave the mapping in its original PENDING state.
            if semantic_match.canonical_field_name is None:
                continue

            # Defensive validation. Ignore semantic matches that
            # reference canonical fields not present in the
            # configured schema.
            if (
                semantic_match.canonical_field_name
                not in valid_canonical_fields
            ):
                continue

            mapping.canonical_field = (
                semantic_match.canonical_field_name
            )

            mapping.status = MappingStatus.RESOLVED

            mapping.recovery_method = (
                RecoveryMethod.SEMANTIC
            )


    