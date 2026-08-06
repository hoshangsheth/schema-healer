"""
Recovery Engine Factory.

Constructs and configures the recovery engine by assembling the
required recovery matchers and injecting their dependencies.

This module serves as a Composition Root for the recovery pipeline.
"""

# IMPORTS
from backend.core.config import SCHEMA_PATH, load_rule_mappings
from backend.domain.schema.schema_loader import CanonicalSchemaLoader
from backend.services.recovery_engine.recovery_matcher import RecoveryMatcher
from backend.services.recovery_engine.rule_matcher import RuleMatcher
from backend.services.recovery_engine.fuzzy_matcher import FuzzyMatcher
from backend.services.recovery_engine.recovery_engine import RecoveryEngine
from backend.services.recovery_engine.semantic_matcher import SemanticMatcher
from backend.services.recovery_engine.rule_mapping_utils import (
    validate_rule_mappings,
    build_alias_lookup,
    build_canonical_alias_lookup
)

# TEMPORARY CONFIGURATION (TO BE MOVED INTO config.py LATER)
DEFAULT_FUZZY_CONFIDENCE_THRESHOLD = 85.0

# LOAD RULE MAPPINGS
rule_mappings = load_rule_mappings()

normalized_rule_mappings = validate_rule_mappings(
    rule_mappings
)

alias_lookup = build_alias_lookup(
    normalized_rule_mappings
)

canonical_alias_lookup = build_canonical_alias_lookup(
    normalized_rule_mappings
)

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
            schema_path=SCHEMA_PATH
        )

        canonical_schema = schema_loader.load()

        matchers: list[RecoveryMatcher] = [
            RuleMatcher(
                alias_lookup=alias_lookup
            ),
            FuzzyMatcher(
                canonical_schema=canonical_schema,
                alias_lookup=alias_lookup,
                canonical_alias_lookup=canonical_alias_lookup,
                confidence_threshold=DEFAULT_FUZZY_CONFIDENCE_THRESHOLD,
            ),
            SemanticMatcher(
                canonical_schema=canonical_schema
            )
            
        ]

        return RecoveryEngine(matchers=matchers)