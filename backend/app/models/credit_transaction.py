from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum


class TransactionType(str, enum.Enum):
    CREDIT_PURCHASE = "credit_purchase"
    CREDIT_REFUND = "credit_refund"
    GENERATION_USAGE = "generation_usage"
    COUPON_REDEMPTION = "coupon_redemption"
    MONTHLY_RESET = "monthly_reset"
    ADMIN_ADJUSTMENT = "admin_adjustment"


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Transaction details
    amount = Column(Integer, nullable=False)  # Positive for credits added, negative for credits used
    transaction_type = Column(Enum(TransactionType), nullable=False)
    description = Column(String, nullable=True)
    
    # Related entities
    generation_id = Column(String, ForeignKey("generations.id"), nullable=True)
    coupon_id = Column(String, ForeignKey("coupons.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="credit_transactions")
    generation = relationship("Generation", back_populates="credit_transaction")
    coupon = relationship("Coupon", back_populates="credit_transactions")
    
    def __repr__(self):
        return f"<CreditTransaction {self.user_id}: {self.amount} credits ({self.transaction_type})>"