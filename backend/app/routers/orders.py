from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.order import Order, OrderStatusHistory
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    db_order = Order(**order.model_dump())
    db.add(db_order)
    await db.commit()

    # Перезапрашиваем заказ с вложенными данными
    query = (
        select(Order)
        .options(
            selectinload(Order.client),
            selectinload(Order.route),
            selectinload(Order.driver),
            selectinload(Order.vehicle)
        )
        .where(Order.id == db_order.id)
    )
    result = await db.execute(query)
    db_order = result.scalar_one()

    return db_order


@router.get("/", response_model=list[OrderResponse])
async def get_orders(db: AsyncSession = Depends(get_db)):
    query = (
        select(Order)
        .options(
            selectinload(Order.client),
            selectinload(Order.route),
            selectinload(Order.driver),
            selectinload(Order.vehicle)
        )
        .order_by(Order.id)
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{order_id}", response_model=OrderResponse)
async def get_single_order(order_id: int, db: AsyncSession = Depends(get_db)):
    query = (
        select(Order)
        .options(
            selectinload(Order.client),
            selectinload(Order.route),
            selectinload(Order.driver),
            selectinload(Order.vehicle)
        )
        .where(Order.id == order_id)
    )
    result = await db.execute(query)
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: int, data: OrderStatusUpdate, db: AsyncSession = Depends(get_db)):
    # 1. Ищем заказ
    result = await db.execute(select(Order).where(Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Меняем статус
    db_order.status = data.status

    # 3. Записываем в историю
    history = OrderStatusHistory(
        order_id=order_id, 
        status=data.status, 
        comment=data.comment
    )
    db.add(history)

    # 4. Автоматика (бизнес-логика)
    if data.status == "assigned" and db_order.driver_id:
        driver_result = await db.execute(select(Driver).where(Driver.id == db_order.driver_id))
        driver = driver_result.scalar_one_or_none()
        if driver: driver.status = "on_route"
        
        if db_order.vehicle_id:
            vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == db_order.vehicle_id))
            vehicle = vehicle_result.scalar_one_or_none()
            if vehicle: vehicle.status = "on_route"

    elif data.status in ["delivered", "cancelled"]:
        if db_order.driver_id:
            driver_result = await db.execute(select(Driver).where(Driver.id == db_order.driver_id))
            driver = driver_result.scalar_one_or_none()
            if driver: driver.status = "available"
            
        if db_order.vehicle_id:
            vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == db_order.vehicle_id))
            vehicle = vehicle_result.scalar_one_or_none()
            if vehicle: vehicle.status = "available"

    await db.commit()
    query = (
        select(Order)
        .options(
            selectinload(Order.client),
            selectinload(Order.route),
            selectinload(Order.driver),
            selectinload(Order.vehicle)
        )
        .where(Order.id == order_id)
    )
    result = await db.execute(query)
    db_order = result.scalar_one()

    return db_order


# --- СХЕМА ДЛЯ НАЗНАЧЕНИЯ ---
class OrderAssign(BaseModel):
    driver_id: int
    vehicle_id: int


@router.patch("/{order_id}/assign", response_model=OrderResponse)
async def assign_order(order_id: int, data: OrderAssign, db: AsyncSession = Depends(get_db)):
    # 1. Ищем заказ
    result = await db.execute(select(Order).where(Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Назначаем водителя и машину
    db_order.driver_id = data.driver_id
    db_order.vehicle_id = data.vehicle_id
    db_order.status = "assigned"

    # 3. Записываем в историю
    history = OrderStatusHistory(
        order_id=order_id,
        status="assigned",
        comment=f"Назначен водитель ID {data.driver_id} и машина ID {data.vehicle_id}"
    )
    db.add(history)

    await db.commit()

    # 4. Подтягиваем заказ с вложенными данными
    query = (
        select(Order)
        .options(
            selectinload(Order.client),
            selectinload(Order.route),
            selectinload(Order.driver),
            selectinload(Order.vehicle)
        )
        .where(Order.id == order_id)
    )
    result = await db.execute(query)
    db_order = result.scalar_one()

    return db_order