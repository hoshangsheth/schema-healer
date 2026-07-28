from dataclasses import dataclass, field


@dataclass(frozen=True, slots=True)
class CanonicalField:
    """
    Represents a single canonical field within the canonical schema.

    Attributes
    ----------
    name:
        Unique canonical field identifier.

    description:
        Optional business description used to improve
        semantic matching.
    """

    name: str
    description: str | None = None


@dataclass(frozen=True, slots=True)
class CanonicalSchema:
    """
    Represents the application's canonical schema.

    Attributes
    ----------
    fields:
        Collection of canonical fields available for schema matching.
    """

    fields: list[CanonicalField] = field(default_factory=list)