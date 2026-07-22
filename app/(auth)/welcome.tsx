import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { MotiView } from "moti";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-dark-bg px-8 justify-between py-20">
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800, delay: 200 }}
        className="items-center mt-16"
      >
        <Text className="text-7xl mb-6">🧠</Text>
        <Text className="text-4xl font-bold text-white text-center leading-tight">
          FocusMate{"\n"}<Text className="text-primary-400">AI</Text>
        </Text>
        <Text className="text-dark-muted text-center mt-4 text-lg leading-6">
          Ton coach personnel anti-procrastination.{"\n"}Accompagne-toi avec intelligence.
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800, delay: 600 }}
        className="gap-4"
      >
        <Link href="/(auth)/register" asChild>
          <Pressable className="bg-primary-500 rounded-2xl py-4 items-center active:opacity-80">
            <Text className="text-white font-semibold text-lg">Commencer</Text>
          </Pressable>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Pressable className="border border-dark-border rounded-2xl py-4 items-center active:opacity-80">
            <Text className="text-dark-muted font-medium text-lg">J'ai déjà un compte</Text>
          </Pressable>
        </Link>
      </MotiView>
    </View>
  );
}
