from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class HabitCreate(BaseModel):
    name: str
    icon: str = "📋"
    frequency: str = "daily"


class HabitUpdate(BaseModel):
    name: str | None = None
    icon: str | None = None
    frequency: str | None = None
    completed_dates: list[str] | None = None


class HabitResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    icon: str
    frequency: str
    completed_dates: list[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
