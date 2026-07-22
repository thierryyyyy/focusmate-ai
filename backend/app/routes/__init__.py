from fastapi import APIRouter

from app.routes import auth, goals, habits, ai, stats

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(goals.router)
api_router.include_router(habits.router)
api_router.include_router(ai.router)
api_router.include_router(stats.router)
