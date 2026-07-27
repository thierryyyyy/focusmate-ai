import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "../services/api";
import { useAuthStore } from "../store/auth-store";
import { useGoalStore } from "../store/goal-store";
import { celebrateGoalCompletion } from "../services/notifications";
import type { Goal, GoalStatus } from "../types";
import type { CreateGoalFormData, UpdateGoalFormData } from "../features/goals/validation";

export function useGoals() {
  const token = useAuthStore((s) => s.token)!;
  const { goals, setGoals, addGoal, updateGoal, removeGoal } = useGoalStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const data = await goalsApi.list(token) as Goal[];
      setGoals(data);
      return data;
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGoalFormData) => goalsApi.create(data, token) as Promise<Goal>,
    onSuccess: (goal) => {
      addGoal(goal);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalFormData }) =>
      goalsApi.update(id, data, token) as Promise<Goal>,
    onSuccess: (goal) => {
      updateGoal(goal.id, goal);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => goalsApi.remove(id, token),
    onSuccess: (_void, id) => {
      removeGoal(id);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) =>
      goalsApi.update(id, { status: "completed" as GoalStatus, progression: 100 }, token) as Promise<Goal>,
    onSuccess: (goal) => {
      updateGoal(goal.id, goal);
      celebrateGoalCompletion(goal.title);
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  return {
    goals,
    isLoading: query.isLoading,
    error: query.error,
    createGoal: createMutation.mutate,
    updateGoal: updateMutation.mutate,
    deleteGoal: deleteMutation.mutate,
    completeGoal: completeMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
}
