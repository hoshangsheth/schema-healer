"""
Utilities for normalizing uploaded schema headers.

Normalization produces a consistent representation of uploaded headers
so that all recovery strategies operate on the same input format.
"""


def normalize_header(header: str) -> str:
    """
    Normalize an uploaded header into a canonical comparison format.

    Parameters
    ----------
    header:
        Raw header extracted from the uploaded dataset.

    Returns
    -------
    str
        Normalized header suitable for recovery matching.
    """

    return (
        header.strip()
        .lower()
        .replace(" ", "_")
    )