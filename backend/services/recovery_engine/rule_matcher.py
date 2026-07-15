# Import required libraries:
from backend.models.recovery_models import RecoveryMatchResult

# Define the function:
def match_by_rules(
    columns_to_recover: list[str],
    rule_mappings: dict[str, str]
) -> RecoveryMatchResult:
    
    # Create placeholders to store the results
    applied_mappings = {}
    unresolved_columns  = []

    # Iterate through every uploaded column
    for col in columns_to_recover:
        # Check whether a deterministic rule exits
        if col in rule_mappings:
            # Store the successful mapping
            applied_mappings[col] = rule_mappings[col]
        else:
            # Store columns that couldn't be mapped
            unresolved_columns.append(col)

    return RecoveryMatchResult(
        applied_mappings=applied_mappings,
        unresolved_columns=unresolved_columns
    )