from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.pricing import PricingRule
from app.schemas.pricing import PricingRuleCreate, PricingRuleResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/pricing", tags=["pricing"])


@router.post("/", response_model=PricingRuleResponse, status_code=status.HTTP_201_CREATED)
async def create_pricing(pricing: PricingRuleCreate, db: AsyncSession = Depends(get_db)):
    db_pricing = PricingRule(**pricing.model_dump())
    db.add(db_pricing)
    await db.commit()
    await db.refresh(db_pricing)
    return db_pricing


@router.get("/", response_model=list[PricingRuleResponse])
async def get_pricings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PricingRule))
    return result.scalars().all()


@router.get("/{pricing_id}", response_model=PricingRuleResponse)
async def get_pricing(pricing_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PricingRule).where(PricingRule.id == pricing_id))
    db_pricing = result.scalar_one_or_none()
    if db_pricing is None:
        raise HTTPException(status_code=404, detail="Pricing rule not found")
    return db_pricing


class PricingUpdate(BaseModel):
    vehicle_type: Optional[str] = None
    base_rate: Optional[float] = None
    price_per_km: Optional[float] = None
    price_per_kg: Optional[float] = None


@router.patch("/{pricing_id}", response_model=PricingRuleResponse)
async def update_pricing(pricing_id: int, data: PricingUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PricingRule).where(PricingRule.id == pricing_id))
    db_pricing = result.scalar_one_or_none()
    if db_pricing is None:
        raise HTTPException(status_code=404, detail="Pricing rule not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_pricing, key, value)

    await db.commit()
    await db.refresh(db_pricing)
    return db_pricing


@router.delete("/{pricing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pricing(pricing_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PricingRule).where(PricingRule.id == pricing_id))
    db_pricing = result.scalar_one_or_none()
    if db_pricing is None:
        raise HTTPException(status_code=404, detail="Pricing rule not found")

    await db.delete(db_pricing)
    await db.commit()
    return None