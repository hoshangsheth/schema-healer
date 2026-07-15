# Import required library:
from pydantic import BaseModel

# Class Instance: Rule Matcher Model
class RecoveryMatchResult(BaseModel):
    applied_mappings: dict[str, str]
    unresolved_columns: list[str]