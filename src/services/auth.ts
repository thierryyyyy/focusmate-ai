import * as SecureStore from "expo-secure-store";
import { apiClient } from "./api";
import type { User } from "../types";

const TOKEN_KEY = "focusmate_token";
const USER_KEY = "focusmate_user";

interface AuthResponse {
  user: User;
  token: string;
}

const DEV_EMAIL = "dev@focusmate.app";
const DEV_PASSWORD = "focusmate2024";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (email === DEV_EMAIL && password === DEV_PASSWORD) {
      const user: User = {
        id: "dev-user-1",
        name: "FocusMate Dev",
        email: DEV_EMAIL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const token = "dev-token-fake-jwt";
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      return { user, token };
    }

    const res = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    await SecureStore.setItemAsync(TOKEN_KEY, res.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.user));
    return res;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    await SecureStore.setItemAsync(TOKEN_KEY, res.token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.user));
    return res;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  async getStoredAuth(): Promise<AuthResponse | null> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userStr = await SecureStore.getItemAsync(USER_KEY);
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
    return null;
  },
};
