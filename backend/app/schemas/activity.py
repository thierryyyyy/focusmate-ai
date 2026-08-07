from datetime import date as date_type
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

ActivityType = Literal["focus", "break", "pomodoro", "manual"]


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ActivityCreate(CamelModel):
    goal_id: UUID | None = None
    habit_id: UUID | None = None
    type: ActivityType = "focus"
    duration: int = Field(0, ge=0)
    date: date_type | None = None
    notes: str | None = Field(None, max_length=500)


class ActivityResponse(CamelModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: UUID
    user_id: UUID
    goal_id: UUID | None = None
    habit_id: UUID | None = None
    type: ActivityType
    duration: int
    date: date_type
    notes: str | None = None
    created_at: datetime


class PaginatedActivities(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    items: list[ActivityResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
