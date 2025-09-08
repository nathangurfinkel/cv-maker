"""
CV-related API routes.
"""
import json
import os
from fastapi import APIRouter, HTTPException, UploadFile, File
from ..models.request_models import CVRequest, ExtractCVRequest, RephraseRequest
from ..services.ai_service import AIService
from ..services.vectorstore_service import VectorstoreService
from ..services.evaluation_service import EvaluationService
from ..services.data_transformation_service import DataTransformationService
from ..utils.file_processing import extract_text_from_pdf, extract_text_from_docx
from ..utils.security import validate_uploaded_file, validate_job_description, validate_cv_text
from ..utils.debug import print_step

router = APIRouter(prefix="/cv", tags=["CV"])

# Initialize services
ai_service = AIService()
vectorstore_service = VectorstoreService()
evaluation_service = EvaluationService(ai_service)
data_transformation_service = DataTransformationService()

@router.post("/tailor")
async def tailor_cv(request: CVRequest):
    """
    Tailor a CV based on job description and user CV text.
    """
    # Validate and sanitize inputs
    validated_job_description = validate_job_description(request.job_description)
    validated_cv_text = validate_cv_text(request.user_cv_text)
    
    print_step("CV Tailoring Request", {
        "job_description_length": len(validated_job_description),
        "user_cv_text_length": len(validated_cv_text)
    }, "input")

    # Create documents from CV text
    docs = vectorstore_service.create_documents(validated_cv_text)
    
    # Clear existing documents and add new ones
    vectorstore_service.clear_vectorstore()
    vectorstore_service.add_documents(docs)

    # Retrieve relevant documents
    retrieved_docs = vectorstore_service.retrieve_documents(validated_job_description)
    retrieved_context = "\n\n".join([doc.page_content for doc in retrieved_docs])
    
    print_step("Document Retrieval", {
        "retrieved_docs_count": len(retrieved_docs),
        "retrieved_context_length": len(retrieved_context),
        "retrieved_context_preview": retrieved_context[:200] + "..." if len(retrieved_context) > 200 else retrieved_context
    }, "output")
    
    try:
        # Generate structured CV data using AI
        raw_ai_data = await ai_service.extract_structured_cv_data(request.user_cv_text, request.job_description)
        
        # Transform raw AI data to structured CVData model with enhanced dates
        cv_data = data_transformation_service.transform_ai_data_to_cv_data(raw_ai_data)
        
        # Convert back to dictionary for API response
        structured_content = data_transformation_service.cv_data_to_dict(cv_data)
        
        # Debug: Show the actual generated content
        print_step("Generated CV Content Preview", {
            "name": structured_content.get("personal", {}).get("name", "NOT_FOUND"),
            "contact_email": structured_content.get("personal", {}).get("email", "NOT_FOUND"),
            "summary_length": len(structured_content.get("professional_summary", "")),
            "experience_count": len(structured_content.get("experience", [])),
            "education_count": len(structured_content.get("education", [])),
            "skills_technical_count": len(structured_content.get("skills", {}).get("technical", [])) if structured_content.get("skills") else 0,
            "has_enhanced_dates": any(
                exp.get("startDateValue") or exp.get("endDateValue") 
                for exp in structured_content.get("experience", [])
            )
        }, "output")

        # Perform evaluation
        evaluation_results = await evaluation_service.evaluate_cv_complete(
            request.job_description,
            json.dumps(structured_content),
            retrieved_docs
        )
        
        # Add evaluation to structured content
        structured_content['analysis'] = evaluation_results
        
        print_step("CV Tailoring Complete", {
            "final_content_keys": list(structured_content.keys()),
            "analysis_present": 'analysis' in structured_content
        }, "output")
        
        return structured_content

    except Exception as e:
        print_step("CV Tailoring Error", str(e), "error")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tailor-from-file")
