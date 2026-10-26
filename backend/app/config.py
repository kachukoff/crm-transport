from pydantic_settings import BaseSettings, SettingsConfigDict
import os

# Определяем путь к корню проекта (на две папки выше config.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    DATABASE_URL: str = "postgresql+asyncpg://admin:12345678@localhost:5432/crm_db"

settings = Settings()