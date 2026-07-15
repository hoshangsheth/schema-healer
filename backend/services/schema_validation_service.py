# Import libraries:
from io import StringIO
import csv

# Import existing components
from backend.models.response_models import ErrorType
from backend.core.config import load_expected_schema
from backend.validators.schema_validator import validate_schema
from backend.services.recovery_engine.recovery_engine import recover_schema
from backend.models.processing_models import SchemaProcessingResult
from backend.exceptions.processing_exceptions import (
    InvalidFileTypeError,
    EmptyFileError
)

# Temporary configuration
# This will be moved to the configuration layer in the future update
DEFAULT_FUZZY_CONFIDENCE_THRESHOLD = 85.0

# Create a function to process csv file:
def validate_uploaded_schema(file):
    filename = file.filename.strip().lower()

    # Check if its a valid CSV  (Guard Clause)
    if not filename.endswith(".csv"):
        raise InvalidFileTypeError(
            "Only CSV files are supported."
        )
    
    # Decode
    contents = file.file.read().decode("utf-8")
    # Stream
    csv_stream = StringIO(contents)

    # Read the stream
    csv_reader = csv.reader(csv_stream)

    # Extract header rows
    header_row = next(csv_reader, None)

    # Check if iteration comes across empty row
    if header_row is None:
        raise EmptyFileError(
            "Uploaded CSV file is empty."
        )
    
    # Store actual headers below
    actual_columns = header_row

    # Expected columns:
    expected_columns = load_expected_schema()

    # Validate schema:
    validation_result = validate_schema(
        actual_columns,
        expected_columns
    )

    # Attempt recovery if validation fails
    if not validation_result.is_valid:
        # Execute recovering schema
        recovery_result = recover_schema(
            columns_to_recover=validation_result.extra_columns,
            expected_schema=expected_columns,
            confidence_threshold=DEFAULT_FUZZY_CONFIDENCE_THRESHOLD
        )

        # Return result
        return SchemaProcessingResult(
            validation_result=validation_result,
            recovery_result=recovery_result
        )

    # Return result:
    return SchemaProcessingResult(
        validation_result=validation_result
    )