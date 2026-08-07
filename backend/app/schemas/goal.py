from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

Category = Literal["personal", "work", "health", "learning", "finance", "other"]
Priority = Literal["low", "medium", "high", "urgent"]
GoalStatus = Literal["pending", "in_progress", "completed", "cancelled"]


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class GoalCreate(CamelModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: Category = "personal"
    start_date: date
    end_date: date
    priority: Priority = "medium"
    estimated_time: float = Field(1.0, gt=0)


class GoalUpdate(CamelModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    category: Category | None = None
    start_date: date | None = None
    end_date: date | None = None
    priority: Priority | None = None
    status: GoalStatus | None = None
    estimated_time: float | None = Field(None, gt=0)
    spent_time: float | None = Field(None, ge=0)
    progression: float | None = Field(None, ge=0, le=100)


class GoalResponse(CamelModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: UUID
    user_id: UUID
    title: str
    category: Category
    start_date: date
    end_date: date
    priority: Priority
    status: GoalStatus
    estimated_time: float
    spent_time: float
    progression: float
    created_at: datetime
    updated_at: datetime | None = None


class PaginatedGoals(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    items: list[GoalResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
