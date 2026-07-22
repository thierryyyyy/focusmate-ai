import { z } from "zod";

export const habitFrequencyEnum = z.enum(["daily", "weekly"]);

export const createHabitSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50),
  icon: z.string().min(1, "L'icône est requise"),
  frequency: habitFrequencyEnum,
});

export type CreateHabitFormData = z.infer<typeof createHabitSchema>;
