import { z } from "zod";

export const goalCategoryEnum = z.enum(["work", "study", "health", "personal", "finance"]);
export const priorityEnum = z.enum(["low", "medium", "high"]);
export const goalStatusEnum = z.enum(["pending", "in_progress", "completed", "cancelled"]);

export const createGoalSchema = z.object({
  title: z.string().min(2, "2 caractères minimum").max(100),
  category: goalCategoryEnum,
  startDate: z.string().min(1, "Date requise"),
  endDate: z.string().min(1, "Date requise"),
  priority: priorityEnum,
  estimatedTime: z.number().min(1, "Minimum 1h").max(500),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
});

export const updateGoalSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  category: goalCategoryEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  priority: priorityEnum.optional(),
  estimatedTime: z.number().min(1).max(500).optional(),
  spentTime: z.number().min(0).optional(),
  progression: z.number().min(0).max(100).optional(),
  status: goalStatusEnum.optional(),
});

export type CreateGoalFormData = z.infer<typeof createGoalSchema>;
export type UpdateGoalFormData = z.infer<typeof updateGoalSchema>;
