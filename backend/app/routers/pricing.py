from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.pricing import PricingRule
from app.schemas.pricing import PricingRuleCreate, PricingRuleResponse

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