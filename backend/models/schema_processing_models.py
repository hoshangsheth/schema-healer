"""
Models representing the result of the schema processing workflow.
"""

# IMPORTS
from pydantic import BaseModel
from backend.models.schema_mapping_models import SchemaMapping
from backend.models.schema_validation_models import SchemaValidationResult

# SCHEMA PROCESSING RESULT
class SchemaProcessingResult(BaseModel):
    """
    Represents the complete outcome of schema processing.

    Attributes:

    mappings:
        Recovery results for each uploaded column.

    validation_result:
        Validation outcome for the recovered mappings.
    """

    mappings: list[SchemaMapping]
    validation_result = SchemaValidationResult
