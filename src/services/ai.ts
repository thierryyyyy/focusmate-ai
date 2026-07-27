import { apiClient } from "./api";
import { useAuthStore } from "../store/auth-store";
import { useGoalStore } from "../store/goal-store";
import type { AIMessage } from "../types";

interface BackendChatResponse {
  reply: string;
}

function buildContext() {
  const goals = useGoalStore.getState().goals;
  const habits = useGoalStore.getState().habits;
  return { goals, habits };
}

export async function sendAIMessage(
  message: string,
  history: AIMessage[]
): Promise<string> {
  const token = useAuthStore.getState().token;
  if (!token) return "Connecte-toi d'abord pour utiliser le chat IA.";

  const historyPayload = history.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await apiClient<BackendChatResponse>("/ai/chat", {
    method: "POST",
    body: {
      message,
      history: historyPayload,
      context: buildContext(),
    },
    token,
  });

  return res.reply;
}
