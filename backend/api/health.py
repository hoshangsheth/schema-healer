"""
Health check API endpoints.

Provides lightweight endpoints for infrastructure monitoring and deployment
platform health checks. These endpoints verify that the FastAPI application
is running and able to serve requests without invoking any business logic,
external services, or long-running operations.
"""

# IMPORTS
from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    """
    Return the application's health status.

    This endpoint is intended for deployment platforms, uptime monitors,
    load balancers, and operational health checks. It performs no dependency
    validation and simply confirms that the application is running.

    Returns:
        dict[str, str]: A simple health status response.
    """
    return {"status": "healthy"}