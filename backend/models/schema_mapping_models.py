"""
Domain models for SchemaHealer's Recovery Engine.

These models represent the core business entities used throughout
the schema recovery pipeline. They define the shared contract between the
Recovery Orchestrator, matches, validators, and reporing layer.

These models intentionally remain independent of API requests,
workflow orchestration, and validation specific concerns.
"""

# IMPORTS
from enum import Enum
from typing import Optional
from pydantic import BaseModel


# MAPPING STATUS
class MappingStatus(str, Enum):
    """
    Represents the current lifecycle state of a schema mapping.
    """

    PENDING = "pending"
    RESOLVED = "resolved"
    UNRECOGNIZED = "unrecognized"


# RECOVERY METHOD
class RecoveryMethod(str, Enum):
    """
    Represents the recovery strategy that successfully resolved
    a schema mapping.
    """

    RULE = "rule"
    FUZZY = "fuzzy"
    SEMANTIC = "semantic"


# SCHEMA MAPPING
class SchemaMapping(BaseModel):
    """
    Represents the recovery lifecycle of a single uploaded schema header.

    A SchemaMapping stores both the original uploaded header and its normalized
    representation, along with the recovery status and the resolved canonical
    business concept (if one is found).

    This object is progressively enriched as it moves through the recovery
    pipeline.
    """

    # Original header extracted from the uploaded dataset.
    source_header : str

    # Normalized original header
    normalized_source_header: str

    # Canonical Data Model field assigned after recovery.
    canonical_field : Optional[str] = None

    # Current lifecycle state of this mapping.
    status : MappingStatus = MappingStatus.PENDING

    # Recovery strategy responsible for resolving this mapping.
    recovery_method : Optional[RecoveryMethod] = None