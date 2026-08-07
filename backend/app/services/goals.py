from uuid import UUID

from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate
from app.services.pagination import paginate_query


def list_goals(db: Session, user: User, page: int = 1, per_page: int = 20):
    query = (
        db.query(Goal)
        .filter(Goal.user_id == user.id)
        .order_by(Goal.created_at.desc())
    )
    return paginate_query(db, query, page, per_page)


def get_goal(db: Session, user: User, goal_id: UUID) -> Goal | None:
    return (
        db.query(Goal)
        .filter(Goal.id == goal_id, Goal.user_id == user.id)
        .first()
    )


def create_goal(db: Session, user: User, data: GoalCreate) -> Goal:
    goal = Goal(
        user_id=user.id,
        title=data.title,
        category=data.category,
        start_date=data.start_date,
        end_date=data.end_date,
        priority=data.priority,
        estimated_time=data.estimated_time,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def update_goal(db: Session, user: User, goal_id: UUID, data: GoalUpdate) -> Goal | None:
    goal = get_goal(db, user, goal_id)
    if not goal:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal


def delete_goal(db: Session, user: User, goal_id: UUID) -> bool:
    goal = get_goal(db, user, goal_id)
    if not goal:
        return False
    db.delete(goal)
    db.commit()
    return True
