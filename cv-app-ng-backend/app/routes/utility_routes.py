"""
Utility API routes for audio transcription and image analysis.
"""
import os
from fastapi import APIRouter, HTTPException, UploadFile, File
from ..models.request_models import ImageRequest
from ..services.ai_service import AIService
from ..utils.debug import print_step

router = APIRouter(prefix="/utility", tags=["Utility"])

# Initialize AI service
ai_service = AIService()

@router.post("/transcribe-audio")
async def transcribe_audio(audio_file: UploadFile = File(...)):
    """
    Transcribe audio file to text.
    """
    print_step("Audio Transcription Request", {
        "filename": audio_file.filename,
        "content_type": audio_file.content_type
    }, "input")
    
    file_location = f"/tmp/{audio_file.filename}"
    try:
        print_step("Audio File Processing", {"file_location": file_location}, "input")
        with open(file_location, "wb+") as file_object:
            file_object.write(audio_file.file.read())
        print_step("Audio File Processing", "File written to temporary location", "output")
        
        # Transcribe audio
        transcription = await ai_service.transcribe_audio(file_location)
        
        return {"transcription": transcription}
    finally:
        if os.path.exists(file_location):
            print_step("Cleanup", "Removing temporary audio file", "info")
            os.remove(file_location)

@router.post("/analyze-jd-image")
async def analyze_jd_image(request: ImageRequest):
    """
    Analyze job description image and extract text.
    """
    print_step("Image Analysis Request", {
        "image_base64_length": len(request.image_base_64)
    }, "input")
    
    try:
        # Analyze image
        extracted_text = await ai_service.analyze_image(request.image_base_64)
        
        return {"extracted_job_description": extracted_text}
    except Exception as e:
        print_step("Image Analysis Error", str(e), "error")
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {e}")
