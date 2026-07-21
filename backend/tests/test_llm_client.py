# Import modules
from backend.infrastructure.llm.models import (
    LLMRequest,
    LLMResponse
)

from backend.infrastructure.llm.client import generate_json_response

# Initialize a request to send to the client
request = LLMRequest(
    system_prompt=(
        "You are a JSON API. "
        "Always return valid JSON."
    ),
    user_prompt=(
        "Return a JSON object with "
        "name='SchemaHealer' "
        "and version=1."
    ),
    prompt_version="v1"
)

# Translate response from client to domain level
response = generate_json_response(request=request)

# Print the O/P
print("Structured Output:", response.structured_output)
print("Model:", response.model_name)
print("Latency:", response.latency_ms)
print("Input Tokens:", response.input_tokens)
print("Output Tokens:", response.output_tokens)
print("Finish Reason:", response.finish_reason)