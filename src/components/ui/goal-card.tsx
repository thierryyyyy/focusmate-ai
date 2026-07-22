import { View, Text, Pressable } from "react-native";
import type { Goal } from "@types";
import { GOAL_CATEGORIES } from "@constants";

const PRIORITY_COLORS = {
  low: "#4dd0e1",
  medium: "#ffd54f",
  high: "#ff5252",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const category = GOAL_CATEGORIES.find((c) => c.value === goal.category);

  return (
    <Pressable
      onPress={onPress}
      className="bg-dark-card rounded-2xl p-5 border border-dark-border mb-3 active:opacity-80"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 flex-row items-center">
          <Text className="text-xl mr-2">{category?.icon ?? "📋"}</Text>
          <Text className="text-white font-semibold text-base flex-1">{goal.title}</Text>
        </View>
        <View
          className="px-2 py-1 rounded-lg"
          style={{ backgroundColor: `${PRIORITY_COLORS[goal.priority]}20` }}
        >
          <Text
            className="text-xs font-medium"
            style={{ color: PRIORITY_COLORS[goal.priority] }}
          >
            {goal.priority === "low" ? "Basse" : goal.priority === "medium" ? "Moyenne" : "Haute"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-dark-muted text-xs">{STATUS_LABELS[goal.status]}</Text>
        <Text className="text-dark-muted text-xs">
          {goal.spentTime}h / {goal.estimatedTime}h
        </Text>
      </View>

      <View className="bg-dark-surface rounded-full h-2">
        <View
          className="bg-primary-500 rounded-full h-2"
          style={{ width: `${Math.min(goal.progression, 100)}%` }}
        />
      </View>
      <Text className="text-dark-muted text-xs text-right mt-1">{goal.progression}%</Text>
    </Pressable>
  );
}
