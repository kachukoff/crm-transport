from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routers import users


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

app.include_router(users.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/db-test")
async def db_test():
   return {"database": "connect"}