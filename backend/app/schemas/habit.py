from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

Frequency = Literal["daily", "weekly", "monthly"]


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class HabitCreate(CamelModel):
    name: str = Field(..., min_length=1, max_length=100)
    icon: str = Field("📋", min_length=1, max_length=10)
    frequency: Frequency = "daily"


class HabitUpdate(CamelModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    icon: str | None = Field(None, min_length=1, max_length=10)
    frequency: Frequency | None = None
    completed_dates: list[str] | None = None


class HabitResponse(CamelModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    icon: str
    frequency: Frequency
    completed_dates: list[str]
    created_at: datetime
    updated_at: datetime | None = None


class PaginatedHabits(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    items: list[HabitResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
