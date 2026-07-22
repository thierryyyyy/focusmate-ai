import { useEffect } from "react";
import { useGoalStore } from "../store/goal-store";
import {
  checkGoalReminders,
  checkHabitReminders,
} from "../services/notifications";

export function useNotifications() {
  const { goals, habits } = useGoalStore();

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
