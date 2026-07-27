import { View, Text, ScrollView, Pressable, Alert, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { MotiView } from "moti";
import { useAuth } from "@hooks/useAuth";
import { useGoalStore } from "@store/goal-store";
import { useStats } from "@hooks/useStats";
import { AvatarSVG } from "@components/ui/avatar-svg";
import { useAvatarStore } from "@store/avatar-store";
import { Button } from "@components/ui/button";

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
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? "");

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

  const handleExportData = () => {
    const data = {
      user: { name: user?.name, email: user?.email },
      goals: goals.length,
      habits: habits.length,
      stats: {
        completionRate: stats.completionRate,
        totalFocusHours: stats.totalFocusHours,
      },
    };
    Alert.alert("Données exportées", JSON.stringify(data, null, 2));
  };

  const handleHelp = () => {
    Alert.alert(
      "Aide & Support",
      "FocusMate AI v1.0.0\n\nUn coach personnel anti-procrastination.\n\nPour toute question, contacte-nous à support@focusmate.ai"
    );
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

        {editingProfile && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 300 }}
            className="bg-dark-card rounded-2xl p-4 border border-dark-border mb-4"
          >
            <Text className="text-white font-semibold mb-3">Modifier le profil</Text>
            <TextInput
              className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white text-base mb-3"
              value={profileName}
              onChangeText={setProfileName}
              placeholder="Ton nom"
              placeholderTextColor="#8888a0"
            />
            <View className="flex-row gap-2">
              <Button
                title="Sauvegarder"
                onPress={() => {
                  Alert.alert("Profil mis à jour", `Nom: ${profileName}`);
                  setEditingProfile(false);
                }}
                size="sm"
              />
              <Button
                title="Annuler"
                onPress={() => setEditingProfile(false)}
                variant="outline"
                size="sm"
              />
            </View>
          </MotiView>
        )}

        <MotiView
          from={{ opacity: 0, transform: [{ translateY: 15 }] }}
          animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
          transition={{ duration: 500, delay: 400 }}
        >
          <Text className="text-dark-muted text-sm mb-3 font-medium">Paramètres</Text>
          <View className="bg-dark-card rounded-2xl px-4 border border-dark-border">
            <SettingRow icon="👤" label="Modifier le profil" onPress={() => setEditingProfile(!editingProfile)} />
            <SettingRow
              icon="🔔"
              label="Notifications"
              onPress={() =>
                Alert.alert("Notifications", "Les notifications push seront bientôt disponibles.", [
                  { text: "OK" },
                ])
              }
            />
            <SettingRow
              icon="🎨"
              label="Apparence"
              onPress={() =>
                Alert.alert("Apparence", "Le mode clair sera bientôt disponible.", [{ text: "OK" }])
              }
            />
            <SettingRow icon="📊" label="Exporter les données" onPress={handleExportData} />
            <SettingRow icon="❓" label="Aide & Support" onPress={handleHelp} />
            <SettingRow icon="🚪" label="Se déconnecter" onPress={handleLogout} danger />
          </View>
        </MotiView>
      </View>
    </ScrollView>
  );
}
