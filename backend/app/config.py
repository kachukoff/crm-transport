from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env", extra="ignore")

  DATABASE_URL: str = "admin:12345678@database:5432/crm_db"


settings = Settings()