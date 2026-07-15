# Import required libraries
from backend.core.config import load_rule_mappings
from backend.services.recovery_engine.rule_matcher import match_by_rules
from backend.models.recovery_models import RecoveryMatchResult
from backend.services.recovery_engine.fuzzy_matcher import match_by_fuzzy

# Define recover_schema() function:
def recover_schema(
        columns_to_recover: list[str],
        expected_schema: list[str],
        confidence_threshold: float
) -> RecoveryMatchResult:
    
    # Load deterministic rule mappings
    rule_mappings = load_rule_mappings()

    # Execute rule-based recovery
    rule_match_result = match_by_rules(
        columns_to_recover=columns_to_recover,
        rule_mappings=rule_mappings
    )

    # If all columns were recovered using deterministic rules
    # there is no need to execute fuzzy matching mechanism
    if not rule_match_result.unresolved_columns:
        return rule_match_result
    
    # Attempt fuzzy recovery on remaining unresolved columns
    fuzzy_match_result = match_by_fuzzy(
        columns_to_recover=rule_match_result.unresolved_columns,
        expected_schema=expected_schema,
        confidence_threshold=confidence_threshold
    )

    # Combine the mappings produced by the Rule Matcher and Fuzzy Matcher.
    combined_mappings = {
        **rule_match_result.applied_mappings,
        **fuzzy_match_result.applied_mappings
    }

    # Return the recovery result
    return RecoveryMatchResult(
        applied_mappings=combined_mappings,
        unresolved_columns=fuzzy_match_result.unresolved_columns
    )