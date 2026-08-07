from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.user import User
from app.schemas.activity import ActivityCreate
from app.services.pagination import paginate_query


def list_activities(db: Session, user: User, page: int = 1, per_page: int = 20):
    query = (
        db.query(Activity)
        .filter(Activity.user_id == user.id)
        .order_by(Activity.date.desc(), Activity.created_at.desc())
    )
    return paginate_query(db, query, page, per_page)


def create_activity(db: Session, user: User, data: ActivityCreate) -> Activity:
    activity = Activity(
        user_id=user.id,
        goal_id=data.goal_id,
        habit_id=data.habit_id,
        type=data.type,
        duration=data.duration,
        date=data.date or datetime.now().date(),
        notes=data.notes,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity
