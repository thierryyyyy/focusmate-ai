import type { Goal, Habit, Activity } from "../types";

export interface DailyStats {
  date: string;
  focusMinutes: number;
  goalsCompleted: number;
  habitsCompleted: number;
}

export interface WeeklyStats {
  days: DailyStats[];
  totalFocusMinutes: number;
  totalGoalsCompleted: number;
  avgHabitsCompletion: number;
  bestStreak: number;
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function getDayLabel(dateStr: string): string {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  return days[new Date(dateStr + "T12:00:00").getDay()];
}

export function computeWeeklyStats(
  goals: Goal[],
  habits: Habit[],
  activities: Activity[]
): WeeklyStats {
  const weekDates = getWeekDates();

  const days: DailyStats[] = weekDates.map((date) => {
    const dayActivities = activities.filter((a) => a.date === date);
    const focusMinutes = dayActivities.reduce((sum, a) => sum + a.duration, 0);

    const goalsCompleted = goals.filter(
      (g) => g.status === "completed" && g.updatedAt?.split("T")[0] === date
    ).length;

    const habitsCompleted = habits.filter((h) => h.completedDates.includes(date)).length;

    return { date, focusMinutes, goalsCompleted, habitsCompleted };
  });

  const totalFocusMinutes = days.reduce((sum, d) => sum + d.focusMinutes, 0);
  const totalGoalsCompleted = days.reduce((sum, d) => sum + d.goalsCompleted, 0);

  const totalPossibleHabits = habits.length * 7;
  const totalHabitChecks = habits.reduce((sum, h) => {
    return sum + h.completedDates.filter((d) => weekDates.includes(d)).length;
  }, 0);
  const avgHabitsCompletion = totalPossibleHabits > 0
    ? Math.round((totalHabitChecks / totalPossibleHabits) * 100)
    : 0;

  const bestStreak = habits.reduce((best, h) => Math.max(best, h.bestStreak), 0);

  return { days, totalFocusMinutes, totalGoalsCompleted, avgHabitsCompletion, bestStreak };
}
