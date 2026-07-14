from backend.models.response_models import (
    PassedResponse,
    ResponseStatus
)

response = PassedResponse(
    status = ResponseStatus.PASSED,
    message = "Schema Validation passed.",
    actual_columns = [
        "transaction_id",
        "customer_email"
    ]
)

print(response)