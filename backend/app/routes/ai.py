import httpx
from fastapi import APIRouter, Depends

from app.core.config import get_settings
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.ai import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/ai", tags=["ai"])

settings = get_settings()

SYSTEM_PROMPT = """Tu es FocusMate, un coach personnel IA bienveillant et motivant. Tu aides l'utilisateur à vaincre la procrastination et atteindre ses objectifs.

Règles :
- Sois concis (2-3 phrases max)
- Sois encourageant mais honnête
- Propose des actions concrètes
- Adapte ton conseil au contexte
- Réponds en français"""


@router.post("/chat", response_model=ChatResponse)
async def chat(data: ChatRequest, user: User = Depends(get_current_user)):
    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": [{"role": "user", "parts": [{"text": data.message}]}],
                "generationConfig": {"maxOutputTokens": 300, "temperature": 0.7},
            }
            async with httpx.AsyncClient() as client:
                res = await client.post(url, json=payload, timeout=10)
                if res.status_code == 200:
                    result = res.json()
                    reply = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    return ChatResponse(reply=reply or "Je n'ai pas compris.")
        except Exception:
            pass

    return ChatResponse(reply="Je suis temporairement indisponible. Réessaie dans un instant ! 😅")
