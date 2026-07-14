# Import FastAPI:
from fastapi import FastAPI

# Import API Routers:
from backend.api.schema_validation import router as schema_validation_router

# Create FastAPI Application:
app = FastAPI(
    title="SchemaHealer API",
    description="AI-powered schema validation and healing service.",
    version="1.0.0"
)

# Register API Routers:
app.include_router(
    schema_validation_router
)