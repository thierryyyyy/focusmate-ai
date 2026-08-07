from math import ceil

from sqlalchemy import func, select


def paginate_query(db, query, page: int = 1, per_page: int = 20):
    """Paginate a SQLAlchemy query.

    Returns a dict with items, total, page, per_page, total_pages that can be
    used directly as a Paginated* response model payload.
    """
    page = max(page, 1)
    per_page = min(max(per_page, 1), 100)

    total = db.execute(select(func.count()).select_from(query.subquery())).scalar_one()
    items = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": ceil(total / per_page),
    }
