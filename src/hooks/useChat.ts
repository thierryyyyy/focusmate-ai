import { useState, useCallback } from "react";
import { useAuthStore } from "../store/auth-store";
import { sendAIMessage } from "../services/ai";
import type { AIMessage } from "../types";

let messageIdCounter = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++messageIdCounter}`;
}

export function useChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AIMessage = {
      id: generateId(),
      userId: token ?? "local",
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendAIMessage(content, messages);
      const assistantMessage: AIMessage = {
        id: generateId(),
        userId: token ?? "local",
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: AIMessage = {
        id: generateId(),
        userId: token ?? "local",
        role: "assistant",
        content: "Désolé, j'ai eu un petit souci technique. Réessaie dans un instant ! 😅",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, token]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
