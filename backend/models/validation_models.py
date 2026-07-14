# Import required library
from pydantic import BaseModel

# Class instance: Schema Validation Result
class SchemaValidationResult(BaseModel):
    is_valid : bool

    invalid_columns: list[str]

    numeric_headers: list[str]

    duplicate_columns: list[str]

    actual_columns: list[str]

    expected_columns: list[str]

    missing_columns: list[str]

    extra_columns: list[str]