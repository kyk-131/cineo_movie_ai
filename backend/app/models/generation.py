from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum


class GenerationType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"


class GenerationStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Generation(Base):
    __tablename__ = "generations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Generation details
    prompt = Column(Text, nullable=False)
    model_id = Column(String, ForeignKey("ai_models.id"), nullable=False)
    generation_type = Column(Enum(GenerationType), nullable=False)
    status = Column(Enum(GenerationStatus), default=GenerationStatus.PENDING)
    
    # Generation parameters
    parameters = Column(JSON, default=dict)  # Store resolution, aspect_ratio, seed, etc.
    
    # Results
    result_url = Column(String, nullable=True)  # URL to generated image/video
    local_path = Column(String, nullable=True)  # Local file path if stored locally
    external_id = Column(String, nullable=True)  # ID from external service (Replicate, etc.)
    
    # Cost tracking
    credits_used = Column(Integer, nullable=False)
    
    # Error handling
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="generations")
    ai_model = relationship("AIModel", back_populates="generations")
    credit_transaction = relationship("CreditTransaction", back_populates="generation", uselist=False)
    
    def __repr__(self):
        return f"<Generation {self.id}: {self.generation_type} by {self.user_id}>"