from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserLogin, UserResponse
from app.security import verify_password
from app.auth import create_session, get_user_id_by_token, delete_session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=UserResponse)
async def login(
  data: UserLogin,
  response: Response,
  db: AsyncSession = Depends(get_db)
):
  # Ищем пользователя по email
  result = await db.execute(select(User).where(User.email == data.email))
  user = result.scalar_one_or_none()

  if not user or not verify_password(data.password, user.password_hash):
    raise HTTPException(status_code=401, detail="Неверный email или пароль")

  if not user.is_active:
      raise HTTPException(status_code=403, detail="Пользователь заблокирован")

  # Создаем сессию в Redis
  token = await create_session(user.id)

  # Устанавливаем cookie с токеном (httpOnly для безопасности)
  response.set_cookie(
     key="session_token",
     value=token,
     httponly=True,
     max_age=60 * 60 * 24, # 24 часа
     samesite="lax"
  )

  return user


@router.post("/logout")
async def logout(
  response: Response,
  session_token: Optional[str] = Cookie(None)
):
  if session_token:
      await delete_session(session_token)
  response.delete_cookie("session_token")
  return {"message": "Вы вышли из системы"}


@router.get("/me", response_model=UserResponse)
async def get_me(
  session_token: Optional[str] = Cookie(None),
  db: AsyncSession = Depends(get_db)
):
  if not session_token:
     raise HTTPException(status_code=401, detail="Не авторизован")

  user_id = await get_user_id_by_token(session_token)
  if not user_id:
     raise HTTPException(status_code=401, detail="Сессия истекла")

  result = await db.execute(select(User).where(User.id == user_id))
  user = result.scalar_one_or_none()
  if not user:
     raise HTTPException(status_code=401, detail="Пользователь не найден")

  return user
