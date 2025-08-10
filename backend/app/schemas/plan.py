from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class PlanBase(BaseModel):
    name: str
    description: str
    price_monthly: float
    price_yearly: float
    monthly_credits: int
    features: List[str]


class PlanCreate(PlanBase):
    is_active: bool = True
    is_default: bool = False


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_monthly: Optional[float] = None
    price_yearly: Optional[float] = None
    monthly_credits: Optional[int] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_default: Optional[bool] = None


class PlanResponse(PlanBase):
    id: str
    is_active: bool
    is_default: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True