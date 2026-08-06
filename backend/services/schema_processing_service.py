"""
Schema processing service.

Coordinates the complete schema processing workflow by parsing the
uploaded CSV, executing the recovery pipeline, validating the recovered
mappings, and returning the final processing result.
"""


# Standard library
from io import StringIO
import csv

# Exceptions
from backend.exceptions.processing_exceptions import (
    EmptyFileError,
    InvalidFileTypeError,
)

# Models
from backend.models.schema_processing_models import SchemaProcessingResult
from backend.services.recovery_engine.recovery_engine_factory import RecoveryEngineFactory
from backend.validators.schema_validator import validate_schema

# Services
from backend.reports.builders.healing_report_builder import HealingReportBuilder
from backend.services.dataframe.recovered_dataframe_builder import RecoveredDataFrameBuilder
from backend.services.verification.verification_service import VerificationService


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

    # Guard against unsupported file types.
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

    # Materialize the uploaded dataset.
    rows = list(csv_reader)

    # Guard against an empty CSV file.
    if (
        not rows
        or not rows[0]
        or not any(
            header.strip()
            for header in rows[0]
        )
    ):
        raise EmptyFileError(
            "Uploaded CSV file is empty."
        )

    # Separate the header row from the dataset.
    header_row = rows[0]
    data_rows = rows[1:]

    # Create the recovery pipeline.
    recovery_engine = RecoveryEngineFactory.create()

    # Recover schema
    mappings = recovery_engine.recover(header_row)

    # Validate the result
    validation_result = validate_schema(mappings)

    # Build the recovered dataset.
    recovered_dataframe_builder = RecoveredDataFrameBuilder()

    recovered_dataframe = recovered_dataframe_builder.build(
        header_row=header_row,
        data_rows=data_rows,
        mappings=mappings
    )

    # Verify the recovered dataset.
    verification_service = VerificationService()

    verification_result = verification_service.verify(
        recovered_dataframe=recovered_dataframe,
        mappings=mappings
    )

    # Build the Healing Report.
    healing_report_builder = HealingReportBuilder()

    healing_report = healing_report_builder.build(
        mappings=mappings,
        verification_result=verification_result,
    )

    # Return
    return SchemaProcessingResult(
        mappings=mappings,
        validation_result=validation_result,
        recovered_dataframe=recovered_dataframe,
        verification_result=verification_result,
        healing_report=healing_report,
    )