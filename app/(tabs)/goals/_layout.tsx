import { Stack } from "expo-router";

export default function GoalsTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f0f1a" },
      }}
    />
  );
}
