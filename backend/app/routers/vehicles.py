from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.vehicle import Vehicle
from app.models.order import Order
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from pydantic import BaseModel
from typing import Optional
from app.dependencies import require_staff

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_staff)])
async def create_vehicle(vehicle: VehicleCreate, db: AsyncSession = Depends(get_db)):
    db_vehicle = Vehicle(**vehicle.model_dump())
    db.add(db_vehicle)
    await db.commit()
    await db.refresh(db_vehicle)
    return db_vehicle


@router.get("/", response_model=list[VehicleResponse])
async def get_vehicles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle))
    return result.scalars().all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(vehicle_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    db_vehicle = result.scalar_one_or_none()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

class VehicleUpdate(BaseModel):
    plate_number: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    vehicle_type: Optional[str] = None
    capacity_kg: Optional[int] = None
    status: Optional[str] = None


@router.patch("/{vehicle_id}", response_model=VehicleResponse,
              dependencies=[Depends(require_staff)])
async def update_vehicle(vehicle_id: int, data: VehicleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    db_vehicle = result.scalar_one_or_none()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_vehicle, key, value)

    await db.commit()
    await db.refresh(db_vehicle)
    return db_vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_staff)])
async def delete_vehicle(vehicle_id: int, db: AsyncSession = Depends(get_db)):
    # 1. Проверяем, есть ли у машины заказы
    result = await db.execute(select(func.count(Order.id)).where(Order.vehicle_id == vehicle_id))
    orders_count = result.scalar()

    if orders_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Нельзя удалить машину, у неё есть {orders_count} заказ(ов)"
        )

    # 2. Ищем машину
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    db_vehicle = result.scalar_one_or_none()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # 3. Удаляем
    await db.delete(db_vehicle)
    await db.commit()
    return None