from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RouteBase(BaseModel):
    from_address: str
    to_address: str
    distance_km: Optional[float] = None

class RouteCreate(RouteBase):
    pass

class RouteResponse(RouteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True