import { useAuthStore } from "../store/auth-store";
import { useGoalStore } from "../store/goal-store";
import type { AIMessage } from "../types";

const GEMINI_API_KEY = "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `Tu es FocusMate, un coach personnel IA bienveillant et motivant. Tu aides l'utilisateur à vaincre la procrastination et atteindre ses objectifs.

Règles :
- Sois concis (2-3 phrases max sauf si on te demande plusdetail)
- Sois encourageant mais honnête
- Propose des actions concrètes
- Adapte ton conseil au contexte (objectifs, habitudes, progression)
- Utilise un ton amical et décontracté
- Tu peux utiliser des emojis avec modération
- Si l'utilisateur procrastine, aide-le à démarrer avec une micro-action
- Réponds en français`;

function buildContext(): string {
  const goals = useGoalStore.getState().goals;
  const habits = useGoalStore.getState().habits;

  const activeGoals = goals.filter((g) => g.status !== "completed");
  const completedGoals = goals.filter((g) => g.status === "completed");

  let context = "\n\n--- Contexte utilisateur ---\n";
  context += `Objectifs actifs (${activeGoals.length}):\n`;
  activeGoals.forEach((g) => {
    context += `- ${g.title} (${g.category}, ${g.progression}%, priorité ${g.priority})\n`;
  });
  context += `Objectifs terminés: ${completedGoals.length}\n`;
  context += `Habitudes (${habits.length}):\n`;
  habits.forEach((h) => {
    context += `- ${h.name} ${h.icon} (streak: ${h.currentStreak} jours)\n`;
  });

  return context;
}

export interface ChatResponse {
  reply: string;
}

export async function sendAIMessage(
  message: string,
  history: AIMessage[]
): Promise<string> {
  if (GEMINI_API_KEY) {
    try {
      const contents = [
        ...history.slice(-10).map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
        { role: "user", parts: [{ text: message + buildContext() }] },
      ];

      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Je n'ai pas compris.";
      }
    } catch {
      // fallback to local
    }
  }

  return generateLocalResponse(message);
}

function generateLocalResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("procrastin") || lower.includes("flemme") || lower.includes("envie pas")) {
    return "Je comprends, on a tous des moments comme ça. 💪 Essaie de commencer par une micro-action : juste 2 minutes sur la tâche. Souvent, c'est le démarrage qui est le plus difficile. Tu veux qu'on identifie la plus petite étape possible ?";
  }
  if (lower.includes("fatigué") || lower.includes("épuisé") || lower.includes("tired")) {
    return "Le repos est important aussi. 😊 Si tu es vraiment épuisé, accorde-toi 20min de pause. Mais si c'est de la fatigue mentale, une petite marche de 10min peut tout changer. Qu'est-ce qui te fatigue le plus en ce moment ?";
  }
  if (lower.includes("motiv") || lower.includes("aide")) {
    const goals = useGoalStore.getState().goals;
    const active = goals.filter((g) => g.status !== "completed");
    if (active.length > 0) {
      return `Tu as ${active.length} objectif${active.length > 1 ? "s" : ""} en cours. 🎯 Lequel te tient le plus à cœur ? Concentre-toi sur celui-là et oublie le reste pour l'instant.`;
    }
    return "La motivation vient de l'action, pas l'inverse. 🔥 Choisis UN petit objectif et commence maintenant. Même 5 minutes compte !";
  }
  if (lower.includes("jour") || lower.includes("organise") || lower.includes("plan")) {
    return "Bonne idée ! 📋 Voici ma suggestion :\n1. Choisis ta tâche la plus importante\n2. Fixe un timer de 25min (Pomodoro)\n3. Travaille sans distraction\n4. Récompense-toi après\nTu veux qu'on commence ?";
  }
  if (lower.includes("merci") || lower.includes("super") || lower.includes("génial")) {
    return "Avec plaisir ! 😊 Je suis fier de toi de faire cet effort. Continue comme ça, chaque pas compte ! 🚀";
  }

  return "Merci de me raconter ça. 😊 Raconte-moi plus sur ce que tu vis en ce moment, je pourrai mieux t'aider. Qu'est-ce qui te prend le plus d'énergie aujourd'hui ?";
}
