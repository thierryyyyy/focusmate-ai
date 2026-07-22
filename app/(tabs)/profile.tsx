import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useAuth } from "@hooks/useAuth";
import { useGoalStore } from "@store/goal-store";
import { useStats } from "@hooks/useStats";
import { AvatarSVG } from "@components/ui/avatar-svg";
import { useAvatarStore } from "@store/avatar-store";

function SettingRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-dark-border active:opacity-70"
    >
      <Text className="text-xl mr-4">{icon}</Text>
      <Text className={`flex-1 text-base ${danger ? "text-red-400" : "text-white"}`}>
        {label}
      </Text>
      <Text className="text-dark-muted">→</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { goals, habits } = useGoalStore();
  const { mood } = useAvatarStore();
  const stats = useStats();

  const handleLogout = () => {
    Alert.alert("Se déconnecter ?", "Tu devras te reconnecter.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-16 pb-6">
        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 10 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 400 }}
          className="items-center mb-8"
        >
          <AvatarSVG mood={mood} size={96} />
          <Text className="text-xl font-bold text-white mt-4">{user?.name ?? "Utilisateur"}</Text>
          <Text className="text-dark-muted text-sm">{user?.email ?? "email@example.com"}</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 200 }}
        >
          <Text className="text-dark-muted text-sm mb-3 font-medium">Résumé</Text>
          <View className="bg-dark-card rounded-2xl p-5 border border-dark-border flex-row justify-around mb-6">
            <View className="items-center">
              <Text className="text-white font-bold text-xl">{stats.totalGoals}</Text>
              <Text className="text-dark-muted text-xs mt-1">Objectifs</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-xl">{stats.totalHabits}</Text>
              <Text className="text-dark-muted text-xs mt-1">Habitudes</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-xl">{stats.totalFocusHours}h</Text>
              <Text className="text-dark-muted text-xs mt-1">Focus</Text>
            </View>
            <View className="items-center">
              <Text className="text-primary-400 font-bold text-xl">{stats.completionRate}%</Text>
              <Text className="text-dark-muted text-xs mt-1">Réussite</Text>
            </View>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 400 }}
        >
          <Text className="text-dark-muted text-sm mb-3 font-medium">Paramètres</Text>
          <View className="bg-dark-card rounded-2xl px-4 border border-dark-border">
            <SettingRow icon="👤" label="Modifier le profil" onPress={() => {}} />
            <SettingRow icon="🔔" label="Notifications" onPress={() => {}} />
            <SettingRow icon="🎨" label="Apparence" onPress={() => {}} />
            <SettingRow icon="📊" label="Exporter les données" onPress={() => {}} />
            <SettingRow icon="❓" label="Aide & Support" onPress={() => {}} />
            <SettingRow icon="🚪" label="Se déconnecter" onPress={handleLogout} danger />
          </View>
        </MotiView>
      </View>
    </ScrollView>
  );
}
