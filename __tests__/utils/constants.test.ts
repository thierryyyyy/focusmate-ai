import { MOTIVATIONAL_QUOTES, GOAL_CATEGORIES, AVATAR_MESSAGES } from "../../src/constants";

describe("constants", () => {
  describe("MOTIVATIONAL_QUOTES", () => {
    it("has at least 5 quotes", () => {
      expect(MOTIVATIONAL_QUOTES.length).toBeGreaterThanOrEqual(5);
    });

    it("all quotes are non-empty strings", () => {
      MOTIVATIONAL_QUOTES.forEach((q) => {
        expect(typeof q).toBe("string");
        expect(q.length).toBeGreaterThan(0);
      });
    });
  });

  describe("GOAL_CATEGORIES", () => {
    it("has 5 categories", () => {
      expect(GOAL_CATEGORIES.length).toBe(5);
    });

    it("each has value, label, and icon", () => {
      GOAL_CATEGORIES.forEach((c) => {
        expect(c.value).toBeDefined();
        expect(c.label).toBeDefined();
        expect(c.icon).toBeDefined();
      });
    });

    it("has unique values", () => {
      const values = GOAL_CATEGORIES.map((c) => c.value);
      expect(new Set(values).size).toBe(values.length);
    });
  });

  describe("AVATAR_MESSAGES", () => {
    it("has messages for all moods", () => {
      const moods = ["happy", "tired", "thinking", "proud", "sad"];
      moods.forEach((mood) => {
        expect(AVATAR_MESSAGES[mood]).toBeDefined();
        expect(AVATAR_MESSAGES[mood].length).toBeGreaterThan(0);
      });
    });
  });
});
