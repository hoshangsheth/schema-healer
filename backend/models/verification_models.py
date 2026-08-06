"""
Verification domain models.

This module defines the business models representing the outcome of the
dataset verification stage within the SchemaHealer processing pipeline.

These models are framework-independent domain objects used internally by
the Verification Service to communicate dataset verification results.

Responsibilities:
- Represent verification findings.
- Represent verification severity.
- Represent verification categories.
- Represent the overall verification result.

This module intentionally contains no verification logic, DataFrame
operations, configuration loading, or API response models.
"""

# IMPORTS
from dataclasses import dataclass
from enum import IntEnum, Enum

# VERIFICATION SEVERITY
class VerificationSeverity(IntEnum):
    """
    Represents the operational severity of a verification finding.

    The numeric ordering is intentional and allows severity levels
    to be compared directly when determining the overall verification
    outcome.
    """

    INFO = 1
    WARNING = 2
    ERROR = 3


# VERIFICATION TYPE
class VerificationType(Enum):
    """
    Represents the category of a verification finding.

    Verification types classify the kind of dataset quality issue
    identified during the verification stage.
    """

    MISSING_REQUIRED_COLUMNS = "missing_required_columns"
    UNRESOLVED_COLUMNS = "unresolved_columns"
    DUPLICATE_COLUMNS = "duplicate_columns"


# VERIFICATION FINDING
@dataclass(frozen=True)
class VerificationFinding:
    """
    Represents a single verification finding produced during dataset verification.

    A verification finding captures one specific dataset quality issue identified
    by the Verification Service. It contains both machine-readable metadata and
    a default human-readable description.

    Attributes:
        severity:
            The operational severity of the verification finding.

        type:
            The category of dataset quality issue detected.

        affected_columns:
            The dataset columns associated with this finding. This may contain
            one or more column names, or None when the finding applies to the
            dataset as a whole.

        message:
            A default human-readable description of the verification finding.
    """

    severity: VerificationSeverity
    type: VerificationType
    affected_columns: list[str] | None
    message: str

# VERIFICATION RESULT
@dataclass(frozen=True)
class VerificationResult:
    """
    Represents the complete outcome of dataset verification.

    This model aggregates all verification findings produced during the
    verification stage and summarizes the overall verification state of
    the recovered dataset.

    Attributes:
        is_dataset_verified:
            Indicates whether the recovered dataset satisfies all
            verification requirements.

        overall_severity:
            The highest verification severity identified across all
            verification findings.

        findings:
            An immutable collection of verification findings generated
            during dataset verification.
    """

    is_dataset_verified: bool
    overall_severity: VerificationSeverity
    findings: tuple[VerificationFinding, ...]