import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { MotiView } from "moti";
import { useGoals } from "@hooks/useGoals";
import { Button } from "@components/ui/button";
import { GOAL_CATEGORIES, PRIORITIES } from "@constants";
import type { GoalCategory, Priority } from "@types";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, updateGoal, deleteGoal, completeGoal, isUpdating, isDeleting, isCompleting } = useGoals();

  const goal = goals.find((g) => g.id === id);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [estimatedTime, setEstimatedTime] = useState("1");
  const [spentTime, setSpentTime] = useState("0");
  const [progression, setProgression] = useState("0");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setCategory(goal.category);
      setPriority(goal.priority);
      setEstimatedTime(String(goal.estimatedTime));
      setSpentTime(String(goal.spentTime));
      setProgression(String(goal.progression));
    }
  }, [goal]);

  if (!goal) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center px-6">
        <Text className="text-dark-muted text-lg">Objectif introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} variant="outline" size="sm" />
      </View>
    );
  }

  const categoryInfo = GOAL_CATEGORIES.find((c) => c.value === goal.category);
  const isCompleted = goal.status === "completed";

  const onSave = () => {
    updateGoal(
      {
        id: goal.id,
        data: {
          title,
          category,
          priority,
          estimatedTime: Number(estimatedTime),
          spentTime: Number(spentTime),
          progression: Number(progression),
        },
      },
      { onSuccess: () => setEditing(false) }
    );
  };

  const onComplete = () => {
    Alert.alert("Terminer cet objectif ?", "Marquer comme terminé ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Terminer", onPress: () => completeGoal(goal.id) },
    ]);
  };

  const onDelete = () => {
    Alert.alert("Supprimer cet objectif ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteGoal(goal.id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-16 pb-4">
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 10 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 400 }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Pressable onPress={() => router.back()} className="py-2">
              <Text className="text-primary-400 text-lg">← Retour</Text>
            </Pressable>
            <Pressable onPress={() => setEditing(!editing)} className="py-2">
              <Text className="text-primary-400 text-lg">{editing ? "Annuler" : "Modifier"}</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center mb-6">
            <Text className="text-3xl mr-3">{categoryInfo?.icon ?? "📋"}</Text>
            <View className="flex-1">
              {editing ? (
                <TextInput
                  className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white text-lg"
                  value={title}
                  onChangeText={setTitle}
                />
              ) : (
                <>
                  <Text className="text-xl font-bold text-white">{goal.title}</Text>
                  <Text className="text-dark-muted text-sm mt-1">
                    {STATUS_LABELS[goal.status]} • {categoryInfo?.label}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View className="bg-dark-card rounded-2xl p-5 border border-dark-border mb-4">
            <Text className="text-dark-muted text-sm mb-3">Progression</Text>
            <View className="bg-dark-surface rounded-full h-3 mb-2">
              <View
                className="bg-primary-500 rounded-full h-3"
                style={{ width: `${Math.min(goal.progression, 100)}%` }}
              />
            </View>
            <Text className="text-white text-sm text-right">{goal.progression}%</Text>
            {editing && (
              <View className="mt-4">
                <Text className="text-dark-muted text-xs mb-1">Progression (%)</Text>
                <TextInput
                  className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white"
                  keyboardType="numeric"
                  value={progression}
                  onChangeText={setProgression}
                />
              </View>
            )}
          </View>

          <View className="bg-dark-card rounded-2xl p-5 border border-dark-border mb-4">
            <Text className="text-dark-muted text-sm mb-3">Temps</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-dark-muted text-xs">Estimé</Text>
                {editing ? (
                  <TextInput
                    className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm mt-1 w-20"
                    keyboardType="numeric"
                    value={estimatedTime}
                    onChangeText={setEstimatedTime}
                  />
                ) : (
                  <Text className="text-white text-lg font-semibold">{goal.estimatedTime}h</Text>
                )}
              </View>
              <View>
                <Text className="text-dark-muted text-xs">Réalisé</Text>
                {editing ? (
                  <TextInput
                    className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm mt-1 w-20"
                    keyboardType="numeric"
                    value={spentTime}
                    onChangeText={setSpentTime}
                  />
                ) : (
                  <Text className="text-white text-lg font-semibold">{goal.spentTime}h</Text>
                )}
              </View>
            </View>
          </View>

          {editing && (
            <>
              <Text className="text-dark-muted text-sm mb-3">Catégorie</Text>
              <View className="flex-row gap-2 mb-4 flex-wrap">
                {GOAL_CATEGORIES.map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => setCategory(c.value)}
                    className={`flex-row items-center px-3 py-2 rounded-xl border ${
                      category === c.value
                        ? "bg-primary-500/20 border-primary-500"
                        : "bg-dark-surface border-dark-border"
                    }`}
                  >
                    <Text className="mr-1">{c.icon}</Text>
                    <Text className={`text-xs ${category === c.value ? "text-primary-400" : "text-dark-muted"}`}>
                      {c.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="text-dark-muted text-sm mb-3">Priorité</Text>
              <View className="flex-row gap-2 mb-6">
                {PRIORITIES.map((p) => {
                  const colors = { low: "#4dd0e1", medium: "#ffd54f", high: "#ff5252" };
                  const sel = priority === p.value;
                  return (
                    <Pressable
                      key={p.value}
                      onPress={() => setPriority(p.value)}
                      className={`flex-1 py-2 rounded-xl border items-center ${sel ? "border-current" : "bg-dark-surface border-dark-border"}`}
                      style={sel ? { borderColor: colors[p.value], backgroundColor: `${colors[p.value]}15` } : undefined}
                    >
                      <Text className="text-sm" style={{ color: sel ? colors[p.value] : "#8888a0" }}>
                        {p.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {editing ? (
            <Button title="Sauvegarder" onPress={onSave} loading={isUpdating} />
          ) : (
            <View className="gap-3">
              {!isCompleted && (
                <Button title="Marquer terminé" onPress={onComplete} loading={isCompleting} variant="secondary" />
              )}
              <Button title="Supprimer" onPress={onDelete} variant="outline" />
            </View>
          )}
        </MotiView>
      </View>
    </ScrollView>
  );
}
