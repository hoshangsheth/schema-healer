# Import libraries:
from typing import Dict, List
from collections import Counter
from backend.models.validation_models import SchemaValidationResult

# Define a function to validate schema:
def validate_schema(
        actual_columns : List[str],
        expected_columns : List[str]
) -> SchemaValidationResult:


    # Detect Invalid columns:
    invalid_columns = [
        col for col in actual_columns
        if col is None or str(col).strip() == ""
    ]

    # Normalize columns for comparison
    normalized_actual = [
        str(col).strip().lower()
        for col in actual_columns
    ]

    normalized_expected = [
        str(col).strip().lower()
        for col in expected_columns
    ]

    # Detect numeric headers:
    numeric_headers = [
        col for col in normalized_actual
        if col.isdigit()
    ]

    # Detect duplicate columns:
    column_counts = Counter(normalized_actual)
    duplicate_columns = [
        col for col, count in
        column_counts.items() if count > 1
    ]
    
    # Convert to set:
    actual_set = set(normalized_actual)
    expected_set = set(normalized_expected)

    # Check for missing columns:
    missing_columns = list(
        expected_set - actual_set
    )

    # Check for extra columns:
    extra_columns = list(
        actual_set - expected_set
    )

    # Finalize validation:
    is_valid = (
        len(missing_columns) == 0
        and len(duplicate_columns) == 0
        and len(invalid_columns) == 0
        and len(numeric_headers) == 0
    )

    # Return result:
    return SchemaValidationResult(
        is_valid=is_valid,
        invalid_columns=invalid_columns,
        numeric_headers=numeric_headers,
        duplicate_columns=duplicate_columns,
        actual_columns=actual_columns,
        expected_columns=expected_columns,
        missing_columns=missing_columns,
        extra_columns=extra_columns
        )