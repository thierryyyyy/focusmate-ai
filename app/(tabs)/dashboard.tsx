import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useAvatarStore } from "@store/avatar-store";
import { useGoalStore } from "@store/goal-store";
import { useAuth } from "@hooks/useAuth";
import { AvatarSVG } from "@components/ui/avatar-svg";

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View className="bg-dark-card rounded-2xl p-4 flex-1 items-center">
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-white font-bold text-xl">{value}</Text>
      <Text className="text-dark-muted text-xs mt-1">{label}</Text>
    </View>
  );
}

const MOOD_LABELS: Record<string, string> = {
  happy: "Heureux",
  tired: "Fatigué",
  thinking: "Réfléchit",
  proud: "Fier",
  sad: "Triste",
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const { mood, message, getRandomQuote } = useAvatarStore();
  const { goals, habits } = useGoalStore();

  const todayGoals = goals.filter((g) => {
    const today = new Date().toISOString().split("T")[0];
    return g.startDate <= today && g.endDate >= today && g.status !== "completed";
  });

  return (
    <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-16 pb-6">
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 10 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 400 }}
        >
          <Text className="text-2xl font-bold text-white">
            Bonjour {user?.name ?? "Thierry"} 👋
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 200 }}
          className="mt-8"
        >
          <Text className="text-dark-muted text-sm mb-4">Citation du jour</Text>
          <View className="bg-dark-card rounded-2xl p-5 border border-dark-border">
            <Text className="text-white text-base italic leading-6">
              "{getRandomQuote()}"
            </Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 400 }}
          className="mt-8"
        >
          <Text className="text-dark-muted text-sm mb-4">Ton avatar</Text>
          <View className="bg-dark-card rounded-2xl p-6 border border-dark-border flex-row items-center">
            <AvatarSVG mood={mood} size={72} />
            <View className="flex-1 ml-4">
              <Text className="text-white font-semibold text-lg">{MOOD_LABELS[mood]}</Text>
              <Text className="text-dark-muted text-sm mt-1">{message}</Text>
            </View>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 600 }}
          className="mt-8"
        >
          <Text className="text-dark-muted text-sm mb-4">Aujourd'hui</Text>
          <View className="flex-row gap-3">
            <StatCard label="Objectifs" value={String(todayGoals.length)} icon="🎯" />
            <StatCard label="Habitudes" value={String(habits.length)} icon="🔄" />
            <StatCard label="Focus" value="0h" icon="⏱️" />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 800 }}
          className="mt-8"
        >
          <Text className="text-dark-muted text-sm mb-4">Objectifs du jour</Text>
          {todayGoals.length === 0 ? (
            <View className="bg-dark-card rounded-2xl p-6 border border-dark-border items-center">
              <Text className="text-3xl mb-3">🎯</Text>
              <Text className="text-dark-muted text-center">
                Aucun objectif pour aujourd'hui.{"\n"}Crée-en un pour commencer !
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/goals/create")}
                className="bg-primary-500 rounded-xl px-6 py-3 mt-4 active:opacity-80"
              >
                <Text className="text-white font-medium">+ Nouvel objectif</Text>
              </Pressable>
            </View>
          ) : (
            todayGoals.map((goal) => (
              <Pressable
                key={goal.id}
                onPress={() => router.push(`/(tabs)/goals/${goal.id}`)}
                className="bg-dark-card rounded-2xl p-4 border border-dark-border mb-3 active:opacity-80"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-white font-medium flex-1">{goal.title}</Text>
                  <Text className="text-dark-muted text-sm">{goal.progression}%</Text>
                </View>
                <View className="bg-dark-surface rounded-full h-2 mt-3">
                  <View
                    className="bg-primary-500 rounded-full h-2"
                    style={{ width: `${goal.progression}%` }}
                  />
                </View>
              </Pressable>
            ))
          )}
        </MotiView>
      </View>
    </ScrollView>
  );
}
