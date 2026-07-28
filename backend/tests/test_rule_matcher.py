"""
Manual integration test for RuleMatcher.

Run:
    python tests/manual/test_rule_matcher.py
"""

from backend.models.schema_mapping_models import (
    MappingStatus,
    RecoveryMethod,
    SchemaMapping,
)

from backend.services.recovery_engine.rule_matcher import (
    RuleMatcher,
)


def main() -> None:
    """
    Execute a manual RuleMatcher integration test.
    """

    rule_mappings = {
        "customer_id": [
            "customer_id",
            "cust_id",
            "client_id",
        ],
        "email": [
            "email",
            "email_address",
        ],
    }

    matcher = RuleMatcher(rule_mappings)

    mappings = [
        SchemaMapping(
            source_header="Cust_ID",
            normalized_source_header="cust_id",
        ),
        SchemaMapping(
            source_header="Email_Address",
            normalized_source_header="email_address",
        ),
        SchemaMapping(
            source_header="Mobile",
            normalized_source_header="mobile",
        ),
    ]

    matcher.process(mappings)

    print("\nRuleMatcher Results\n")

    for mapping in mappings:

        print(f"Source Header   : {mapping.source_header}")
        print(f"Normalized      : {mapping.normalized_source_header}")
        print(f"Canonical Field : {mapping.canonical_field}")
        print(f"Status          : {mapping.status}")
        print(f"Recovery Method : {mapping.recovery_method}")
        print("-" * 50)


if __name__ == "__main__":
    main()