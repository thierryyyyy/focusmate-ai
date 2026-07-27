import { useState, useCallback, useRef } from "react";
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
  const messagesRef = useRef<AIMessage[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AIMessage = {
      id: generateId(),
      userId: token ?? "local",
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      messagesRef.current = prev;
      return [...prev, userMessage];
    });
    setIsLoading(true);

    try {
      const reply = await sendAIMessage(content, messagesRef.current);
      const assistantMessage: AIMessage = {
        id: generateId(),
        userId: token ?? "local",
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => {
        messagesRef.current = prev;
        return [...prev, assistantMessage];
      });
    } catch {
      const errorMessage: AIMessage = {
        id: generateId(),
        userId: token ?? "local",
        role: "assistant",
        content: "Désolé, j'ai eu un petit souci technique. Réessaie dans un instant ! 😅",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => {
        messagesRef.current = prev;
        return [...prev, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
