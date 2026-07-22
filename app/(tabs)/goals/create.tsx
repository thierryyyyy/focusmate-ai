import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { MotiView } from "moti";
import { useGoals } from "@hooks/useGoals";
import { Button } from "@components/ui/button";
import { GOAL_CATEGORIES, PRIORITIES } from "@constants";
import type { GoalCategory, Priority } from "@types";

export default function CreateGoalScreen() {
  const { createGoal, isCreating } = useGoals();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [estimatedTime, setEstimatedTime] = useState("1");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const onSubmit = () => {
    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }
    if (!endDate) {
      setError("La date de fin est requise");
      return;
    }

    setError("");
    createGoal(
      {
        title: title.trim(),
        category,
        startDate,
        endDate,
        priority,
        estimatedTime: Number(estimatedTime) || 1,
      },
      {
        onSuccess: () => router.back(),
        onError: (err) => setError(err.message),
      }
    );
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
            <Text className="text-lg font-semibold text-white">Nouvel objectif</Text>
            <View className="w-16" />
          </View>

          {error ? (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-400 text-sm">{error}</Text>
            </View>
          ) : null}

          <Text className="text-dark-muted text-sm mb-2">Titre</Text>
          <TextInput
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-white text-base mb-5"
            placeholder="Ex: Terminer le projet React"
            placeholderTextColor="#8888a0"
            value={title}
            onChangeText={setTitle}
          />

          <Text className="text-dark-muted text-sm mb-3">Catégorie</Text>
          <View className="flex-row gap-2 mb-5 flex-wrap">
            {GOAL_CATEGORIES.map((c) => (
              <Pressable
                key={c.value}
                onPress={() => setCategory(c.value)}
                className={`flex-row items-center px-4 py-2 rounded-xl border ${
                  category === c.value
                    ? "bg-primary-500/20 border-primary-500"
                    : "bg-dark-surface border-dark-border"
                }`}
              >
                <Text className="mr-1">{c.icon}</Text>
                <Text
                  className={`text-sm ${
                    category === c.value ? "text-primary-400" : "text-dark-muted"
                  }`}
                >
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-dark-muted text-sm mb-3">Priorité</Text>
          <View className="flex-row gap-2 mb-5">
            {PRIORITIES.map((p) => {
              const colors = { low: "#4dd0e1", medium: "#ffd54f", high: "#ff5252" };
              const isSelected = priority === p.value;
              return (
                <Pressable
                  key={p.value}
                  onPress={() => setPriority(p.value)}
                  className={`flex-1 py-3 rounded-xl border items-center ${
                    isSelected
                      ? "border-current"
                      : "bg-dark-surface border-dark-border"
                  }`}
                  style={isSelected ? { borderColor: colors[p.value], backgroundColor: `${colors[p.value]}15` } : undefined}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: isSelected ? colors[p.value] : "#8888a0" }}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="text-dark-muted text-sm mb-2">Temps estimé (heures)</Text>
          <TextInput
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-white text-base mb-5"
            placeholder="1"
            placeholderTextColor="#8888a0"
            keyboardType="numeric"
            value={estimatedTime}
            onChangeText={setEstimatedTime}
          />

          <Text className="text-dark-muted text-sm mb-2">Date de début</Text>
          <TextInput
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-white text-base mb-5"
            placeholder="AAAA-MM-JJ"
            placeholderTextColor="#8888a0"
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text className="text-dark-muted text-sm mb-2">Date de fin</Text>
          <TextInput
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-white text-base mb-8"
            placeholder="AAAA-MM-JJ"
            placeholderTextColor="#8888a0"
            value={endDate}
            onChangeText={setEndDate}
          />

          <Button
            title={isCreating ? "Création..." : "Créer l'objectif"}
            onPress={onSubmit}
            loading={isCreating}
            disabled={isCreating}
          />
        </MotiView>
      </View>
    </ScrollView>
  );
}
