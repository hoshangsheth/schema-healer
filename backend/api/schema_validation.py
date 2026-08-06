"""
Schema Validation API.

Exposes the schema processing endpoint responsible for receiving uploaded
CSV files and delegating processing to the application service.

The API layer is responsible only for:

- Receiving HTTP requests.
- Translating domain exceptions into HTTP responses.
- Returning the application result.

Business logic belongs to the application service.
"""

# IMPORTS

# FastAPI endpoint that connects HTTP Request to JSON Response
from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    status
)

from backend.exceptions.processing_exceptions import (
    EmptyFileError,
    InvalidFileTypeError
)

from backend.api.models.schema_processing_response import (
    SchemaProcessingResponse
)
from backend.api.builders.schema_processing_response_builder import (
    SchemaProcessingResponseBuilder
)

from backend.services.schema_processing_service import (
    process_uploaded_schema
)


""" Initialize Router """
router = APIRouter(
    prefix="/schema",
    tags=["Schema Validation"]
)

# API Endpoint : Schema Validation
@router.post(
    "/validate",
    response_model=SchemaProcessingResponse
)
async def validate_schema_endpoint(
    file: UploadFile = File(...)
) -> SchemaProcessingResponse:
    """
    Process an uploaded CSV schema.

    Parameters
    ----------
    file:
        Uploaded CSV file received from the client.

    Returns
    -------
    SchemaProcessingResponse
        Public API response containing the user-facing schema processing
        results.

    Raises
    ------
    HTTPException
        Returned when the uploaded file cannot be processed.
    """

    try:
        processing_result = process_uploaded_schema(file)

        response_builder = SchemaProcessingResponseBuilder()

        return response_builder.build(processing_result)

    except InvalidFileTypeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except EmptyFileError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )