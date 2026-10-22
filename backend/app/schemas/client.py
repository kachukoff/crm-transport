from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ClientBase(BaseModel):
  type: str = "legal"
  name: str
  inn: Optional[str] = None
  contact_person: Optional[str] = None
  phone: Optional[str] = None
  email: Optional[str] = None
  address: Optional[str] = None

class ClientCreate(ClientBase):
  pass

class ClientResponse(ClientBase):
  id: int
  created_at: datetime

  class Config:
    from_attributes = True