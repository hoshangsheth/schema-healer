"""
Infrastructure client responsible for communicating with the configured
LLM provider.

Responsibilities:
- Create and reuse the provider client
- Send requests to the provider
- Parse structured responses
- Retry transient failures
- Translate provider exceptions into application exceptions
"""

# Standard library
import json
import time
import logging
from threading import Lock

# Third-party packages
from google import genai                                             # SDK from google
from google.genai.types import (
    GenerateContentConfig,
    GenerateContentResponse
)

# Project imports                                                       # Configuration
from backend.core.config import (
    GEMINI_API_KEY,
    LLM_MODEL_NAME,
    LLM_MAX_RETRIES,
    LLM_REQUEST_TIMEOUT
)

from backend.exceptions.llm_exceptions import LLMGenerationError        # Custom exception

from backend.infrastructure.llm.models import (                         # Communication layer
    LLMRequest,
    LLMResponse
)


# Module logger
logger = logging.getLogger(__name__)

# Module-level singleton state
_client: genai.Client | None = None
_client_lock = Lock()

# Creates/reuses the SDK client.
def _get_client() -> genai.Client:
    """Returns the shared Gemini client,
        creating it if necessary."""

    # Access module-level singleton instead of creating a local variable
    global _client

    # Fast Path: If client has already been initialized
    # return it immediately without acquiring the lock.
    if _client is not None:
        return _client
    
    # Only one thread can enter this block at a time.
    # This prevents multiple requests from creating duplicate clients.
    with _client_lock:

        # Another thread may have created the client while this thread,
        # was waiting for the lock, check again.
        if _client is None:
            logger.info("Initializing Gemini client.")

            try:
                # Create the shared Gemini client once and reuse it
                # throughout the application's lifetime.
                _client = genai.Client(
                    api_key=GEMINI_API_KEY
                )

            except Exception as exc:
                # Log the complete traceback for debugging.
                logger.exception("Failed to initialize Gemini client.")

                # Raises an application-specific exception while preserving
                # the original exception as the cause.
                raise LLMGenerationError(
                    "Unable to initialize Gemini client."
                ) from exc
            
        # Return the shared client whether it was just created
        # or initialized earlier by another thread.
        return _client
    
# Builds provider configuration
def _build_generation_config(
        system_prompt: str
) -> GenerateContentConfig:
    """ Build the Gemini generation configuration."""

    # Request JSON output so model returns structured data
    # instead of free-form natural language.
    return GenerateContentConfig(
        system_instruction=system_prompt,
        response_mime_type="application/json"
    )

# Coordinates the request lifecycle.
def generate_json_response(
        request: LLMRequest
) -> LLMResponse:
    """ Generate a structured JSON response using the configured LLM Provider """

    # Reuse the shared Gemini client instead of creating one per request.
    client = _get_client()

    # Build the provider configuration for this generation request.
    config = _build_generation_config(
        system_prompt=request.system_prompt
    )

    # Measure the total time taken for the LLM Request
    start_time = time.perf_counter()

    try:
        # Send the generation request to the configured LLM provider
        response = client.models.generate_content(
            model=LLM_MODEL_NAME,
            contents=request.user_prompt,
            config=config
        )

        # Calculate the total time taken by LLM request in milliseconds.
        latency_ms = (time.perf_counter() - start_time) * 1000

    except Exception as exc:
        logger.exception("Failed to generate content from Gemini.")

        raise LLMGenerationError(
            "Failed to generate content from the configured LLM provider."
        ) from exc

    return _build_llm_response(
        response=response,
        prompt_version=request.prompt_version,
        latency_ms=latency_ms
    )

# Translates provider response into the domain model.
def _build_llm_response(
        response: GenerateContentResponse,
        prompt_version: str,
        latency_ms: float
) -> LLMResponse:
    """Translate a Gemini response into the application's LLM response model."""

    try:
        # Convert the provider's JSON response into a native Python object.
        structured_output = json.loads(response.text)

    except json.JSONDecodeError as exc:
        logger.exception(
            "Failed to decode JSON returned by the LLM."
        )

        raise LLMGenerationError(
            "The LLM returned an invalid JSON response."
        ) from exc

    usage = getattr(response, "usage_metadata", None)

    input_tokens = usage.prompt_token_count if usage else 0
    output_tokens = usage.candidates_token_count if usage else 0
    total_tokens = usage.total_token_count if usage else 0

    finish_reason = None
    if response.candidates:
        finish_reason = response.candidates[0].finish_reason.name

    return LLMResponse(
        structured_output=structured_output,
        model_name=response.model_version,
        prompt_version=prompt_version,
        latency_ms=latency_ms,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=total_tokens,
        finish_reason=finish_reason
    )