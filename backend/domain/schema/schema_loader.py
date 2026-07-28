"""
Utilities for loading SchemaHealer's canonical schema.

This module is responsible for converting an external JSON schema
definition into the application's internal CanonicalSchema domain
model.

The loader intentionally performs only basic structural validation.
Business validation belongs elsewhere in the application.
"""

from __future__ import annotations

import json
from pathlib import Path

from backend.domain.schema.canonical_schema import (
    CanonicalField,
    CanonicalSchema,
)


class CanonicalSchemaLoader:
    """
    Loads canonical schema definitions from JSON files.
    """

    def __init__(self, schema_path: Path) -> None:
        """
        Initialize the loader.

        Parameters
        ----------
        schema_path:
            Path to the canonical schema JSON file.
        """
        self._schema_path = schema_path

    def load(self) -> CanonicalSchema:
        """
        Load a canonical schema from the configured JSON file.

        Returns
        -------
        CanonicalSchema
            Loaded canonical schema.
        """

        with self._schema_path.open(
            mode="r",
            encoding="utf-8",
        ) as file:
            raw_schema = json.load(file)

        expected_schema = self._validate_schema(raw_schema)

        fields = [
            CanonicalField(name=field_name)
            for field_name in expected_schema
        ]

        return CanonicalSchema(fields=fields)

    @staticmethod
    def _validate_schema(raw_schema: object) -> list[str]:
        """
        Validate the basic structure of a canonical schema.

        Parameters
        ----------
        raw_schema:
            Raw JSON object loaded from disk.

        Returns
        -------
        list[str]
            The validated expected schema field names.

        Raises
        ------
        ValueError
            If the schema structure is invalid.
        """

        if not isinstance(raw_schema, dict):
            raise ValueError(
                "Canonical schema must be a JSON object."
            )

        expected_schema = raw_schema.get("expected_schema")

        if not isinstance(expected_schema, list):
            raise ValueError(
                "'expected_schema' must be a JSON array."
            )

        for field in expected_schema:
            if not isinstance(field, str):
                raise ValueError(
                    "Every canonical field must be a string."
                )

        return expected_schema