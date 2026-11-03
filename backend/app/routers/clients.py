from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(client: ClientCreate, db: AsyncSession = Depends(get_db)):
    db_client = Client(**client.model_dump())
    db.add(db_client)
    await db.commit()
    await db.refresh(db_client)
    return db_client


@router.get("/", response_model=list[ClientResponse])
async def get_clients(db: AsyncSession = Depends(get_db)):  # <-- переименовали
    result = await db.execute(select(Client))
    return result.scalars().all()


@router.get("/{client_id}", response_model=ClientResponse)
# <-- переименовали для ясности
async def get_single_client(client_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Client).where(Client.id == client_id))
    db_client = result.scalar_one_or_none()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    inn: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(client_id: int, data: ClientUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Client).where(Client.id == client_id))
    db_client = result.scalar_one_or_none()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")

    # Обновляем только те поля, которые переданы
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_client, key, value)

    await db.commit()
    await db.refresh(db_client)
    return db_client
