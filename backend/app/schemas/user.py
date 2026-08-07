from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from pydantic.alias_generators import to_camel

PASSWORD_HINT = "8 caractères min, avec majuscule, minuscule, chiffre et caractère spécial"


def validate_password_strength(password: str) -> str:
    if len(password) < 8:
        raise ValueError(f"Le mot de passe doit contenir au moins 8 caractères ({PASSWORD_HINT})")
    checks = {
        "minuscule": any(c.islower() for c in password),
        "majuscule": any(c.isupper() for c in password),
        "chiffre": any(c.isdigit() for c in password),
        "caractère spécial (@$!%*?&)": any(c in "@$!%*?&" for c in password),
    }
    missing = [label for label, ok in checks.items() if not ok]
    if missing:
        raise ValueError(f"Le mot de passe doit contenir au moins une {', une '.join(missing)} ({PASSWORD_HINT})")
    return password


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class UserCreate(CamelModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)

    @field_validator("password")
    @classmethod
    def _check_password_strength(cls, v: str) -> str:
        return validate_password_strength(v)


class UserLogin(CamelModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserUpdate(CamelModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    avatar_url: str | None = Field(None, max_length=500)


class UserResponse(CamelModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: UUID
    name: str
    email: str
    avatar_url: str | None = None
    xp: int = 0
    level: int = 1
    created_at: datetime
    updated_at: datetime | None = None


class TokenResponse(CamelModel):
    user: UserResponse
    token: str
    refresh_token: str
    expires_in: int


class RefreshRequest(CamelModel):
    refresh_token: str


class RefreshResponse(CamelModel):
    token: str
    refresh_token: str
    expires_in: int
