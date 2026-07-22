from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class GoalCreate(BaseModel):
    title: str
    category: str
    start_date: str
    end_date: str
    priority: str = "medium"
    estimated_time: float = 1.0


class GoalUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    priority: str | None = None
    status: str | None = None
    estimated_time: float | None = None
    spent_time: float | None = None
    progression: float | None = None


class GoalResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    category: str
    start_date: str
    end_date: str
    priority: str
    status: str
    estimated_time: float
    spent_time: float
    progression: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
