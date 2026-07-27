from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.activity import Activity
from app.models.user import User

router = APIRouter(prefix="/api/activities", tags=["activities"])


class ActivityCreate(BaseModel):
    goal_id: UUID | None = None
    habit_id: UUID | None = None
    type: str = "focus"
    duration: int = 0
    date: str = ""
    notes: str | None = None


@router.get("")
def list_activities(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return (
        db.query(Activity)
        .filter(Activity.user_id == user.id)
        .order_by(Activity.date.desc())
        .all()
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def create_activity(
    data: ActivityCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    activity = Activity(
        user_id=user.id,
        goal_id=data.goal_id,
        habit_id=data.habit_id,
        type=data.type,
        duration=data.duration,
        date=data.date,
        notes=data.notes,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity
