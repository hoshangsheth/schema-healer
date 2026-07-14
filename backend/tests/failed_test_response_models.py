from backend.models.response_models import (
    FailedResponse,
    ResponseStatus,
    ErrorType
)

response = FailedResponse(
    status = ResponseStatus.FAILED,
    message = "Schema Validation failed.",

    error_types = [
        ErrorType.DUPLICATE_COLUMNS,
        ErrorType.NUMERIC_HEADERS
    ],

    actual_columns = [
        "customer_email",
        "customer_email",
        "1"
    ],

    missing_columns = [],
    extra_columns = [],

    duplicate_columns = [
        "customer_email"
    ],

    numeric_headers = [
        "1"
    ],

    invalid_columns = []
)

print(response)