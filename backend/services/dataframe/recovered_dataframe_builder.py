"""
Builds the recovered dataset produced by the schema recovery pipeline.

The Recovered DataFrame Builder is responsible for constructing a pandas
DataFrame from the uploaded CSV data and applying the resolved schema
mappings produced by the Recovery Engine.

It owns DataFrame construction only.

Schema verification, canonical formatting, reporting, and CSV export
belong to their respective services.
"""

# IMPORTS
import pandas as pd

from backend.models.schema_mapping_models import (
    MappingStatus,
    SchemaMapping,
)


# RECOVERED DATAFRAME BUILDER
class RecoveredDataFrameBuilder:
    """
    Builds the recovered dataset from uploaded CSV data.

    This service constructs a pandas DataFrame using the uploaded CSV
    headers and data rows, then applies the resolved schema mappings
    produced by the Recovery Engine.

    It owns DataFrame construction only.
    """

    # BUILD RECOVERED DATAFRAME
    def build(
        self,
        header_row: list[str],
        data_rows: list[list[str]],
        mappings: list[SchemaMapping],
    ) -> pd.DataFrame:
        """
        Construct the recovered DataFrame by applying the resolved
        schema mappings to the uploaded dataset.

        Parameters
        ----------
        header_row:
            Original headers extracted from the uploaded CSV.

        data_rows:
            Data rows extracted from the uploaded CSV.

        mappings:
            Recovery results produced by the Recovery Engine.

        Returns
        -------
        pd.DataFrame
            Recovered dataset with resolved canonical headers.
        """

        # Construct DataFrame
        recovered_dataframe = pd.DataFrame(
            data_rows,
            columns=header_row,
        )

        # Build rename mapping
        column_mapping = self._build_rename_mapping(
            mappings
        )

        # Apply recovered schema
        recovered_dataframe = recovered_dataframe.rename(
            columns=column_mapping
        )

        return recovered_dataframe

    # BUILD RENAME MAPPING
    def _build_rename_mapping(
        self,
        mappings: list[SchemaMapping],
    ) -> dict[str, str]:
        """
        Build a column rename mapping from the resolved schema mappings.

        Parameters
        ----------
        mappings:
            Recovery results produced by the Recovery Engine.

        Returns
        -------
        dict[str, str]
            Dictionary mapping uploaded headers to their recovered
            canonical field names.
        """

        return {
            mapping.source_header: mapping.canonical_field
            for mapping in mappings
            if (
                mapping.status is MappingStatus.RESOLVED
                and mapping.canonical_field is not None
            )
        }