import { createGoalSchema } from "../../src/features/goals/validation";

describe("createGoalSchema", () => {
  const validGoal = {
    title: "Terminer le projet",
    category: "work" as const,
    startDate: "2026-07-22",
    endDate: "2026-08-22",
    priority: "high" as const,
    estimatedTime: 10,
  };

  it("accepts valid goal data", () => {
    const result = createGoalSchema.safeParse(validGoal);
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createGoalSchema.safeParse({ ...validGoal, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = createGoalSchema.safeParse({ ...validGoal, category: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects end date before start date", () => {
    const result = createGoalSchema.safeParse({
      ...validGoal,
      startDate: "2026-08-22",
      endDate: "2026-07-22",
    });
    expect(result.success).toBe(false);
  });

  it("rejects estimated time < 1", () => {
    const result = createGoalSchema.safeParse({ ...validGoal, estimatedTime: 0 });
    expect(result.success).toBe(false);
  });
});
