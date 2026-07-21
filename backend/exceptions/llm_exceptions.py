"""
Exceptions related to LLM Infrastructure.

These exceptions provide a provider-agnostic interface
between the infrastructure layer and the business layer.
"""

class LLMGenerationError(Exception):
    """
    Raised when an LLM request cannot be completed.
    """
    pass