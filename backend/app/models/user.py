from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Credits and subscription
    credits = Column(Integer, default=100)  # Default free credits
    plan_id = Column(String, ForeignKey("plans.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    plan = relationship("Plan", back_populates="users")
    credit_transactions = relationship("CreditTransaction", back_populates="user")
    generations = relationship("Generation", back_populates="user")
    
    def __repr__(self):
        return f"<User {self.email}>"
    
    @property
    def plan_name(self):
        return self.plan.name if self.plan else "Free"