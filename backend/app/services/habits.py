from uuid import UUID

from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitUpdate
from app.services.pagination import paginate_query


def list_habits(db: Session, user: User, page: int = 1, per_page: int = 20):
    query = (
        db.query(Habit)
        .filter(Habit.user_id == user.id)
        .order_by(Habit.created_at.desc())
    )
    return paginate_query(db, query, page, per_page)


def get_habit(db: Session, user: User, habit_id: UUID) -> Habit | None:
    return (
        db.query(Habit)
        .filter(Habit.id == habit_id, Habit.user_id == user.id)
        .first()
    )


def create_habit(db: Session, user: User, data: HabitCreate) -> Habit:
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


def update_habit(db: Session, user: User, habit_id: UUID, data: HabitUpdate) -> Habit | None:
    habit = get_habit(db, user, habit_id)
    if not habit:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)
    db.commit()
    db.refresh(habit)
    return habit


def delete_habit(db: Session, user: User, habit_id: UUID) -> bool:
    habit = get_habit(db, user, habit_id)
    if not habit:
        return False
    db.delete(habit)
    db.commit()
    return True
