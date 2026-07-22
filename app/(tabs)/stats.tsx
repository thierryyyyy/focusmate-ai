import { View, Text, ScrollView, Dimensions } from "react-native";
import { MotiView } from "moti";
import { useStats } from "@hooks/useStats";
import { Card } from "@components/ui/card";

const CHART_WIDTH = Dimensions.get("window").width - 48;

function StatBlock({ icon, label, value, color = "#7c4dff" }: {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <View className="bg-dark-card rounded-2xl p-4 border border-dark-border flex-1 items-center">
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-xl font-bold" style={{ color }}>{value}</Text>
      <Text className="text-dark-muted text-xs mt-1">{label}</Text>
    </View>
  );
}

function SimpleBarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <View className="flex-row items-end justify-between" style={{ height: 120 }}>
      {data.map((value, i) => (
        <View key={i} className="items-center flex-1 mx-0.5">
          <View
            className="bg-primary-500/80 rounded-t-lg w-full max-w-[24px]"
            style={{ height: Math.max((value / max) * 100, 4) }}
          />
          <Text className="text-dark-muted text-[10px] mt-1">{labels[i]}</Text>
        </View>
      ))}
    </View>
  );
}

function DonutPlaceholder({ percentage, label }: { percentage: number; label: string }) {
  return (
    <View className="items-center">
      <View className="w-24 h-24 rounded-full border-[6px] border-dark-surface items-center justify-center"
        style={{ borderColor: percentage > 50 ? "#7c4dff" : "#2d2d50" }}
      >
        <Text className="text-2xl font-bold text-white">{percentage}%</Text>
      </View>
      <Text className="text-dark-muted text-xs mt-2">{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const stats = useStats();

  const dayLabels = stats.days.map((d) => {
    const days = ["D", "L", "M", "M", "J", "V", "S"];
    return days[new Date(d.date + "T12:00:00").getDay()];
  });

  const focusData = stats.days.map((d) => d.focusMinutes);
  const habitsData = stats.days.map((d) => d.habitsCompleted);

  return (
    <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-16 pb-6">
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 10 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 400 }}
        >
          <Text className="text-2xl font-bold text-white">Statistiques 📊</Text>
          <Text className="text-dark-muted text-sm mt-1">Ta progression cette semaine</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 200 }}
          className="mt-6"
        >
          <View className="flex-row gap-3 mb-4">
            <StatBlock icon="⏱️" label="Focus" value={`${stats.totalFocusHours}h`} />
            <StatBlock icon="🎯" label="Objectifs" value={stats.totalGoalsCompleted} />
            <StatBlock icon="🔥" label="Streak" value={stats.bestStreak} color="#ff5252" />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 400 }}
          className="mt-2"
        >
          <Card className="mb-4">
            <Text className="text-white font-semibold mb-4">Temps de focus (min)</Text>
            <SimpleBarChart data={focusData} labels={dayLabels} />
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 500 }}
        >
          <Card className="mb-4">
            <Text className="text-white font-semibold mb-4">Habitudes complétées</Text>
            <SimpleBarChart data={habitsData} labels={dayLabels} />
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 600 }}
        >
          <Card>
            <Text className="text-white font-semibold mb-4">Taux de réussite</Text>
            <View className="flex-row justify-around">
              <DonutPlaceholder percentage={stats.completionRate} label="Objectifs" />
              <DonutPlaceholder percentage={stats.avgHabitsCompletion} label="Habitudes" />
            </View>
          </Card>
        </MotiView>
      </View>
    </ScrollView>
  );
}
