import { create } from "zustand";
import type { AvatarMood } from "../types";
import { MOTIVATIONAL_QUOTES, AVATAR_MESSAGES } from "../constants";

interface AvatarState {
  mood: AvatarMood;
  message: string;
  setMood: (mood: AvatarMood) => void;
  getRandomQuote: () => string;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  mood: "happy",
  message: AVATAR_MESSAGES.happy[0],
  setMood: (mood) =>
    set({
      mood,
      message: AVATAR_MESSAGES[mood][Math.floor(Math.random() * AVATAR_MESSAGES[mood].length)],
    }),
  getRandomQuote: () =>
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
}));
