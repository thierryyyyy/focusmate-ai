from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityResponse, PaginatedActivities
from app.services import activities as activity_service

router = APIRouter(prefix="/api/activities", tags=["activities"])


@router.get("", response_model=PaginatedActivities)
def list_activities(
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return activity_service.list_activities(db, user, page, per_page)


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(
    data: ActivityCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return activity_service.create_activity(db, user, data)
