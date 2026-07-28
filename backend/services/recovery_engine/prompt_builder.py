"""
Prompt builder for semantic schema recovery.

This module is responsible for converting SchemaHealer's domain
models into a SemanticPrompt suitable for LLM-based semantic
matching.

The PromptBuilder performs formatting only. It does not invoke
the language model or interpret model responses.
"""

from backend.domain.schema.canonical_schema import CanonicalSchema
from backend.models.schema_mapping_models import SchemaMapping
from backend.services.recovery_engine.prompts import (
    SEMANTIC_MATCH_EXAMPLE,
    SEMANTIC_MATCH_SYSTEM_PROMPT,
    SEMANTIC_MATCH_USER_PROMPT_TEMPLATE
)
from backend.models.semantic_models import SemanticPrompt


class PromptBuilder:
    """
    Builds semantic matching prompts from domain models.
    """

    def build(
        self,
        mappings: list[SchemaMapping],
        canonical_schema: CanonicalSchema,
    ) -> SemanticPrompt:
        """
        Build a semantic matching prompt.

        Parameters
        ----------
        mappings:
            Collection of schema mappings.

        canonical_schema:
            Canonical schema available for semantic matching.

        Returns
        -------
        SemanticPrompt
            Fully constructed prompt ready for the LLM.
        """

        canonical_schema_text = self._format_canonical_schema(
            canonical_schema
        )

        source_columns_text = self._format_source_columns(
            mappings
        )

        user_prompt = SEMANTIC_MATCH_USER_PROMPT_TEMPLATE.format(
            canonical_schema=canonical_schema_text,
            source_columns=source_columns_text,
            example=SEMANTIC_MATCH_EXAMPLE,
        )

        return SemanticPrompt(
            system_prompt=SEMANTIC_MATCH_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            prompt_version="1.0.0"
        )

    @staticmethod
    def _format_canonical_schema(
        canonical_schema: CanonicalSchema,
    ) -> str:
        """
        Format the canonical schema for prompt inclusion.

        Each canonical field is rendered with both its name and
        description so the language model has the semantic context
        required to perform accurate schema matching.
        """

        formatted_fields: list[str] = []

        for field in canonical_schema.fields:

            description = (
                field.description.strip()
                if field.description
                else "No description available."
            )

            formatted_fields.append(
                "\n".join(
                    [
                        f"Field Name: {field.name}",
                        f"Description: {description}",
                    ]
                )
            )

        return "\n\n".join(formatted_fields)


    @staticmethod
    def _format_source_columns(
        mappings: list[SchemaMapping],
    ) -> str:
        """
        Format normalized source columns for prompt inclusion.

        Each normalized source header is rendered on its own line.
        The language model must return these identifiers exactly as
        provided.

        Args:
            mappings:
                Collection of schema mappings requiring semantic
                recovery.

        Returns:
            String representation of normalized source headers.
        """

        return "\n".join(
            mapping.normalized_source_header
            for mapping in mappings
        )