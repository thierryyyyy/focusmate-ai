import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useGoals } from "@hooks/useGoals";
import { GoalCard } from "@components/ui/goal-card";
import { EmptyState } from "@components/ui/card";
import { Button } from "@components/ui/button";
import type { Goal } from "@types";

export default function GoalListScreen() {
  const { goals, isLoading, error } = useGoals();

  const activeGoals = goals.filter((g) => g.status !== "completed" && g.status !== "cancelled");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#7c4dff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-bg">
      <View className="px-6 pt-16 pb-4">
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 10 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 400 }}
          className="flex-row justify-between items-center"
        >
          <View>
            <Text className="text-2xl font-bold text-white">Mes Objectifs 🎯</Text>
            <Text className="text-dark-muted text-sm mt-1">
              {activeGoals.length} actif{activeGoals.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/goals/create")}
            className="bg-primary-500 w-10 h-10 rounded-xl items-center justify-center active:opacity-80"
          >
            <Text className="text-white text-xl">+</Text>
          </Pressable>
        </MotiView>
      </View>

      {error && (
        <View className="mx-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-400 text-sm">{error.message}</Text>
        </View>
      )}

      {goals.length === 0 ? (
        <View className="flex-1 px-6 justify-center">
          <EmptyState
            icon="🎯"
            title="Aucun objectif"
            description="Crée ton premier objectif pour commencer à progresser !"
            action={
              <Button
                title="+ Nouvel objectif"
                onPress={() => router.push("/(tabs)/goals/create")}
                size="sm"
              />
            }
          />
        </View>
      ) : (
        <FlatList
          data={[{ type: "active" as const, data: activeGoals }, { type: "completed" as const, data: completedGoals }]}
          keyExtractor={(item) => item.type}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          renderItem={({ item }) => {
            if (item.data.length === 0) return null;
            return (
              <View className="mb-4">
                <Text className="text-dark-muted text-sm mb-3 font-medium">
                  {item.type === "active" ? "En cours" : "Terminés"}
                </Text>
                {item.data.map((goal: Goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onPress={() => router.push(`/(tabs)/goals/${goal.id}`)}
                  />
                ))}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
