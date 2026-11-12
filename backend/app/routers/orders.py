from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, delete as sql_delete
from pydantic import BaseModel
from app.database import get_db
from app.models.order import Order, OrderStatusHistory
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.dependencies import require_staff, get_current_user
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["orders"])


# --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ЗАКАЗА ---
async def get_order_with_relations(order_id: int, db: AsyncSession) -> Order:
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


# --- СОЗДАНИЕ ЗАКАЗА (только персонал) ---
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_staff)])
async def create_order(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    db_order = Order(**order.model_dump())
    db.add(db_order)
    await db.commit()

    return await get_order_with_relations(db_order.id, db)


# --- СПИСОК ЗАКАЗОВ (только персонал) ---
@router.get("/", response_model=list[OrderResponse])
async def get_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    # Если водитель — показываем только его заказы
    if current_user.role == "driver":
        driver_result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
        driver = driver_result.scalar_one_or_none()
        if driver:
            query = query.where(Order.driver_id == driver.id)
        else:
            return []  # Если водитель не привязан к карточке — пустой список

    result = await db.execute(query)
    return result.scalars().all()


# --- ОДИН ЗАКАЗ (для всех авторизованных, с проверкой для водителя) ---
@router.get("/{order_id}", response_model=OrderResponse)
async def get_single_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_order = await get_order_with_relations(order_id, db)

    # Если это водитель — он может видеть только свои заказы
    if current_user.role == "driver":
        # Ищем водителя, привязанного к этому пользователю
        driver_result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
        driver = driver_result.scalar_one_or_none()
        if not driver or db_order.driver_id != driver.id:
            raise HTTPException(
                status_code=403, detail="Вы можете просматривать только свои заказы")

    return db_order


# --- СМЕНА СТАТУСА (для персонала И водителей) ---
@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Ищем заказ
    result = await db.execute(select(Order).where(Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Проверка для водителя: он может менять только свои заказы
    if current_user.role == "driver":
        driver_result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
        driver = driver_result.scalar_one_or_none()
        if not driver or db_order.driver_id != driver.id:
            raise HTTPException(
                status_code=403, detail="Вы можете менять статус только своих заказов")

    # 3. Меняем статус
    db_order.status = data.status

    # 4. Записываем в историю
    history = OrderStatusHistory(
        order_id=order_id,
        status=data.status,
        comment=data.comment
    )
    db.add(history)

    # 5. Автоматика (бизнес-логика)
    if data.status == "assigned" and db_order.driver_id:
        driver_result = await db.execute(select(Driver).where(Driver.id == db_order.driver_id))
        driver = driver_result.scalar_one_or_none()
        if driver:
            driver.status = "on_route"

        if db_order.vehicle_id:
            vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == db_order.vehicle_id))
            vehicle = vehicle_result.scalar_one_or_none()
            if vehicle:
                vehicle.status = "on_route"

    elif data.status in ["delivered", "cancelled"]:
        if db_order.driver_id:
            driver_result = await db.execute(select(Driver).where(Driver.id == db_order.driver_id))
            driver = driver_result.scalar_one_or_none()
            if driver:
                driver.status = "available"

        if db_order.vehicle_id:
            vehicle_result = await db.execute(select(Vehicle).where(Vehicle.id == db_order.vehicle_id))
            vehicle = vehicle_result.scalar_one_or_none()
            if vehicle:
                vehicle.status = "available"

    await db.commit()
    return await get_order_with_relations(order_id, db)


# --- НАЗНАЧЕНИЕ ВОДИТЕЛЯ/МАШИНЫ (только персонал) ---
class OrderAssign(BaseModel):
    driver_id: int
    vehicle_id: int


@router.patch("/{order_id}/assign", response_model=OrderResponse,
              dependencies=[Depends(require_staff)])
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
    return await get_order_with_relations(order_id, db)


# --- УДАЛЕНИЕ ЗАКАЗА (только персонал) ---
@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_staff)])
async def delete_order(order_id: int, db: AsyncSession = Depends(get_db)):
    # 1. Ищем заказ
    result = await db.execute(select(Order).where(Order.id == order_id))
    db_order = result.scalar_one_or_none()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден!")

    # 2. Удаляем историю статусов
    await db.execute(sql_delete(OrderStatusHistory).where(OrderStatusHistory.order_id == order_id))

    # 3. Удаляем сам заказ
    await db.delete(db_order)
    await db.commit()
    return None
