from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/focusmate"
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    GEMINI_API_KEY: str = ""
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    REDIS_URL: str | None = None
    ENV: str = "development"

    @model_validator(mode="after")
    def _check_secret_key(self):
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY must be set in .env")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
