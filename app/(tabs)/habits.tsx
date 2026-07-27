import { View, Text, FlatList, Pressable, ActivityIndicator, TextInput } from "react-native";
import { useState } from "react";
import { MotiView } from "moti";
import { useHabits } from "@hooks/useHabits";
import { HabitCard } from "@components/ui/habit-card";
import { EmptyState } from "@components/ui/card";
import { Button } from "@components/ui/button";

const HABIT_ICONS = ["📚", "💪", "📖", "💧", "🧘", "😴", "🚶", "🥗", "✍️", "🎵", "🧹", "💊"];

const HABIT_PRESETS = [
  { name: "Lecture", icon: "📚", frequency: "daily" as const },
  { name: "Sport", icon: "💪", frequency: "daily" as const },
  { name: "Étude", icon: "📖", frequency: "daily" as const },
  { name: "Hydratation", icon: "💧", frequency: "daily" as const },
  { name: "Méditation", icon: "🧘", frequency: "daily" as const },
  { name: "Dormir avant 23h", icon: "😴", frequency: "daily" as const },
  { name: "Marche", icon: "🚶", frequency: "daily" as const },
  { name: "Manger sain", icon: "🥗", frequency: "daily" as const },
];

export default function HabitsScreen() {
  const { habits, isLoading, createHabit, toggleToday, isCreating } = useHabits();
  const [showCreate, setShowCreate] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIcon, setCustomIcon] = useState("📋");

  const handleQuickCreate = (preset: (typeof HABIT_PRESETS)[number]) => {
    createHabit(preset, {
      onSuccess: () => setShowCreate(false),
    });
  };

  const handleCustomCreate = () => {
    if (!customName.trim()) return;
    createHabit(
      { name: customName.trim(), icon: customIcon, frequency: "daily" },
      {
        onSuccess: () => {
          setCustomName("");
          setCustomIcon("📋");
          setShowCreate(false);
        },
      }
    );
  };

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
            <Text className="text-2xl font-bold text-white">Mes Habitudes 🔄</Text>
            <Text className="text-dark-muted text-sm mt-1">
              {habits.length} habitude{habits.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowCreate(!showCreate)}
            className="bg-primary-500 w-10 h-10 rounded-xl items-center justify-center active:opacity-80"
          >
            <Text className="text-white text-xl">{showCreate ? "✕" : "+"}</Text>
          </Pressable>
        </MotiView>
      </View>

      {showCreate && (
        <MotiView
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 300 }}
          className="mx-6 bg-dark-card rounded-2xl p-4 border border-dark-border mb-4"
        >
          <Text className="text-white font-semibold mb-3">Créer une habitude</Text>

          <Text className="text-dark-muted text-sm mb-2">Icône</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {HABIT_ICONS.map((icon) => (
              <Pressable
                key={icon}
                onPress={() => setCustomIcon(icon)}
                className={`w-10 h-10 rounded-lg items-center justify-center ${
                  customIcon === icon ? "bg-primary-500/30 border border-primary-500" : "bg-dark-surface border border-dark-border"
                }`}
              >
                <Text className="text-lg">{icon}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-dark-muted text-sm mb-2">Nom</Text>
          <TextInput
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white text-base mb-3"
            placeholder="Ex: Lire 30 minutes"
            placeholderTextColor="#8888a0"
            value={customName}
            onChangeText={setCustomName}
          />

          <Button
            title={isCreating ? "Création..." : "Créer"}
            onPress={handleCustomCreate}
            loading={isCreating}
            disabled={!customName.trim()}
            size="sm"
          />

          <Text className="text-dark-muted text-xs text-center mt-3 mb-1">Ou choisissez un preset</Text>
          <View className="flex-row flex-wrap gap-2">
            {HABIT_PRESETS.map((preset, i) => (
              <Pressable
                key={i}
                onPress={() => handleQuickCreate(preset)}
                disabled={isCreating}
                className="flex-row items-center bg-dark-surface border border-dark-border rounded-xl px-3 py-2 active:opacity-80"
              >
                <Text className="mr-1">{preset.icon}</Text>
                <Text className="text-dark-text text-sm">{preset.name}</Text>
              </Pressable>
            ))}
          </View>
        </MotiView>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7c4dff" />
        </View>
      ) : habits.length === 0 ? (
        <View className="flex-1 px-6 justify-center">
          <EmptyState
            icon="🔄"
            title="Aucune habitude"
            description="Crée tes premières habitudes pour bâtir des routines solides."
            action={
              <Button title="+ Créer une habitude" onPress={() => setShowCreate(true)} size="sm" />
            }
          />
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={() =>
                toggleToday({ id: item.id, completedDates: item.completedDates })
              }
            />
          )}
        />
      )}
    </View>
  );
}
