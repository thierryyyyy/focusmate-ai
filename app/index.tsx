import { Redirect } from "expo-router";
import { useAuthStore } from "@store/auth-store";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Redirect href="/(tabs)/dashboard" /> : <Redirect href="/(auth)/welcome" />;
}
