from backend.models.response_models import (
    PassedResponse,
    ResponseStatus
)

response = PassedResponse(
    status = "SUCCESS",
    message = "Schema validation passed.",
    actual_columns = []
)

print(response)