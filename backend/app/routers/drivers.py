from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.driver import Driver
from app.models.order import Order
from app.models.vehicle import Vehicle
from app.schemas.driver import DriverCreate, DriverResponse

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