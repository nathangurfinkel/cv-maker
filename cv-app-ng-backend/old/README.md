# Old Files Archive

This directory contains files that were part of the original implementation before the SOLID refactoring.

## Files in this directory:

- **`main_old_do_not_use.py`** - The original monolithic main.py file (781 lines) that contained all the application logic before refactoring
- **`test_weasyprint.py`** - Temporary test file used to verify WeasyPrint functionality during development
- **`test_output.pdf`** - Sample PDF output generated during testing

## ⚠️ Important Notes:

- **DO NOT USE** these files for development
- These files are kept for reference only
- The refactored application is now in the `app/` directory
- Use `python main.py` or `uvicorn app.main:app` to run the refactored application

## Migration:

The functionality from these old files has been properly refactored into:
- `app/main.py` - Main application entry point
- `app/services/` - Business logic services
- `app/routes/` - API endpoints
- `app/models/` - Data models
- `app/core/` - Configuration
- `app/utils/` - Utility functions

See `../REFACTORING_SUMMARY.md` for complete details about the refactoring.
