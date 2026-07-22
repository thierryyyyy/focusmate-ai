import { View, Text, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useRef } from "react";
import { MotiView } from "moti";
import { useChat } from "@hooks/useChat";
import { ChatBubble } from "@components/ui/chat-bubble";
import type { AIMessage } from "@types";

const QUICK_ACTIONS = [
  "Je procrastine 😩",
  "Organise ma journée",
  "Motive-moi 🔥",
  "Je suis fatigué",
  "Conseil habitude",
];

export default function ChatScreen() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList<AIMessage>>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-dark-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View className="px-6 pt-16 pb-2">
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 10 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 400 }}
          className="flex-row items-center"
        >
          <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center mr-3">
            <Text className="text-xl">🧠</Text>
          </View>
          <View>
            <Text className="text-lg font-bold text-white">FocusMate AI</Text>
            <Text className="text-primary-400 text-xs">Ton coach personnel</Text>
          </View>
        </MotiView>
      </View>

      <View className="flex-1 px-4">
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-4xl mb-4">💬</Text>
            <Text className="text-white font-semibold text-lg text-center mb-2">
              Salut ! Je suis FocusMate
            </Text>
            <Text className="text-dark-muted text-center text-sm mb-6">
              Pose-moi une question ou choisis une action rapide.
            </Text>
            <View className="gap-2 w-full">
              {QUICK_ACTIONS.map((action, i) => (
                <Pressable
                  key={i}
                  onPress={() => sendMessage(action)}
                  className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 active:opacity-80"
                >
                  <Text className="text-dark-text text-sm">{action}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={{ paddingVertical: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
      </View>

      {isLoading && (
        <View className="px-6 pb-2">
          <Text className="text-dark-muted text-xs">FocusMate réfléchit...</Text>
        </View>
      )}

      <View className="px-4 pb-8 pt-2">
        <View className="flex-row items-center bg-dark-card border border-dark-border rounded-2xl px-4">
          <TextInput
            className="flex-1 text-white text-base py-4"
            placeholder="Écris ton message..."
            placeholderTextColor="#8888a0"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              input.trim() && !isLoading ? "bg-primary-500" : "bg-dark-surface"
            }`}
          >
            <Text className="text-white text-lg">↑</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
