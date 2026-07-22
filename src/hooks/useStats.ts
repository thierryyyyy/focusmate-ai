import { useMemo } from "react";
import { useGoalStore } from "../store/goal-store";
import { computeWeeklyStats } from "../services/stats";
import type { Activity } from "../types";

export function useStats() {
  const { goals, habits } = useGoalStore();

  const stats = useMemo(
    () => computeWeeklyStats(goals, habits, [] as Activity[]),
    [goals, habits]
  );

  const completionRate = useMemo(() => {
    if (goals.length === 0) return 0;
    return Math.round((goals.filter((g) => g.status === "completed").length / goals.length) * 100);
  }, [goals]);

  const totalFocusHours = useMemo(() => {
    return Math.round(stats.totalFocusMinutes / 60 * 10) / 10;
  }, [stats.totalFocusMinutes]);

  return {
    ...stats,
    completionRate,
    totalFocusHours,
    totalGoals: goals.length,
    completedGoals: goals.filter((g) => g.status === "completed").length,
    totalHabits: habits.length,
  };
}
