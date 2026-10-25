from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.order import Order
from app.models.vehicle import Vehicle
from app.models.driver import Driver

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    # Считаем активные заказы
    active_orders = await db.execute(
        select(func.count(Order.id)).where(Order.status.in_(['new', 'assigned', 'in_progress']))
    )
    
    # Считаем новые заявки
    new_orders = await db.execute(
        select(func.count(Order.id)).where(Order.status == 'new')
    )

    # Считаем свободные машины
    available_vehicles = await db.execute(
        select(func.count(Vehicle.id)).where(Vehicle.status == 'available')
    )

    # Считаем водителей на смене
    active_drivers = await db.execute(
        select(func.count(Driver.id)).where(Driver.status.in_(['available', 'on_route']))
    )

    return {
        "active_orders": active_orders.scalar(),
        "new_orders": new_orders.scalar(),
        "available_vehicles": available_vehicles.scalar(),
        "active_drivers": active_drivers.scalar()
    }