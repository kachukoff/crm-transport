from pydantic import BaseModel
from typing import Optional

class PricingRuleBase(BaseModel):
  vehicle_type: str
  base_rate: float
  price_per_km: float
  price_per_kg: float

class PricingRuleCreate(PricingRuleBase):
  pass

class PricingRuleResponse(PricingRuleBase):
  id: int

  class Config:
    from_attributes = True