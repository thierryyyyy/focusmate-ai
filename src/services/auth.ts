import * as SecureStore from "expo-secure-store";
import { apiClient } from "./api";
import type { User } from "../types";

const TOKEN_KEY = "focusmate_token";
const USER_KEY = "focusmate_user";

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
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
