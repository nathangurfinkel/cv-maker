"""
Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routes import cv_router, pdf_router, evaluation_router, utility_router
from .utils.debug import print_step

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application
    """
    # Create FastAPI app
    app = FastAPI(
        title=settings.API_TITLE,
        version=settings.API_VERSION,
        debug=settings.DEBUG
    )
    
    # Add CORS middleware
    print_step("CORS Configuration", {"origins": settings.CORS_ORIGINS}, "input")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print_step("FastAPI App Initialization", "FastAPI app and CORS middleware configured", "output")
    
    # Include routers
    app.include_router(cv_router)
    app.include_router(pdf_router)
    app.include_router(evaluation_router)
    app.include_router(utility_router)
    
    # Root endpoint
    @app.get("/")
    def read_root():
        return {"status": "CV Generator API is online"}
    
    return app

# Create the app instance
app = create_app()

# Application startup message
print_step("Application Startup", "CV Generator API is ready to serve requests!", "output")
print("\n" + "="*80)
print("🚀 CV GENERATOR API STARTED SUCCESSFULLY")
print("="*80)
print("📋 Available Endpoints:")
print("   • GET  /                    - Health check")
print("   • POST /cv/tailor           - Tailor CV from text")
print("   • POST /cv/tailor-from-file - Tailor CV from uploaded file")
print("   • POST /evaluation/cv       - Perform committee evaluation on a generated CV")
print("   • POST /pdf/generate        - Generate PDF from CV data using templates")
print("   • GET  /pdf/templates       - Get available PDF templates")
print("   • POST /utility/transcribe-audio - Transcribe audio to text")
print("   • POST /utility/analyze-jd-image - Extract job description from image")
print("="*80)
print("🔧 Debug Mode: ENABLED - Detailed logging will be shown for each request")
print("="*80 + "\n")
