from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DriverBase(BaseModel):
  full_name: str
  phone: Optional[str] = None
  license_number: Optional[str] = None
  status: str = "available"
  user_id: Optional[int] = None

class DriverCreate(DriverBase):
  pass

class DriverResponse(DriverBase):
  id: int
  created_at: datetime
  vehicle_plate: Optional[str] = None

  class Config:
    from_attributes = True