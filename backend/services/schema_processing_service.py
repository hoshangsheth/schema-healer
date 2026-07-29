"""
Schema processing service.

Coordinates the complete schema processing workflow by parsing the
uploaded CSV, executing the recovery pipeline, validating the recovered
mappings, and returning the final processing result.
"""


# IMPORTS
from io import StringIO
import csv

from backend.exceptions.processing_exceptions import (
    EmptyFileError,
    InvalidFileTypeError,
)
from backend.models.schema_processing_models import SchemaProcessingResult
from backend.services.recovery_engine.recovery_engine_factory import (
    RecoveryEngineFactory)
from backend.validators.schema_validator import validate_schema


# PROCESS UPLOADED SCHEMA
def process_uploaded_schema(file) -> SchemaProcessingResult:
    """
    Process an uploaded CSV file through the recovery pipeline.

    Parameters:

    file:
        Uploaded CSV file received by the API.

    Returns:
    
    SchemaProcessingResult:
        Complete processing outcome.
    """

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

    sample = csv_stream.read(2048)

    csv_stream.seek(0)
    try:
        dialect = csv.Sniffer().sniff(
            sample,
            delimiters=",;\t|"
        )
    except csv.Error:
        # Fall back to standard comma-separated CSV
        dialect = csv.get_dialect("excel")

    # Read the stream
    csv_reader = csv.reader(csv_stream, dialect)

    # Extract header rows
    header_row = next(csv_reader, None)

    # Check if iteration comes across empty row
    if header_row is None:
        raise EmptyFileError(
            "Uploaded CSV file is empty."
        )

    # Create pipeline
    recovery_engine = RecoveryEngineFactory.create()

    # Recover schema
    mappings = recovery_engine.recover(header_row)

    # Validate the result
    validation_result = validate_schema(mappings)

    # Return
    return SchemaProcessingResult(
        mappings=mappings,
        validation_result=validation_result
    )