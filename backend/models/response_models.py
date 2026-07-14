# Import libraries:
from enum import Enum
from typing import List

from pydantic import BaseModel

# Class Instance : ResponseStatus Enum
class ResponseStatus(str, Enum):
    PASSED = "passed"
    RECOVERED = "recovered"
    FAILED = "failed"


# Class Instance : ErrorType Enum
class ErrorType(str, Enum):
    MISSING_COLUMNS = "MISSING_COLUMNS"
    DUPLICATE_COLUMNS = "DUPLICATE_COLUMNS"
    INVALID_HEADERS = "INVALID_HEADERS"
    NUMERIC_HEADERS = "NUMERIC_HEADERS"

    INVALID_FILE_TYPE = "INVALID_FILE_TYPE"
    CSV_READ_ERROR = "CSV_READ_ERROR"
    EMPTY_FILE = "EMPTY_FILE"


# Class Instance :  BaseModel - Response
class BaseResponse(BaseModel):
    status : ResponseStatus
    message : str


# Class Instance : Passed Response
class PassedResponse(BaseResponse):
    actual_columns : List[str]

# Class Instance : Recovered Response
class RecoveredResponse(BaseResponse):
    applied_mappings : dict[str, str]
    actual_columns : list[str]
    unresolved_columns : list[str]

# Class Instance : Failed Response
class FailedResponse(BaseResponse):
    error_type : List[ErrorType]
    
    actual_columns : List[str]

    missing_columns : List[str]
    extra_columns : List[str]

    duplicate_columns : List[str]
    invalid_columns : List[str]
    numeric_headers : List[str]