import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { habitsApi } from "../services/api";
import { useAuthStore } from "../store/auth-store";
import { useGoalStore } from "../store/goal-store";
import { calculateStreak } from "../utils/streaks";
import type { Habit } from "../types";
import type { CreateHabitFormData } from "../features/habits/validation";

export function useHabits() {
  const token = useAuthStore((s) => s.token)!;
  const { habits, setHabits, addHabit, removeHabit } = useGoalStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const data = await habitsApi.list(token) as Habit[];
      const enriched = data.map((h) => {
        const streaks = calculateStreak(h.completedDates);
        return { ...h, currentStreak: streaks.current, bestStreak: streaks.best };
      });
      setHabits(enriched);
      return enriched;
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateHabitFormData) => habitsApi.create(data, token) as Promise<Habit>,
    onSuccess: (habit) => {
      addHabit({ ...habit, currentStreak: 0, bestStreak: 0 });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => habitsApi.remove(id, token),
    onSuccess: (_void, id) => {
      removeHabit(id);
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const toggleTodayMutation = useMutation({
    mutationFn: async ({ id, completedDates }: { id: string; completedDates: string[] }) => {
      const today = new Date().toISOString().split("T")[0];
      const isCompleted = completedDates.includes(today);
      const newDates = isCompleted
        ? completedDates.filter((d) => d !== today)
        : [...completedDates, today];
      return habitsApi.update(id, { completedDates: newDates }, token) as Promise<Habit>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  return {
    habits,
    isLoading: query.isLoading,
    error: query.error,
    createHabit: createMutation.mutate,
    deleteHabit: deleteMutation.mutate,
    toggleToday: toggleTodayMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
