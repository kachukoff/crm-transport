from sqlalchemy import String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class PricingRule(Base):
    __tablename__ = "pricing_rules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False)
    base_rate: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    price_per_km: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    price_per_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)