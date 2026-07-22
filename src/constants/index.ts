export const COLORS = {
  primary: {
    50: '#f3f0ff',
    100: '#e9e3ff',
    200: '#d4c9ff',
    300: '#b5a0ff',
    400: '#9370ff',
    500: '#7c4dff',
    600: '#6a2ee0',
    700: '#5a22b8',
    800: '#4a1c94',
    900: '#3d1a78',
  },
  accent: {
    500: '#00bcd4',
  },
  dark: {
    bg: '#0f0f1a',
    card: '#1a1a2e',
    surface: '#222240',
    border: '#2d2d50',
    text: '#e8e8f0',
    muted: '#8888a0',
  },
  light: {
    bg: '#f8f9fc',
    card: '#ffffff',
    surface: '#f0f1f5',
    border: '#e0e2ea',
    text: '#1a1a2e',
    muted: '#6b7280',
  },
};

export const GOAL_CATEGORIES = [
  { value: "work" as const, label: "Travail", icon: "💼" },
  { value: "study" as const, label: "Étude", icon: "📚" },
  { value: "health" as const, label: "Santé", icon: "💪" },
  { value: "personal" as const, label: "Personnel", icon: "🌟" },
  { value: "finance" as const, label: "Finance", icon: "💰" },
];

export const PRIORITIES = [
  { value: "low" as const, label: "Basse" },
  { value: "medium" as const, label: "Moyenne" },
  { value: "high" as const, label: "Haute" },
];

export const MOTIVATIONAL_QUOTES = [
  "Chaque pas compte. Continue.",
  "La discipline est la clé du succès.",
  "Ne remets pas à demain ce que tu peux faire aujourd'hui.",
  "Tu es plus fort que tu ne le penses.",
  "La constance bat le talent.",
  "Aujourd'hui est un bon jour pour commencer.",
  "Le succès est la somme des petits efforts répétés chaque jour.",
  "Crois en toi, le reste suivra.",
  "L'action est la clé de tout progrès.",
  "Un jour à la fois.",
];

export const AVATAR_MESSAGES: Record<string, string[]> = {
  happy: ["Je suis content de te voir !", "On fait de bonnes choses ensemble !"],
  tired: ["Peut-être un petit repos ?", "Tu as bien travaillé !"],
  thinking: ["Hmm, interesting...", "Laisse-moi réfléchir..."],
  proud: ["Je suis fier de toi !", "Bravo, tu progresses !"],
  sad: ["Ne t'inquiète pas, on va y arriver.", "C'est normal d'avoir des bas."],
};
