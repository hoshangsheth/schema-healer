"""
Central configuration module.

Provides application-wide configuration including:
- Environment variables
- Project paths
- LLM configuration
- Schema loading
- Rule mapping loading

Acts a as single source of truth for application configuration
"""


# Delays evaluation of tye hints until runtime.
# Helps avoid circular import issues in larger projects.
from __future__ import annotations

# Standard libraries.
import json
import os
from pathlib import Path

# Third-party packages
from dotenv import load_dotenv


# Load environment variables
load_dotenv()


# Configuration helper functions
# Reads a required environment variable.
def _get_required_env(variable_name: str) -> str:
    value = os.environ.get(variable_name)

    if not value:
        raise ValueError(
            f"Required environment variable '{variable_name}' is not configured."
        )

    return value

# Reads an optional environment variable.
# Returns the supplied default if the variable is missing.
def _get_env(variable_name: str, default: str) -> str:
    return os.environ.get(variable_name, default)


# Project paths
# Root directory of the backend project.
BASE_DIR = Path(__file__).resolve().parent.parent

# Location of the expected schema definition.
SCHEMA_PATH = (
    BASE_DIR/"resources"/"schemas"/"schema.json"
)

# Location of the rule-based mappings.
RULE_MAPPINGS_PATH = (
    BASE_DIR/"resources"/"mappings"/"rule_mappings.json"
)


# LLM configuration
# API key used to authenticate with Gemini.
GEMINI_API_KEY = _get_required_env(
    "GEMINI_API_KEY"
)

# Default LLM model.
LLM_MODEL_NAME = _get_env(
    "LLM_MODEL_NAME",
    "gemini-2.5-flash"
)

# Maximum request timeout (seconds).
try:
    LLM_REQUEST_TIMEOUT = int(
        _get_env(
            "LLM_REQUEST_TIMEOUT",
            "30"
        )
    )
except ValueError as exc:
    raise ValueError(
        "LLM_REQUEST_TIMEOUT must be a valid integer."
    ) from exc

# Maximum retry attempts.
try:
    LLM_MAX_RETRIES = int(
        _get_env(
            "LLM_MAX_RETRIES",
            "3"
        )
    )
except ValueError as exc:
    raise ValueError(
        "LLM_MAX_RETRIES must be a valid integer."
    ) from exc



# Schema configuration
# Loads the expected schema from disk.
def load_expected_schema() -> list[str]:
    with SCHEMA_PATH.open(
        "r",
        encoding="utf-8"
    ) as file:
        data = json.load(file)

    return data["expected_schema"]


# Rule mapping configuration
# Loads the rule-based mappings from disk.
def load_rule_mappings() -> dict:
    with RULE_MAPPINGS_PATH.open(
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file )