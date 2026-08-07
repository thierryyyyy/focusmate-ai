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
- Sois concis (2-3 phrases max sauf si on te demande plus de détail)
- Sois encourageant mais honnête
- Propose des actions concrètes
- Adapte ton conseil au contexte (objectifs, habitudes, progression)
- Utilise un ton amical et décontracté
- Tu peux utiliser des emojis avec modération
- Si l'utilisateur procrastine, aide-le à démarrer avec une micro-action
- Réponds en français"""


def build_context(context: dict | None) -> str:
    if not context:
        return ""
    text = "\n\n--- Contexte utilisateur ---\n"
    goals = context.get("goals", [])
    habits = context.get("habits", [])
    if goals:
        active = [g for g in goals if g.get("status") != "completed"]
        text += f"Objectifs actifs ({len(active)}):\n"
        for g in active:
            text += f"- {g.get('title', '')} ({g.get('category', '')}, {g.get('progression', 0)}%, priorité {g.get('priority', '')})\n"
        text += f"Objectifs terminés: {len([g for g in goals if g.get('status') == 'completed'])}\n"
    if habits:
        text += f"Habitudes ({len(habits)}):\n"
        for h in habits:
            text += f"- {h.get('name', '')} {h.get('icon', '')} (streak: {h.get('currentStreak', 0)} jours)\n"
    return text


def local_fallback(message: str) -> str:
    lower = message.lower()
    if any(w in lower for w in ["procrastin", "flemme", "envie pas", "pas envie"]):
        return "Je comprends, on a tous des moments comme ça. 💪 Essaie de commencer par une micro-action : juste 2 minutes sur la tâche. Souvent, c'est le démarrage qui est le plus difficile. Tu veux qu'on identifie la plus petite étape possible ?"
    if any(w in lower for w in ["fatigué", "épuisé", "tired", "fatiguée"]):
        return "Le repos est important aussi. 😊 Si tu es vraiment épuisé, accorde-toi 20min de pause. Mais si c'est de la fatigue mentale, une petite marche de 10min peut tout changer. Qu'est-ce qui te fatigue le plus en ce moment ?"
    if any(w in lower for w in ["motiv", "aide", "motivation"]):
        return "La motivation vient de l'action, pas l'inverse. 🔥 Choisis UN petit objectif et commence maintenant. Même 5 minutes compte !"
    if any(w in lower for w in ["jour", "organise", "plan", "journée"]):
        return "Bonne idée ! 📋 Voici ma suggestion :\n1. Choisis ta tâche la plus importante\n2. Fixe un timer de 25min (Pomodoro)\n3. Travaille sans distraction\n4. Récompense-toi après\nTu veux qu'on commence ?"
    if any(w in lower for w in ["merci", "super", "génial", "cool"]):
        return "Avec plaisir ! 😊 Je suis fier de toi de faire cet effort. Continue comme ça, chaque pas compte ! 🚀"
    if any(w in lower for w in ["habitude", "routine", "streak", "série"]):
        return "Les habitudes se construisent jour par jour. 🔄 Concentre-toi sur UNE seule habitude cette semaine. Une fois qu'elle est ancrée, passe à la suivante. La constance bat l'intensité !"
    if any(w in lower for w in ["objectif", "but", "goal"]):
        return "Un bon objectif est SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporel. 🎯 Décompose-le en petites étapes et célébre chaque victoire, même la plus petite !"
    return "Merci de me raconter ça. 😊 Raconte-moi plus sur ce que tu vis en ce moment, je pourrai mieux t'aider. Qu'est-ce qui te prend le plus d'énergie aujourd'hui ?"


@router.post("/chat", response_model=ChatResponse)
async def chat(data: ChatRequest, user: User = Depends(get_current_user)):
    context_text = build_context(data.context)
    full_message = data.message + context_text

    if settings.GEMINI_API_KEY:
        try:
            contents = []
            if data.history:
                for msg in data.history[-10:]:
                    contents.append({
                        "role": msg.role if msg.role == "user" else "model",
                        "parts": [{"text": msg.content}],
                    })
            contents.append({"role": "user", "parts": [{"text": full_message}]})

            url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
            headers = {"X-Goog-Api-Key": settings.GEMINI_API_KEY, "Content-Type": "application/json"}
            payload = {
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": contents,
                "generationConfig": {"maxOutputTokens": 1024, "temperature": 0.7},
            }
            async with httpx.AsyncClient() as client:
                res = await client.post(url, json=payload, headers=headers, timeout=15)
                if res.status_code == 200:
                    result = res.json()
                    reply = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    if reply:
                        return ChatResponse(reply=reply)
        except Exception:
            pass

    return ChatResponse(reply=local_fallback(data.message))
