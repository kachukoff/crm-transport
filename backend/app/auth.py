import uuid
import redis.asyncio as redis
from app.config import settings

# Подключаемся к Redis (хост="redis" - имя контейнера в Docker)
redis_client = redis.Redis(host="redis", port=6379, decode_responses=True)

SESSION_EXPIRE_SECOND = 60 * 60 * 24 # 24 часа

async def create_session(user_id: int) -> str:
  """ Создаем сессию в Redis и возвращаем токен """
  token = str(uuid.uuid4())
  await redis_client.setex(f"session:{token}", SESSION_EXPIRE_SECOND, user_id)
  return token

async def get_user_id_by_token(token: str) -> int | None:
  """Возвращаем ID пользователя по токену сессии."""
  user_id = await redis_client.get(f"session:{token}")
  if user_id:
    return int(user_id)
  return None

async def delete_session(token: str):
  """ Удаляем сессию (выход из системы). """
  await redis_client.delete(f"session{token}")