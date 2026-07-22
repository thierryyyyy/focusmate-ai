import { Alert } from "react-native";
import type { Goal, Habit } from "../types";

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  return true;
}

export function showLocalNotification(title: string, body: string) {
  Alert.alert(title, body, [{ text: "OK" }]);
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
