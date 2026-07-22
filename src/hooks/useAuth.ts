import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";
import { authService } from "../services/auth";
import type { LoginFormData, RegisterFormData } from "../features/auth/validation";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    authService.getStoredAuth().then((stored) => {
      if (stored) {
        setAuth(stored.user, stored.token);
      }
      setIsReady(true);
    });
  }, []);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data.email, data.password),
    onSuccess: (res) => setAuth(res.user, res.token),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register(data.name, data.email, data.password),
    onSuccess: (res) => setAuth(res.user, res.token),
  });

  const logout = async () => {
    await authService.logout();
    clearAuth();
  };

  return {
    user,
    token,
    isAuthenticated,
    isReady,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
