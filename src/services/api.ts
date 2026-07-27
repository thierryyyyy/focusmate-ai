import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  "https://focusmate-api.onrender.com/api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erreur réseau" }));
    throw new Error(error.message || "Erreur serveur");
  }

  return response.json();
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient<{ user: unknown; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  register: (name: string, email: string, password: string) =>
    apiClient<{ user: unknown; token: string }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),
};

export const goalsApi = {
  list: (token: string) =>
    apiClient<unknown[]>("/goals", { token }),
  create: (data: unknown, token: string) =>
    apiClient<unknown>("/goals", { method: "POST", body: data, token }),
  update: (id: string, data: unknown, token: string) =>
    apiClient<unknown>(`/goals/${id}`, { method: "PUT", body: data, token }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/goals/${id}`, { method: "DELETE", token }),
};

export const habitsApi = {
  list: (token: string) => apiClient<unknown[]>("/habits", { token }),
  create: (data: unknown, token: string) =>
    apiClient<unknown>("/habits", { method: "POST", body: data, token }),
  update: (id: string, data: unknown, token: string) =>
    apiClient<unknown>(`/habits/${id}`, { method: "PUT", body: data, token }),
  remove: (id: string, token: string) =>
    apiClient<void>(`/habits/${id}`, { method: "DELETE", token }),
};

export const aiApi = {
  chat: (message: string, context: unknown, token: string) =>
    apiClient<{ reply: string }>("/ai/chat", {
      method: "POST",
      body: { message, context },
      token,
    }),
};

export const activitiesApi = {
  list: (token: string) => apiClient<unknown[]>("/activities", { token }),
  create: (data: unknown, token: string) =>
    apiClient<unknown>("/activities", { method: "POST", body: data, token }),
};
