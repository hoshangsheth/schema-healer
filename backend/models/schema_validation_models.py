"""
Validate Models.

Defines the validation result produced after the recovery pipeline
has completed.
"""

# IMPORTS
from pydantic import BaseModel

# SCHEMAVALIDATIONRESULT
class SchemaValidationResult(BaseModel):
    """
    Represents the outcome of validating recovered schema mappings.

    Attributes:

    is_valid:
        Indicates whether the recovered mappings are internally valid.

    unresolved_headers:
        Uploaded headers that could not be resolved by the recovery pipeline.

    duplicate_canonical_fields:
        Canonical fields assigned to more than one uploaded header.

    invalid_mappings:
        Uploaded headers whose SchemaMapping objects are internally
        inconsistent.
    """

    is_valid: bool

    unresolved_headers: list[str]

    duplicate_canonical_fields: list[str]

    invalid_mappings: list[str]