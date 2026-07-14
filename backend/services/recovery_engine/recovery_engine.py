# Import required libraries
from backend.core.config import load_rule_mappings
from backend.services.recovery_engine.rule_matcher import match_by_rules
from backend.models.recovery_models import RuleMatchResult

# Define recover_schema() function:
def recover_schema(
        columns_to_recover: list[str]
) -> RuleMatchResult:
    
    # Load deterministic rule mappings
    rule_mappings = load_rule_mappings()

    # Execute rule-based recovery
    rule_match_result = match_by_rules(
        columns_to_recover=columns_to_recover,
        rule_mappings=rule_mappings
    )

    # Return the recovery result
    return rule_match_result