async def tailor_cv_from_file(job_description: str, cv_file: UploadFile = File(...)):
    """
    Tailor a CV from uploaded file.
    """
    # Validate job description
    validated_job_description = validate_job_description(job_description)
    
    # Read file content
    file_content = await cv_file.read()
    
    # Validate uploaded file
    from ..core.config import settings
    validation_result = validate_uploaded_file(
        file_content=file_content,
        filename=cv_file.filename or "unknown",
        allowed_types=settings.ALLOWED_FILE_TYPES,
        max_size=settings.MAX_FILE_SIZE
    )
    
    print_step("File Upload Request", {
        "filename": validation_result["sanitized_filename"],
        "content_type": validation_result["mime_type"],
        "file_size": validation_result["file_size"],
        "job_description_length": len(validated_job_description)
    }, "input")
    
    print_step("File Type Detection", {"filename": cv_file.filename}, "input")
    if cv_file.filename.endswith(".pdf"):
        user_cv_text = extract_text_from_pdf(file_content)
    elif cv_file.filename.endswith(".docx"):
        user_cv_text = extract_text_from_docx(file_content)
    else:
        print_step("File Type Detection", "Unsupported file type", "error")
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    
    print_step("CV Request Creation", {
        "job_description_length": len(job_description),
        "extracted_text_length": len(user_cv_text)
    }, "input")
    
    rag_request = CVRequest(job_description=job_description, user_cv_text=user_cv_text)
    print_step("CV Request Creation", "Request object created, calling tailor_cv", "output")
    
    return await tailor_cv(rag_request)

@router.post("/extract-cv-data")
async def extract_cv_data(request: ExtractCVRequest):
    """
    Extract structured CV data from text using AI.
    """
    print_step("CV Data Extraction Request", {
        "cv_text_length": len(request.cv_text),
        "job_description_length": len(request.job_description)
    }, "input")

    try:
        # Create documents from CV text
        docs = vectorstore_service.create_documents(request.cv_text)
        
        # Clear existing documents and add new ones
        vectorstore_service.clear_vectorstore()
        vectorstore_service.add_documents(docs)

        # Retrieve relevant documents
        retrieved_docs = vectorstore_service.retrieve_documents(request.job_description)
        retrieved_context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        print_step("Document Retrieval", {
            "retrieved_docs_count": len(retrieved_docs),
            "retrieved_context_length": len(retrieved_context)
        }, "output")
        
        # Generate structured CV data using AI
        raw_ai_data = await ai_service.extract_structured_cv_data(request.cv_text, request.job_description)
        
        # Transform raw AI data to structured CVData model with enhanced dates
        cv_data = data_transformation_service.transform_ai_data_to_cv_data(raw_ai_data)
        
        # Convert back to dictionary for API response
        structured_content = data_transformation_service.cv_data_to_dict(cv_data)
        
        print_step("CV Data Extraction Complete", {
            "extracted_keys": list(structured_content.keys()),
            "name": structured_content.get("personal", {}).get("name", "NOT_FOUND"),
            "experience_count": len(structured_content.get("experience", [])),
            "education_count": len(structured_content.get("education", [])),
            "has_enhanced_dates": any(
                exp.get("startDateValue") or exp.get("endDateValue") 
                for exp in structured_content.get("experience", [])
            )
        }, "output")
        
        return structured_content

    except Exception as e:
        print_step("CV Data Extraction Error", str(e), "error")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rephrase-section")
async def rephrase_cv_section(request: RephraseRequest):
    """
    Rephrase a specific CV section to better fit the target job.
    """
    print_step("CV Section Rephrase Request", {
        "section_type": request.section_type,
        "section_content_length": len(request.section_content),
        "job_description_length": len(request.job_description)
    }, "input")

    try:
        # Use AI service to rephrase the section
        rephrased_content = await ai_service.rephrase_cv_section(
            request.section_content,
            request.section_type,
            request.job_description
        )
        
        print_step("CV Section Rephrase Complete", {
            "original_length": len(request.section_content),
            "rephrased_length": len(rephrased_content),
            "section_type": request.section_type
        }, "output")
        
        return {
            "original_content": request.section_content,
            "rephrased_content": rephrased_content,
            "section_type": request.section_type
        }

    except Exception as e:
        print_step("CV Section Rephrase Error", str(e), "error")
        raise HTTPException(status_code=500, detail=str(e))
