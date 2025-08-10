from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from enum import Enum


class CouponType(str, Enum):
    FIXED_AMOUNT = "fixed_amount"
    PERCENTAGE = "percentage"


class CouponBase(BaseModel):
    code: str
    coupon_type: CouponType
    value: float
    description: Optional[str] = None
    max_uses: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None


class CouponCreate(CouponBase):
    is_active: bool = True
    
    @validator('code')
    def validate_code(cls, v):
        v = v.upper().strip()
        if len(v) < 3:
            raise ValueError("Coupon code must be at least 3 characters")
        return v
    
    @validator('value')
    def validate_value(cls, v, values):
        if v <= 0:
            raise ValueError("Coupon value must be positive")
        
        coupon_type = values.get('coupon_type')
        if coupon_type == CouponType.PERCENTAGE and v > 100:
            raise ValueError("Percentage coupon cannot be more than 100%")
        
        return v


class CouponUpdate(BaseModel):
    code: Optional[str] = None
    coupon_type: Optional[CouponType] = None
    value: Optional[float] = None
    description: Optional[str] = None
    max_uses: Optional[int] = None
    current_uses: Optional[int] = None
    is_active: Optional[bool] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None


class CouponResponse(CouponBase):
    id: str
    current_uses: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CouponRedeemRequest(BaseModel):
    code: str
    
    @validator('code')
    def validate_code(cls, v):
        return v.upper().strip()


class CouponRedeemResponse(BaseModel):
    message: str
    credits_added: int
    new_balance: int