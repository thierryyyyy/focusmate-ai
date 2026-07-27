import { useEffect } from "react";
import { useGoalStore } from "../store/goal-store";
import {
  requestNotificationPermissions,
  checkGoalReminders,
  checkHabitReminders,
} from "../services/notifications";

let permissionsRequested = false;

export function useNotifications() {
  const { goals, habits } = useGoalStore();

  useEffect(() => {
    if (!permissionsRequested) {
      permissionsRequested = true;
      requestNotificationPermissions();
    }
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      checkGoalReminders(goals);
    }
  }, [goals]);

  useEffect(() => {
    if (habits.length > 0) {
      checkHabitReminders(habits);
    }
  }, [habits]);
}
