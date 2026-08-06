"""
Recovered CSV exporter.

This module exports the recovered dataset produced by the schema
processing pipeline as CSV.

The exporter converts the recovered DataFrame into CSV bytes that can
be returned by the API or reused by other application components.

Responsibilities:
- Export the recovered dataset as CSV.
- Preserve recovered column names.
- Preserve recovered column order.
- Preserve all recovered data values.

This module intentionally does not:
- Perform schema recovery.
- Modify the recovered dataset.
- Write files to disk.
- Return HTTP responses.
"""

# IMPORTS
from io import StringIO
import pandas as pd

# RECOVERED CSV EXPORTER
class RecoveredCsvExporter:
    """
    Exports the recovered dataset as CSV.
    """

    def export(
        self,
        recovered_dataframe: pd.DataFrame
    ) -> bytes:
        """
        Export the recovered dataset as CSV bytes.

        Parameters:

        recovered_dataframe:
            The recovered dataset produced by the recovery pipeline.

        Returns:

        bytes:
            UTF-8 encoded CSV representation of the recovered dataset.
        """

        # Create an in-memory text buffer.
        csv_buffer = StringIO()

        # Export the recovered dataset without dataframe index.
        recovered_dataframe.to_csv(
            csv_buffer,
            index=False
        )

        # Return the UTF-8 encoded csv bytes.
        return csv_buffer.getvalue().encode("utf-8")
