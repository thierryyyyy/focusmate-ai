import { View, Text } from "react-native";
import type { AIMessage } from "@types";

interface ChatBubbleProps {
  message: AIMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <View className={`mb-3 flex-row ${isUser ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary-500 rounded-br-md"
            : "bg-dark-card border border-dark-border rounded-bl-md"
        }`}
      >
        <Text className={`${isUser ? "text-white" : "text-dark-text"} text-base leading-5`}>
          {message.content}
        </Text>
        <Text className={`text-[10px] mt-1 ${isUser ? "text-white/50" : "text-dark-muted"}`}>
          {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}
