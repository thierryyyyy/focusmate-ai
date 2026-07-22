import { useAuthStore } from "../../src/store/auth-store";
import { useGoalStore } from "../../src/store/goal-store";
import { useAvatarStore } from "../../src/store/avatar-store";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("sets auth correctly", () => {
    const user = { id: "1", name: "Test", email: "test@test.com", createdAt: "", updatedAt: "" };
    useAuthStore.getState().setAuth(user, "token123");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe("Test");
    expect(state.token).toBe("token123");
  });

  it("clears auth", () => {
    const user = { id: "1", name: "Test", email: "test@test.com", createdAt: "", updatedAt: "" };
    useAuthStore.getState().setAuth(user, "token123");
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe("goalStore", () => {
  beforeEach(() => {
    useGoalStore.getState().setGoals([]);
    useGoalStore.getState().setHabits([]);
  });

  it("adds and removes goals", () => {
    const goal = {
      id: "g1",
      userId: "1",
      title: "Test Goal",
      category: "work",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      priority: "high",
      status: "pending",
      estimatedTime: 10,
      spentTime: 0,
      progression: 0,
      createdAt: "",
      updatedAt: "",
    };

    useGoalStore.getState().addGoal(goal);
    expect(useGoalStore.getState().goals.length).toBe(1);

    useGoalStore.getState().removeGoal("g1");
    expect(useGoalStore.getState().goals.length).toBe(0);
  });

  it("updates a goal", () => {
    const goal = {
      id: "g1",
      userId: "1",
      title: "Original",
      category: "work",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      priority: "high",
      status: "pending",
      estimatedTime: 10,
      spentTime: 0,
      progression: 0,
      createdAt: "",
      updatedAt: "",
    };

    useGoalStore.getState().addGoal(goal);
    useGoalStore.getState().updateGoal("g1", { title: "Updated", progression: 50 });

    const updated = useGoalStore.getState().goals[0];
    expect(updated.title).toBe("Updated");
    expect(updated.progression).toBe(50);
  });
});

describe("avatarStore", () => {
  it("starts with happy mood", () => {
    const state = useAvatarStore.getState();
    expect(state.mood).toBe("happy");
    expect(state.message).toBeDefined();
  });

  it("changes mood and message", () => {
    useAvatarStore.getState().setMood("proud");
    const state = useAvatarStore.getState();
    expect(state.mood).toBe("proud");
    expect(typeof state.message).toBe("string");
  });

  it("returns a random quote", () => {
    const quote = useAvatarStore.getState().getRandomQuote();
    expect(typeof quote).toBe("string");
    expect(quote.length).toBeGreaterThan(0);
  });
});
