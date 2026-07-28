"""
Recovery Engine Factory.

Constructs and configures the recovery engine by assembling the
required recovery matchers and injecting their dependencies.

This module serves as a Composition Root for the recovery pipeline.
"""

# IMPORTS
from pathlib import Path
from backend.core.config import load_rule_mappings
from backend.domain.schema.schema_loader import CanonicalSchemaLoader
from backend.services.normalization.header_normalizer import normalize_header
from backend.services.recovery_engine.recovery_matcher import RecoveryMatcher
from backend.services.recovery_engine.rule_matcher import RuleMatcher
from backend.services.recovery_engine.fuzzy_matcher import FuzzyMatcher
from backend.services.recovery_engine.recovery_engine import RecoveryEngine
from backend.services.recovery_engine.semantic_matcher import SemanticMatcher


# TEMPORARY CONFIGURATION (TO BE MOVED INTO config.py LATER)
DEFAULT_FUZZY_CONFIDENCE_THRESHOLD = 85.0

# LOAD SCHEMA
CANONICAL_SCHEMA_PATH = Path(
    "backend/resources/schemas/expected_schema.json"
)

# LOAD RULE MAPPINGS
rule_mappings = load_rule_mappings()
normalized_rule_mappings = {
    normalize_header(key): value
    for key, value in rule_mappings.items()
}

# RECOVERY ENGINE FACTORY
class RecoveryEngineFactory:
    """
    Factory responsile for constructing a fully configured
    RecoveryEngine instance.
    """

    @staticmethod
    def create() -> RecoveryEngine:
        """
        Build and configure the recovery pipeline.

        Returns
        -------
        RecoveryEngine
            Fully configured recovery engine.
        """

        schema_loader = CanonicalSchemaLoader(
            schema_path=CANONICAL_SCHEMA_PATH
        )

        canonical_schema = schema_loader.load()

        matchers: list[RecoveryMatcher] = [
            RuleMatcher(
                rule_mappings = normalized_rule_mappings
            ),
            FuzzyMatcher(
                canonical_schema = canonical_schema,
                confidence_threshold = DEFAULT_FUZZY_CONFIDENCE_THRESHOLD
            ),
            SemanticMatcher(
                canonical_schema=canonical_schema
            )
            
        ]

        return RecoveryEngine(matchers=matchers)