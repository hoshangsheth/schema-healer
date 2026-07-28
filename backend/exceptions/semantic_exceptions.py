"""
Exceptions used by SchemaHealer's Semantic Recovery workflow.

These exceptions represent semantic-specific failures that occur
after a successful LLM invocation but before the response can be
consumed by the Recovery Engine.

They are intentionally separated from infrastructure exceptions
such as provider communication failures.
"""


class SemanticResponseError(Exception):
    """
    Raised when the semantic LLM response violates the expected
    response contract.

    Examples
    --------
    - Missing required fields.
    - Invalid JSON structure.
    - Invalid confidence values.
    - Unsupported canonical field names.
    """

    pass