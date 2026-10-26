from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.route import Route
from app.schemas.route import RouteCreate, RouteResponse

router = APIRouter(prefix="/routes", tags=["routes"])


@router.post("/", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
async def create_route(route: RouteCreate, db: AsyncSession = Depends(get_db)):
    db_route = Route(**route.model_dump())
    db.add(db_route)
    await db.commit()
    await db.refresh(db_route)
    return db_route


@router.get("/", response_model=list[RouteResponse])
async def get_routes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Route))
    return result.scalars().all()