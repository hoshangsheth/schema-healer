# Import required library
from pydantic import BaseModel

from backend.models.validation_models import SchemaValidationResult
from backend.models.recovery_models import RuleMatchResult

# Class instance of processing result
class SchemaProcessingResult(BaseModel):
    validation_result: SchemaValidationResult
    recovery_result: RuleMatchResult | None = None