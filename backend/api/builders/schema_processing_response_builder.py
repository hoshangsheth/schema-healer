"""
Schema processing response builder.

Builds the public API response returned after schema processing
completes successfully.

This builder converts the internal SchemaProcessingResult produced by
the service layer into the JSON-serializable
SchemaProcessingResponse exposed by the API layer.

It intentionally excludes internal pipeline artifacts that should not
be exposed to API consumers.
"""

# IMPORTS
from backend.api.models.schema_processing_response import (
    SchemaProcessingResponse
)
from backend.models.schema_processing_models import (
    SchemaProcessingResult
)

# SCHEMA PROCESSING RESPONSE BUILDER
class SchemaProcessingResponseBuilder:
    """
    Builds the public schema processing API response.
    """

    def build(
        self,
        processing_result: SchemaProcessingResult,
    ) -> SchemaProcessingResponse:
        """
        Build the public schema processing API response.

        Parameters:

        processing_result:
            Internal processing result produced by the schema
            processing service.

        Returns:

        SchemaProcessingResponse:
            JSON-serializable API response.
        """
        return SchemaProcessingResponse(
            mappings=processing_result.mappings,
            validation_result=processing_result.validation_result,
            verification_result=processing_result.verification_result,
            healing_report=processing_result.healing_report,
        )