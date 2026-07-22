import { calculateStreak, isCompletedToday } from "../../src/utils/streaks";

function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

describe("calculateStreak", () => {
  const today = localDateStr(new Date());

  it("returns 0 for empty dates", () => {
    const result = calculateStreak([]);
    expect(result.current).toBe(0);
    expect(result.best).toBe(0);
  });

  it("returns 1 for only today", () => {
    const result = calculateStreak([today]);
    expect(result.current).toBe(1);
    expect(result.best).toBe(1);
  });

  it("calculates consecutive best streak", () => {
    const d1 = new Date();
    d1.setDate(d1.getDate() - 2);
    const d2 = new Date();
    d2.setDate(d2.getDate() - 1);

    const dates = [today, localDateStr(d2), localDateStr(d1)];
    const result = calculateStreak(dates);
    expect(result.best).toBe(3);
  });

  it("handles non-consecutive dates", () => {
    const d1 = new Date();
    d1.setDate(d1.getDate() - 5);

    const dates = [today, localDateStr(d1)];
    const result = calculateStreak(dates);
    expect(result.best).toBe(1);
  });

  it("deduplicates dates", () => {
    const result = calculateStreak([today, today, today]);
    expect(result.best).toBe(1);
  });
});

describe("isCompletedToday", () => {
  const today = localDateStr(new Date());

  it("returns true if today is in completedDates", () => {
    expect(isCompletedToday([today])).toBe(true);
  });

  it("returns false if today is not in completedDates", () => {
    expect(isCompletedToday(["2020-01-01"])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(isCompletedToday([])).toBe(false);
  });
});
