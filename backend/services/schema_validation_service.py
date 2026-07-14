# Import libraries:
from io import StringIO
import csv

# Import existing components
from backend.models.response_models import ErrorType
from backend.core.config import load_expected_schema
from backend.validators.schema_validator import validate_schema


# Create a function to process csv file:
def validate_uploaded_schema(file):
    filename = file.filename.strip().lower()

    # Check if its a valid CSV  (Guard Clause)
    if not filename.endswith(".csv"):
        return {
            "success" : False,
            "error" : {
                "error_type" : ErrorType.INVALID_FILE_TYPE,
                "message" : "Only CSV files are supported"
            }
        }
    
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
        return {
            "success" : False,
            "error" : {
                "error_type" : ErrorType.EMPTY_FILE,
                "message" : "Uploaded CSV file is empty."
            }
        }
    
    # Store actual headers below
    actual_columns = header_row

    # Expected columns:
    expected_columns = load_expected_schema()

    print(f"Actual columns: {actual_columns}")
    print(f"Expected columns: {expected_columns}")

    # Validate schema:
    validation_result = validate_schema(
        actual_columns,
        expected_columns
    )

    print(validation_result)

    # Return result:
    return {
        "success" : True,
        "data" : validation_result
    }