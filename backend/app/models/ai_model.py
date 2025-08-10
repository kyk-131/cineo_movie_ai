from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum


class ModelProvider(str, enum.Enum):
    REPLICATE = "replicate"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"


class ModelType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"


class AIModel(Base):
    __tablename__ = "ai_models"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)  # e.g., "Cineo Vision Pro"
    display_name = Column(String, nullable=False)  # User-friendly name
    description = Column(Text, nullable=True)
    
    # Model configuration
    provider = Column(Enum(ModelProvider), nullable=False)
    model_type = Column(Enum(ModelType), nullable=False)
    
    # Provider-specific configuration
    external_model_id = Column(String, nullable=True)  # ID used by external service
    model_config = Column(JSON, default=dict)  # Provider-specific parameters
    
    # Cost and availability
    credits_per_generation = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Display
    preview_url = Column(String, nullable=True)  # Sample image URL
    category = Column(String, nullable=True)  # e.g., "realistic", "artistic", "anime"
    
    # Performance metrics
    avg_generation_time = Column(Integer, nullable=True)  # Average time in seconds
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    generations = relationship("Generation", back_populates="ai_model")
    
    def __repr__(self):
        return f"<AIModel {self.name} ({self.provider})>"