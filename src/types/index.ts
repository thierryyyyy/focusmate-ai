export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: GoalCategory;
  startDate: string;
  endDate: string;
  priority: Priority;
  estimatedTime: number;
  spentTime: number;
  progression: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  frequency: HabitFrequency;
  currentStreak: number;
  bestStreak: number;
  completedDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  goalId?: string;
  habitId?: string;
  type: ActivityType;
  duration: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export type GoalCategory = "work" | "study" | "health" | "personal" | "finance";
export type GoalStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type Priority = "low" | "medium" | "high";
export type HabitFrequency = "daily" | "weekly";
export type ActivityType = "goal" | "habit" | "focus";

export type AvatarMood = "happy" | "tired" | "thinking" | "proud" | "sad";

export interface Avatar {
  mood: AvatarMood;
  message: string;
  lastUpdated: string;
}

export interface Stats {
  totalGoalsCompleted: number;
  totalFocusTime: number;
  currentStreak: number;
  weeklyProgression: number[];
  habitsCompletion: number;
}
