import { createHabitSchema } from "../../src/features/habits/validation";

describe("createHabitSchema", () => {
  it("accepts valid habit data", () => {
    const result = createHabitSchema.safeParse({
      name: "Lecture",
      icon: "📚",
      frequency: "daily",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createHabitSchema.safeParse({
      name: "",
      icon: "📚",
      frequency: "daily",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid frequency", () => {
    const result = createHabitSchema.safeParse({
      name: "Lecture",
      icon: "📚",
      frequency: "hourly",
    });
    expect(result.success).toBe(false);
  });

  it("accepts weekly frequency", () => {
    const result = createHabitSchema.safeParse({
      name: "Gym",
      icon: "💪",
      frequency: "weekly",
    });
    expect(result.success).toBe(true);
  });
});
