import { View, Text, Pressable } from "react-native";
import type { Habit } from "@types";
import { isCompletedToday } from "@utils/streaks";

interface HabitCardProps {
  habit: Habit;
  onToggle?: () => void;
  onPress?: () => void;
}

export function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  const doneToday = isCompletedToday(habit.completedDates);

  return (
    <Pressable
      onPress={onPress}
      className="bg-dark-card rounded-2xl p-4 border border-dark-border mb-3 flex-row items-center active:opacity-80"
    >
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
        className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
          doneToday ? "bg-primary-500/20" : "bg-dark-surface"
        }`}
      >
        <Text className="text-2xl">{habit.icon}</Text>
      </Pressable>

      <View className="flex-1">
        <Text className={`font-semibold text-base ${doneToday ? "text-primary-400" : "text-white"}`}>
          {habit.name}
        </Text>
        <Text className="text-dark-muted text-xs mt-1">
          {habit.frequency === "daily" ? "Quotidienne" : "Hebdomadaire"}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-white font-bold text-lg">{habit.currentStreak}</Text>
        <Text className="text-dark-muted text-xs">jours 🔥</Text>
      </View>

      {doneToday && (
        <View className="ml-3 w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
          <Text className="text-white text-sm">✓</Text>
        </View>
      )}
    </Pressable>
  );
}
