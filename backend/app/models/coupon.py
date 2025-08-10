from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum


class CouponType(str, enum.Enum):
    CREDIT_BONUS = "credit_bonus"
    UNLIMITED_MONTH = "unlimited_month"
    PERCENTAGE_DISCOUNT = "percentage_discount"


class Coupon(Base):
    __tablename__ = "coupons"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, unique=True, index=True, nullable=False)
    
    # Coupon details
    coupon_type = Column(Enum(CouponType), nullable=False)
    value = Column(Integer, nullable=False)  # Credits to add, or percentage discount
    description = Column(String, nullable=True)
    
    # Usage limits
    max_uses = Column(Integer, default=1)  # Maximum number of times it can be used
    current_uses = Column(Integer, default=0)  # Current number of uses
    
    # Validity
    is_active = Column(Boolean, default=True)
    valid_from = Column(DateTime(timezone=True), nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    credit_transactions = relationship("CreditTransaction", back_populates="coupon")
    
    def __repr__(self):
        return f"<Coupon {self.code}>"
    
    @property
    def is_valid(self):
        """Check if coupon is currently valid"""
        if not self.is_active:
            return False
        
        if self.current_uses >= self.max_uses:
            return False
        
        from datetime import datetime
        now = datetime.utcnow()
        
        if self.valid_from and now < self.valid_from:
            return False
        
        if self.valid_until and now > self.valid_until:
            return False
        
        return True