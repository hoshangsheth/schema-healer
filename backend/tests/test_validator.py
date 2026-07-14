from backend.validators.schema_validator import validate_schema

expected = [
    "transaction_id",
    "customer_email",
    "purchase_amount",
    "purchase_date"
]

actual = [
    "txn_id",
    "email_address",
    "total_cost",
    "date"
]

result = validate_schema(
    actual, expected
)

print(result)