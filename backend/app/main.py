from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routers import users, clients, drivers, vehicles, pricing, routes, orders, dashboard, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
  yield

app = FastAPI(
    title="CRM Transport API",
    version="0.1.0",
    lifespan=lifespan,
)

# Подключаем роуты
app.include_router(users.router)
app.include_router(clients.router)
app.include_router(drivers.router)
app.include_router(vehicles.router)
app.include_router(pricing.router)
app.include_router(routes.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(auth.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/db-test")
async def db_test():
   return {"database": "connect"}