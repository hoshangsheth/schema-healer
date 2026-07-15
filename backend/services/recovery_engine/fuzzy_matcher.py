# Import required library: Returns business model
from backend.models.recovery_models import RecoveryMatchResult
from rapidfuzz import fuzz, process


"""
Performs deterministic fuzzy matching between unresolved
uploaded columns and expected schema.
"""

def match_by_fuzzy(
    columns_to_recover: list[str],      # Contains unresolved columns after rule matching
    expected_schema: list[str],         # schema to compare against
    confidence_threshold: float,          # rule to enforce
) -> RecoveryMatchResult:
    # Guard Clause 1
    if not columns_to_recover:
        return RecoveryMatchResult(
            applied_mappings={},
            unresolved_columns=[]
        )

    # Guard Clause 2
    if not expected_schema:
        return RecoveryMatchResult(
            applied_mappings={},
            unresolved_columns=columns_to_recover.copy()
        )
    
    # Stores successful fuzzy mappings
    applied_mappings: dict[str, str] = {}

    # Stores columns that could not be matched
    unresolved_columns: list[str] = []

    # Working copy of the expected schema
    # Matched columns will be removed to enforce one-by-one mappings.
    available_expected_columns = expected_schema.copy()

    # Iterate through unresolved column individually
    for uploaded_column in columns_to_recover:
        # Core of the algorithm
        match_result = process.extractOne(
            query=uploaded_column,                  # string trying to identify
            choices=available_expected_columns,     # possible answers
            scorer=fuzz.WRatio                     # combines multiple similarity techniques internally
        )

        # Guard Clause
        if match_result is None:
            unresolved_columns.append(uploaded_column)
            continue
        
        # Unpacking
        matched_column, confidence_score, _ = match_result
        
        # Threshold Check
        if confidence_score >= confidence_threshold:
            # Save mapping
            applied_mappings[uploaded_column] = matched_column
            # Remove candidate from the pool
            available_expected_columns.remove(matched_column)
        else:
            unresolved_columns.append(uploaded_column)

    # Return result
    return RecoveryMatchResult(
        applied_mappings=applied_mappings,
        unresolved_columns=unresolved_columns
    )