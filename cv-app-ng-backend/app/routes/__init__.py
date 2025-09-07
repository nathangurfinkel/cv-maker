"""
API routes for the CV Builder application.
"""
from .cv_routes import router as cv_router
from .pdf_routes import router as pdf_router
from .evaluation_routes import router as evaluation_router
from .utility_routes import router as utility_router

__all__ = [
    "cv_router",
    "pdf_router", 
    "evaluation_router",
    "utility_router"
]
