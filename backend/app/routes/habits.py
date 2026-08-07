from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitUpdate, HabitResponse, PaginatedHabits
from app.services import habits as habit_service

router = APIRouter(prefix="/api/habits", tags=["habits"])


@router.get("", response_model=PaginatedHabits)
def list_habits(
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return habit_service.list_habits(db, user, page, per_page)


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(data: HabitCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return habit_service.create_habit(db, user, data)


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(habit_id: UUID, data: HabitUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    habit = habit_service.update_habit(db, user, habit_id, data)
    if not habit:
        raise HTTPException(status_code=404, detail="Habitude introuvable")
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(habit_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not habit_service.delete_habit(db, user, habit_id):
        raise HTTPException(status_code=404, detail="Habitude introuvable")
