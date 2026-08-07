from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse, PaginatedGoals
from app.services import goals as goal_service

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.get("", response_model=PaginatedGoals)
def list_goals(
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return goal_service.list_goals(db, user, page, per_page)


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(data: GoalCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return goal_service.create_goal(db, user, data)


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = goal_service.get_goal(db, user, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Objectif introuvable")
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: UUID, data: GoalUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = goal_service.update_goal(db, user, goal_id, data)
    if not goal:
        raise HTTPException(status_code=404, detail="Objectif introuvable")
    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not goal_service.delete_goal(db, user, goal_id):
        raise HTTPException(status_code=404, detail="Objectif introuvable")
