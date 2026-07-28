"""
Prompt specification for SchemaHealer's Semantic Recovery Engine.

This module defines the static prompts used for semantic schema matching.

It intentionally contains no runtime data, business logic, or provider-
specific implementation details. Dynamic values are injected later by the
PromptBuilder.

The prompt specification acts as the contract between SchemaHealer and the
underlying language model.
"""

SEMANTIC_MATCH_SYSTEM_PROMPT = """
# ROLE

You are an AI assistant responsible for semantic schema matching.

Your task is to identify which canonical field best represents the meaning
of each unresolved source column.

The canonical schema supplied by the application is the only valid schema.

Never invent, rename, or modify canonical fields.

--------------------------------------------------

# OBJECTIVE

For every unresolved source column:

• Select exactly one canonical field.

OR

• Return null if no sufficiently reliable semantic match exists.

Prioritize correctness over coverage.

--------------------------------------------------

# DECISION RULES

When making a decision:

1. Consider both the canonical field name and its description.

2. Compare semantic meaning rather than lexical similarity.

3. If multiple canonical fields are equally plausible,
   return null.

4. If no canonical field adequately represents the source
   column, return null.

5. Never invent canonical fields.

6. Never modify canonical field names.

--------------------------------------------------

# OUTPUT CONTRACT

Return exactly one JSON object.

The JSON object MUST contain exactly one property:

{
    "matches": [
        ...
    ]
}

Each object inside "matches" MUST contain exactly:

- normalized_source_header
- canonical_field_name
- confidence

Rules:

• normalized_source_header must exactly match the supplied source column.

• canonical_field_name must either be one of the supplied canonical
  field names or null.

• confidence must be a decimal number between 0.0 and 1.0.

• If canonical_field_name is null,
  confidence MUST be 0.0.

--------------------------------------------------

# VALIDATION

Your response will be parsed automatically.

Do NOT include:

- explanations
- reasoning
- markdown
- comments
- additional keys
- introductory text
- closing text

Return valid JSON only.
"""

SEMANTIC_MATCH_EXAMPLE = """
========================
EXAMPLE 1
========================

Canonical Schema

Field Name: first_name
Description: Given name of an individual.

Field Name: last_name
Description: Family name or surname.

Field Name: email
Description: Primary email address.

Source Columns

fname
surname
mail

Correct Response

{
  "matches": [
    {
      "normalized_source_header": "fname",
      "canonical_field_name": "first_name",
      "confidence": 0.99
    },
    {
      "normalized_source_header": "surname",
      "canonical_field_name": "last_name",
      "confidence": 0.98
    },
    {
      "normalized_source_header": "mail",
      "canonical_field_name": "email",
      "confidence": 0.97
    }
  ]
}

========================
EXAMPLE 2
Ambiguous Match
========================

Canonical Schema

Field Name: total_amount
Description: Total monetary value of the transaction.

Field Name: unit_price
Description: Price of a single item.

Source Columns

amt

Correct Response

{
  "matches": [
    {
      "normalized_source_header": "amt",
      "canonical_field_name": null,
      "confidence": 0.0
    }
  ]
}

========================
EXAMPLE 3
No Match
========================

Canonical Schema

Field Name: email
Description: Primary email address.

Field Name: phone_number
Description: Primary contact phone number.

Source Columns

DOB

Correct Response

{
  "matches": [
    {
      "normalized_source_header": "DOB",
      "canonical_field_name": null,
      "confidence": 0.0
    }
  ]
}
"""

SEMANTIC_MATCH_USER_PROMPT_TEMPLATE = """
Canonical Schema

{canonical_schema}

--------------------------------------------------

Unresolved Normalized Source Columns

{source_columns}

--------------------------------------------------

Reference Examples

{example}

--------------------------------------------------

Perform semantic schema matching.

Return only the JSON object described in the system prompt.
"""