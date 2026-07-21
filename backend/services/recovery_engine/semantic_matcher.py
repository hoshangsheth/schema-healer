"""
Semantic recovery strategry.

Owns the business workflow for LLM-powered schema recovery.
Receives unresolved columns, build prompts, validates LLM mappings,
and returns a RecoveryMatchResult.
"""