import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import { useAuth } from "@hooks/useAuth";
import { loginSchema, type LoginFormData } from "@features/auth/validation";
import { Input } from "@components/ui/input";

export default function LoginScreen() {
  const { login, isLoggingIn, loginError } = useAuth();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => router.replace("/(tabs)/dashboard"),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-20 pb-12 justify-center">
          <MotiView
            from={{ opacity: 0, transform: [{ translateY: 20 }] }}
            animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
            transition={{ duration: 500 }}
          >
            <Text className="text-3xl font-bold text-white mb-2">Re-bonjour 👋</Text>
            <Text className="text-dark-muted mb-8">Connecte-toi à ton espace</Text>

            {loginError && (
              <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                <Text className="text-red-400 text-sm">{loginError.message}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  label="Email"
                  placeholder="thierry@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  label="Mot de passe"
                  placeholder="••••••"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isLoggingIn}
              className="bg-primary-500 rounded-2xl py-4 items-center mt-4 active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">
                {isLoggingIn ? "Connexion..." : "Se connecter"}
              </Text>
            </Pressable>

            <Link href="/(auth)/register" asChild>
              <Pressable className="items-center mt-6">
                <Text className="text-dark-muted">
                  Pas de compte ? <Text className="text-primary-400">S'inscrire</Text>
                </Text>
              </Pressable>
            </Link>
          </MotiView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
