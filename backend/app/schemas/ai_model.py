from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ModelProvider(str, Enum):
    REPLICATE = "replicate"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"


class ModelType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"


class AIModelBase(BaseModel):
    name: str
    display_name: str
    description: str
    provider: ModelProvider
    model_type: ModelType
    external_model_id: Optional[str] = None
    model_config: Dict[str, Any] = {}
    credits_per_generation: int
    category: Optional[str] = None
    preview_url: Optional[str] = None
    avg_generation_time: Optional[int] = None  # seconds


class AIModelCreate(AIModelBase):
    is_active: bool = True
    is_featured: bool = False


class AIModelUpdate(BaseModel):
    name: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    provider: Optional[ModelProvider] = None
    model_type: Optional[ModelType] = None
    external_model_id: Optional[str] = None
    model_config: Optional[Dict[str, Any]] = None
    credits_per_generation: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    category: Optional[str] = None
    preview_url: Optional[str] = None
    avg_generation_time: Optional[int] = None


class AIModelResponse(AIModelBase):
    id: str
    is_active: bool
    is_featured: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True