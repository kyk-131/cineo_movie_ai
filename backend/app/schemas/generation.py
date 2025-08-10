from pydantic import BaseModel, validator
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class GenerationType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"


class GenerationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class GenerationRequest(BaseModel):
    prompt: str
    model_id: str
    resolution: Optional[str] = "1024x1024"
    aspect_ratio: Optional[str] = "1:1"
    seed: Optional[int] = None
    steps: Optional[int] = None
    guidance_scale: Optional[float] = None
    reference_image_url: Optional[str] = None
    num_frames: Optional[int] = None
    fps: Optional[int] = None
    
    @validator('prompt')
    def validate_prompt(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Prompt cannot be empty")
        if len(v) > 2000:
            raise ValueError("Prompt is too long (max 2000 characters)")
        return v.strip()
    
    @validator('resolution')
    def validate_resolution(cls, v):
        if v:
            valid_resolutions = [
                "512x512", "768x768", "1024x1024", "1024x576", "576x1024",
                "1280x720", "720x1280", "1920x1080", "1080x1920"
            ]
            if v not in valid_resolutions:
                raise ValueError(f"Invalid resolution. Valid options: {', '.join(valid_resolutions)}")
        return v
    
    @validator('steps')
    def validate_steps(cls, v):
        if v is not None and (v < 1 or v > 100):
            raise ValueError("Steps must be between 1 and 100")
        return v
    
    @validator('guidance_scale')
    def validate_guidance_scale(cls, v):
        if v is not None and (v < 1.0 or v > 20.0):
            raise ValueError("Guidance scale must be between 1.0 and 20.0")
        return v


class GenerationResponse(BaseModel):
    id: str
    prompt: str
    model_id: str
    generation_type: GenerationType
    status: GenerationStatus
    result_url: Optional[str] = None
    credits_used: int
    parameters: Dict[str, Any] = {}
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


class GenerationListResponse(BaseModel):
    generations: list[GenerationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class GenerationStatus(BaseModel):
    id: str
    status: GenerationStatus
    progress: Optional[float] = None  # 0.0 to 1.0
    estimated_time_remaining: Optional[int] = None  # seconds
    error_message: Optional[str] = None