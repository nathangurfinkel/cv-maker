"""
AWS Lambda handler for CV Maker API using FastAPI and Mangum
"""
import os
import sys
from pathlib import Path

# Add the backend app to the Python path
backend_path = Path(__file__).parent.parent.parent.parent.parent / "cv-app-ng-backend"
sys.path.insert(0, str(backend_path))

from mangum import Mangum
from app.main import app

# Set environment variables for AWS Lambda
os.environ.setdefault("ENVIRONMENT", "production")
os.environ.setdefault("DEBUG", "false")
os.environ.setdefault("VERBOSE", "false")

# Create the ASGI handler
handler = Mangum(app, lifespan="off")
