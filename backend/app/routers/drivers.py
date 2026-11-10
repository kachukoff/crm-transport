from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.driver import Driver
from app.models.order import Order
from app.models.vehicle import Vehicle
from app.schemas.driver import DriverCreate, DriverResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.post("/", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
async def create_driver(driver: DriverCreate, db: AsyncSession = Depends(get_db)):
    db_driver = Driver(**driver.model_dump())
    db.add(db_driver)
    await db.commit()
    await db.refresh(db_driver)
    return db_driver


@router.get("/", response_model=list[DriverResponse])
async def get_drivers(db: AsyncSession = Depends(get_db)):
    # Делаем запрос с JOIN, чтобы подтянуть машины из активных заказов
    query = (
        select(Driver, Vehicle.plate_number)
        .outerjoin(
            Order,
            (Order.driver_id == Driver.id) &
            (Order.status.in_(['assigned', 'in_progress'])) &
            # Ищем машину только для водителей, которые на смене!
            (Driver.status.in_(['available', 'on_route']))
        )
        .outerjoin(Vehicle, Order.vehicle_id == Vehicle.id)
    )

    result = await db.execute(query)

    drivers_with_vehicles = []
    for driver, vehicle_plate in result.all():
        driver_data = DriverResponse.model_validate(driver)

        # Если водитель уволен или выходной, принудительно ставим None
        if driver.status in ['day_off', 'fired']:
            driver_data.vehicle_plate = None
        else:
            driver_data.vehicle_plate = vehicle_plate

        drivers_with_vehicles.append(driver_data)

    return drivers_with_vehicles


@router.get("/{driver_id}", response_model=DriverResponse)  # <--- Добавлен @
async def get_driver(driver_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    db_driver = result.scalar_one_or_none()
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    return db_driver


class DriverUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    license_number: Optional[str] = None
    status: Optional[str] = None


@router.patch("/{driver_id}", response_model=DriverResponse)
async def update_driver(driver_id: int, data: DriverUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    db_driver = result.scalar_one_or_none()
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_driver, key, value)

    await db.commit()
    await db.refresh(db_driver)
    return db_driver


@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_driver(driver_id: int, db: AsyncSession = Depends(get_db)):
    # 1. Проверяем, есть ли у водителя заказы
    result = await db.execute(select(func.count(Order.id)).where(Order.driver_id == driver_id))
    orders_count = result.scalar()

    if orders_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Нельзя удалить водителя, у него есть {orders_count} заказ(ов)"
        )

    # 2. Ищем водителя
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    db_driver = result.scalar_one_or_none()
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")

    # 3. Удаляем
    await db.delete(db_driver)
    await db.commit()
    return None
