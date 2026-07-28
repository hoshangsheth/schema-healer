"""
Defines the abstract contract for all schema recovery strategies.

Every recovery matcher in SchemaHealer must inherit from this class
and implement the 'process()' method.

The Recovery Engine depends only on this abstraction, allowing new recovery
strategies to be introduced without modifying orchestration logic.
"""

# IMPORTS
from abc import ABC, abstractmethod
from backend.models.schema_mapping_models import SchemaMapping


# RECOVERY MATCHER
class RecoveryMatcher(ABC):
    """
    Abstract base class for all schema recovery strategies.

    Each concrete matcher is responsible for attempting recovery on the
    provided SchemaMapping objects.

    Implementations should modify the mappings in place and update their
    recovery status where appropriate.
    """

    @abstractmethod
    def process(
        self,
        mappings: list[SchemaMapping]
    ) -> None:
        """
        Attempt to recover unresolved schema mappings.

        Parameters
        ----------
        mappings:
            The collection of SchemaMapping objects to process.

        canonical_schema:
            The application's Canonical Data Model used as the target
            vocabulary for recovery.

        Returns
        -------
        None

        Notes
        -----
        Implementations should mutate the provided SchemaMapping objects
        rather than returning new ones.
        """
        raise NotImplementedError