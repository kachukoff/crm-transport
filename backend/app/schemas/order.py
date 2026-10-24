from pydantic import BaseModel
from datetime import datetime
from typing import Optional


#Вложенные схемы для отображения имен вместо ID
class ClientShort(BaseModel):
  name: str
  class Config:
    from_attributes = True

class DriverShort(BaseModel):
  full_name: str
  class Config:
    from_attributes = True

class VehicleShort(BaseModel):
  plate_number: str
  class Config:
    from_attributes = True

class RouteShort(BaseModel):
  from_address: str
  to_address: str
  class Config:
    from_attributes = True

# Базовая схема
class OrderBase(BaseModel):
  client_id: int
  route_id: int
  driver_id: Optional[int] = None
  vehicle_id: Optional[int] = None
  cargo_name: Optional[str] = None
  weight_kg: Optional[int] = None
  price: Optional[float] = None
  source: str = "manager_manual"

class OrderCreate(OrderBase):
  pass

# Схема для смены статуса
class OrderStatusUpdate(BaseModel):
  status: str
  comment: Optional[str] = None

# Схема ответа
class OrderResponse(OrderBase):
  id: int
  status: str
  created_at: datetime
  updated_at: datetime

  client: Optional[ClientShort] = None
  route: Optional[RouteShort] = None
  driver: Optional[DriverShort] = None
  vehicle: Optional[VehicleShort] = None

  class Config:
    from_attributes = True