from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VehicleBase(BaseModel):
  plate_number: str
  brand: Optional[str] = None
  model: Optional[str] = None
  vehicle_type: Optional[str] = None
  capacity_kg: Optional[int] = None
  status: str = "available"

class VehicleCreate(VehicleBase):
  pass

class VehicleResponse(VehicleBase):
  id: int
  created_at: datetime

  class Config:
    from_attributes = True