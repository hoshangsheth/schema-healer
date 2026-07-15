# Import recover schema engine
from backend.services.recovery_engine.recovery_engine import recover_schema

EXPECTED_SCHEMA = [
    "transaction_id",
    "customer_email",
    "purchase_amount",
    "purchase_date",
]

CONFIDENCE_THRESHOLD = 85.0

print("=" * 60)
print("TEST 1 - RULE MATCHING ONLY")
print("=" * 60)

result = recover_schema(
    columns_to_recover=[
        "txn_id",
        "email_address"
    ],
    expected_schema=EXPECTED_SCHEMA,
    confidence_threshold=CONFIDENCE_THRESHOLD
)

print(f"Applied Mappings   : {result.applied_mappings}")
print(f"Unresolved Columns : {result.unresolved_columns}")
print("-" * 60)

print("=" * 60)
print("TEST 2 - FUZZY MATCHING")
print("=" * 60)

result = recover_schema(
    columns_to_recover=[
        "purchase_amt",
    ],
    expected_schema=EXPECTED_SCHEMA,
    confidence_threshold=CONFIDENCE_THRESHOLD,
)

print(f"Applied Mappings   : {result.applied_mappings}")
print(f"Unresolved Columns : {result.unresolved_columns}")
print("-" * 60)

print("=" * 60)
print("TEST 3 - MIXED RECOVERY")
print("=" * 60)

result = recover_schema(
    columns_to_recover=[
        "txn_id",
        "purchase_amt",
    ],
    expected_schema=EXPECTED_SCHEMA,
    confidence_threshold=CONFIDENCE_THRESHOLD,
)

print(f"Applied Mappings   : {result.applied_mappings}")
print(f"Unresolved Columns : {result.unresolved_columns}")
print("-" * 60)

print("=" * 60)
print("TEST 4 - COMPLETE FAILURE")
print("=" * 60)

result = recover_schema(
    columns_to_recover=[
        "random_column",
    ],
    expected_schema=EXPECTED_SCHEMA,
    confidence_threshold=CONFIDENCE_THRESHOLD,
)

print(f"Applied Mappings   : {result.applied_mappings}")
print(f"Unresolved Columns : {result.unresolved_columns}")
print("-" * 60)

