from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.generation import Generation, GenerationType, GenerationStatus
from app.models.ai_model import AIModel
from app.models.credit_transaction import CreditTransaction, TransactionType
from app.schemas.generation import (
    GenerationRequest, 
    GenerationResponse, 
    GenerationListResponse
)
from app.services.ai_service import AIService
import logging
import math

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/generate", tags=["generation"])

# Initialize AI service
ai_service = AIService()

# Model credit costs
MODEL_COSTS = {
    # Replicate models (higher cost, premium quality)
    "cineo-vision-pro": 5,
    "cineo-ultrareal": 4,
    "cineo-3dform": 4,
    "cineo-retrovibe": 3,
    "cineo-motion": 25,
    "cineo-quicktake": 20,
    
    # HuggingFace models (moderate cost)
    "cineo-conceptart": 3,
    "cineo-portraitmaster": 4,
    "cineo-animecraft": 3,
    "cineo-illustrationx": 3,
    "cineo-photofix": 4,
    "cineo-stylefusion": 3,
    "cineo-naturelens": 3,
    "cineo-frameflow": 15,
    
    # Local models (lowest cost)
    "cineo-localvision": 1,
    "cineo-quickdraw": 1,
    "cineo-localvision-motion": 5,
}


async def process_generation_background(
    generation_id: str,
    ai_service: AIService,
    db: Session
):
    """Background task to process generation"""
    try:
        # Get generation from database
        generation = db.query(Generation).filter(Generation.id == generation_id).first()
        if not generation:
            logger.error(f"Generation {generation_id} not found")
            return
        
        # Update status to processing
        generation.status = GenerationStatus.PROCESSING
        db.commit()
        
        # Prepare parameters
        params = generation.parameters.copy()
        
        # Parse resolution to width/height
        if "resolution" in params and params["resolution"]:
            try:
                width, height = map(int, params["resolution"].split("x"))
                params["width"] = width
                params["height"] = height
            except ValueError:
                pass
        
        # Generate based on type
        if generation.generation_type == GenerationType.IMAGE:
            result = await ai_service.generate_image(
                generation.model_id,
                generation.prompt,
                **params
            )
        else:  # VIDEO
            result = await ai_service.generate_video(
                generation.model_id,
                generation.prompt,
                **params
            )
        
        # Update generation with result
        if result["success"]:
            generation.status = GenerationStatus.COMPLETED
            generation.result_url = result["result_url"]
            generation.external_id = result.get("external_id")
            if "local_path" in result:
                generation.local_path = result["local_path"]
            generation.completed_at = datetime.utcnow()
        else:
            generation.status = GenerationStatus.FAILED
            generation.error_message = result.get("error", "Generation failed")
        
        db.commit()
        logger.info(f"Generation {generation_id} completed with status: {generation.status}")
        
    except Exception as e:
        logger.error(f"Background generation failed for {generation_id}: {e}")
        # Update generation status to failed
        try:
            generation = db.query(Generation).filter(Generation.id == generation_id).first()
            if generation:
                generation.status = GenerationStatus.FAILED
                generation.error_message = str(e)
                db.commit()
        except Exception:
            pass


@router.post("/image", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_image(
    request: GenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate an image using AI models"""
    # Check if model exists and get cost
    credits_required = MODEL_COSTS.get(request.model_id)
    if credits_required is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown model: {request.model_id}"
        )
    
    # Check if user has enough credits
    if current_user.credits < credits_required:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. Required: {credits_required}, Available: {current_user.credits}"
        )
    
    # Deduct credits immediately
    current_user.credits -= credits_required
    
    # Create credit transaction
    credit_transaction = CreditTransaction(
        user_id=current_user.id,
        amount=-credits_required,
        transaction_type=TransactionType.GENERATION_USAGE,
        description=f"Image generation with {request.model_id}"
    )
    db.add(credit_transaction)
    
    # Create generation record
    generation = Generation(
        user_id=current_user.id,
        prompt=request.prompt,
        model_id=request.model_id,
        generation_type=GenerationType.IMAGE,
        status=GenerationStatus.PENDING,
        credits_used=credits_required,
        parameters={
            "resolution": request.resolution,
            "aspect_ratio": request.aspect_ratio,
            "seed": request.seed,
            "steps": request.steps,
            "guidance_scale": request.guidance_scale,
        }
    )
    
    db.add(generation)
    db.commit()
    db.refresh(generation)
    
    # Link credit transaction to generation
    credit_transaction.generation_id = generation.id
    db.commit()
    
    # Start background generation
    background_tasks.add_task(
        process_generation_background,
        generation.id,
        ai_service,
        db
    )
    
    logger.info(f"Image generation started: {generation.id} for user {current_user.email}")
    
    return GenerationResponse.from_orm(generation)


@router.post("/video", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_video(
    request: GenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a video using AI models"""
    # Check if model exists and get cost
    credits_required = MODEL_COSTS.get(request.model_id)
    if credits_required is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown video model: {request.model_id}"
        )
    
    # Check if user has enough credits
    if current_user.credits < credits_required:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. Required: {credits_required}, Available: {current_user.credits}"
        )
    
    # Deduct credits immediately
    current_user.credits -= credits_required
    
    # Create credit transaction
    credit_transaction = CreditTransaction(
        user_id=current_user.id,
        amount=-credits_required,
        transaction_type=TransactionType.GENERATION_USAGE,
        description=f"Video generation with {request.model_id}"
    )
    db.add(credit_transaction)
    
    # Create generation record
    generation = Generation(
        user_id=current_user.id,
        prompt=request.prompt,
        model_id=request.model_id,
        generation_type=GenerationType.VIDEO,
        status=GenerationStatus.PENDING,
        credits_used=credits_required,
        parameters={
            "resolution": request.resolution,
            "num_frames": request.num_frames,
            "fps": request.fps,
            "seed": request.seed,
            "steps": request.steps,
            "guidance_scale": request.guidance_scale,
            "reference_image_url": request.reference_image_url,
        }
    )
    
    db.add(generation)
    db.commit()
    db.refresh(generation)
    
    # Link credit transaction to generation
    credit_transaction.generation_id = generation.id
    db.commit()
    
    # Start background generation
    background_tasks.add_task(
        process_generation_background,
        generation.id,
        ai_service,
        db
    )
    
    logger.info(f"Video generation started: {generation.id} for user {current_user.email}")
    
    return GenerationResponse.from_orm(generation)


@router.get("/status/{generation_id}", response_model=GenerationResponse)
async def get_generation_status(
    generation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get status of a specific generation"""
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == current_user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    return GenerationResponse.from_orm(generation)


@router.get("/history", response_model=GenerationListResponse)
async def get_generation_history(
    page: int = 1,
    page_size: int = 20,
    generation_type: GenerationType = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's generation history"""
    # Limit page size
    page_size = min(page_size, 100)
    offset = (page - 1) * page_size
    
    # Build query
    query = db.query(Generation).filter(Generation.user_id == current_user.id)
    
    if generation_type:
        query = query.filter(Generation.generation_type == generation_type)
    
    # Get total count
    total = query.count()
    
    # Get paginated results
    generations = query.order_by(desc(Generation.created_at)).offset(offset).limit(page_size).all()
    
    total_pages = math.ceil(total / page_size)
    
    return GenerationListResponse(
        generations=[GenerationResponse.from_orm(gen) for gen in generations],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.delete("/{generation_id}")
async def delete_generation(
    generation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a generation (remove from history, not refund credits)"""
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == current_user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    # TODO: In production, also delete the generated files from storage
    
    db.delete(generation)
    db.commit()
    
    return {"message": "Generation deleted successfully"}