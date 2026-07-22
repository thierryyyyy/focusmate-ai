from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.goal import Goal
from app.models.habit import Habit

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    habits = db.query(Habit).filter(Habit.user_id == user.id).all()

    total_goals = len(goals)
    completed_goals = len([g for g in goals if g.status == "completed"])
    total_habits = len(habits)
    total_focus = sum(g.spent_time for g in goals)

    return {
        "totalGoals": total_goals,
        "completedGoals": completed_goals,
        "completionRate": round((completed_goals / total_goals * 100) if total_goals > 0 else 0),
        "totalHabits": total_habits,
        "totalFocusHours": round(total_focus, 1),
    }
