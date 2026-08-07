from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.goal import Goal
from app.models.habit import Habit
from app.models.activity import Activity

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    total_goals = db.scalar(
        select(func.count(Goal.id)).where(Goal.user_id == user.id)
    ) or 0
    completed_goals = db.scalar(
        select(func.count(Goal.id)).where(
            Goal.user_id == user.id, Goal.status == "completed"
        )
    ) or 0
    total_habits = db.scalar(
        select(func.count(Habit.id)).where(Habit.user_id == user.id)
    ) or 0
    total_focus_minutes = db.scalar(
        select(func.coalesce(func.sum(Activity.duration), 0)).where(
            Activity.user_id == user.id, Activity.type == "focus"
        )
    ) or 0

    return {
        "totalGoals": total_goals,
        "completedGoals": completed_goals,
        "completionRate": round((completed_goals / total_goals * 100) if total_goals > 0 else 0),
        "totalHabits": total_habits,
        "totalFocusHours": round(total_focus_minutes / 60, 1),
    }
