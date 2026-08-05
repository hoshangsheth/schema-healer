# Import FastAPI:
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import Configuration:
from backend.core.config import CORS_ALLOWED_ORIGINS

# Import API Routers:
from backend.api.schema_validation import router as schema_validation_router

# Create FastAPI Application:
app = FastAPI(
    title="SchemaHealer API",
    description="AI-powered schema validation and healing service.",
    version="1.0.0"
)

# Browser clients are served from a different origin than the API
# (localhost during development, Vercel in staging), so the allowed
# origins are supplied through configuration rather than hardcoded.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register API Routers:
app.include_router(
    schema_validation_router
)
