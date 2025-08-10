from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)  # e.g., "Free", "Pro", "Enterprise"
    description = Column(String, nullable=True)
    
    # Pricing
    price_monthly = Column(Float, default=0.0)  # Monthly price in USD
    price_yearly = Column(Float, default=0.0)   # Yearly price in USD
    
    # Credits
    monthly_credits = Column(Integer, default=100)  # Credits per month
    
    # Features
    features = Column(JSON, default=list)  # List of feature names
    
    # Plan properties
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="plan")
    
    def __repr__(self):
        return f"<Plan {self.name}>"