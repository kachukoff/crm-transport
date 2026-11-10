from fastapi import Depends, HTTPException, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.database import get_db
from app.auth import get_user_id_by_token
from app.models.user import User


async def get_current_user(
    session_token: Optional[str] = Cookie(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Возвращаем текущего пользователя из сессии."""
    if not session_token:
        raise HTTPException(status_code=401, detail="Не авторизован")

    user_id = await get_user_id_by_token(session_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Сессия истекла")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="Пользователь заблокирован или не найден")

    return user


async def require_admin(current_user: User = Depends(get_current_user)):
    """Пропускаем только администратора."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администратора")
    return current_user


async def require_staff(current_user: User = Depends(get_current_user)):
    """Пропускаем администратора и менеджера."""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Доступ только для персонала (админ/менеджер)")
    return current_user