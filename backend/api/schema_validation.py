# FastAPI endpoint that connects HTTP Request to JSON Response

""" Import required libraries """

# Import FastAPI Components:
from fastapi import (
    APIRouter,          # Organized routes by feature
    UploadFile,         # Intercepts and converts raw binary into high level python object
    File,               # Parameter responsible in allowing fastpi to expect form/multi-part data
    HTTPException,      # Allows API layer to return proper HTTP error
    status              # For better and readable status code instead of raw strings
)

# Import Response Models:   Contracts designed to consistency and avoid raw strings
from backend.models.response_models import (
    PassedResponse,
    FailedResponse,
    ResponseStatus,
    ErrorType
)

# Import Validation Services:   Only Business Function the API knows about - Validating the CSV File
from backend.services.schema_validation_service import validate_uploaded_schema

""" Initialize Router """
router = APIRouter(
    prefix="/schema",
    tags=["Schema Validation"]
)

# API Endpoint : Schema Validation
@router.post("/validate")               # Decorator - used for additional behavior on the function
async def validate_schema_endpoint(
    file : UploadFile = File(...)
):
    # Validate uploaded schema
    result = validate_uploaded_schema(file)

    # Raise HTTP Exception to handle system level failures (Guard Clause)
    if not result["success"]:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = result['error']['message']
        )
    
    # Extract schema validation result
    validation_result = result["data"]
    # Return successful schema validation response:
    if validation_result["is_valid"]:
        return PassedResponse(
            status = ResponseStatus.PASSED,
            message = "Schema validation passed.",
            actual_columns = validation_result["actual_columns"]
        )
    
    # Return failed schema validation response:
    return FailedResponse(
        status = ResponseStatus.FAILED,
        message = "Schema validation failed.",
        error_type = [
            error
            for error in ErrorType
            if (
                (
                    error == ErrorType.MISSING_COLUMNS
                    and validation_result["missing_columns"]
                )
                or (
                    error == ErrorType.DUPLICATE_COLUMNS
                    and validation_result["duplicate_columns"]
                )
                or (
                    error == ErrorType.INVALID_HEADERS
                    and validation_result["invalid_columns"]
                )
                or (
                    error == ErrorType.NUMERIC_HEADERS
                    and validation_result["numeric_headers"]
                )
            )
        ],
        actual_columns = validation_result["actual_columns"],
        missing_columns = validation_result["missing_columns"],
        extra_columns = validation_result["extra_columns"],
        duplicate_columns = validation_result["duplicate_columns"],
        invalid_columns = validation_result["invalid_columns"],
        numeric_headers = validation_result["numeric_headers"]
    )
    

    