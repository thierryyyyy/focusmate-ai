import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGoalStore } from "../store/goal-store";
import { useAuthStore } from "../store/auth-store";
import { activitiesApi } from "../services/api";
import { computeWeeklyStats } from "../services/stats";
import type { Activity } from "../types";

export function useStats() {
  const { goals, habits } = useGoalStore();
  const token = useAuthStore((s) => s.token)!;

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const data = await activitiesApi.list(token) as Activity[];
      return data;
    },
    enabled: !!token,
  });

  const stats = useMemo(
    () => computeWeeklyStats(goals, habits, activities),
    [goals, habits, activities]
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
