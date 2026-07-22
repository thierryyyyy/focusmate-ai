from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.habit import Habit
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitUpdate, HabitResponse

router = APIRouter(prefix="/api/habits", tags=["habits"])


@router.get("", response_model=list[HabitResponse])
def list_habits(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Habit).filter(Habit.user_id == user.id).order_by(Habit.created_at.desc()).all()


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(data: HabitCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    habit = Habit(
        user_id=user.id,
        name=data.name,
        icon=data.icon,
        frequency=data.frequency,
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(habit_id: UUID, data: HabitUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habitude introuvable")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)

    db.commit()
    db.refresh(habit)
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(habit_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habitude introuvable")
    db.delete(habit)
    db.commit()
