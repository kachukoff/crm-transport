from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Базовые поля, которые приходят при создании заказа
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

  class Config:
    from_attributes = True