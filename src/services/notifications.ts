import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Goal, Habit } from "../types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Rappels",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

export async function showLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}

export function checkGoalReminders(goals: Goal[]) {
  const today = getTodayStr();
  const inactiveGoals = goals.filter(
    (g) => g.status === "in_progress" && g.startDate <= today && g.updatedAt?.split("T")[0] !== today
  );
  if (inactiveGoals.length > 0) {
    showLocalNotification(
      "Objectifs en attente",
      `Tu as ${inactiveGoals.length} objectif${inactiveGoals.length > 1 ? "s" : ""} en cours. Fais un pas aujourd'hui !`
    );
  }
}

export function checkHabitReminders(habits: Habit[]) {
  const today = getTodayStr();
  const incompleteHabits = habits.filter(
    (h) => h.frequency === "daily" && !h.completedDates.includes(today)
  );
  if (incompleteHabits.length > 0) {
    showLocalNotification(
      "Habitudes du jour",
      `${incompleteHabits.length} habitude${incompleteHabits.length > 1 ? "s" : ""} en attente. Garde ta série !`
    );
  }
}

export function celebrateGoalCompletion(goalTitle: string) {
  showLocalNotification(
    "Bravo !",
    `Tu as terminé "${goalTitle}" ! Continue comme ça, tu es sur la bonne voie.`
  );
}
