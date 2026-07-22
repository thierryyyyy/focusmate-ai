import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MotiView } from "moti";
import { useAuth } from "@hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@features/auth/validation";

function Input({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.ComponentProps<typeof import("react-native").TextInput>) {
  return (
    <View className="mb-4">
      <Text className="text-dark-muted text-sm mb-2">{label}</Text>
      <TextInput
        className="bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-white text-base"
        placeholderTextColor="#8888a0"
        {...props}
      />
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  );
}

import { TextInput } from "react-native";

export default function RegisterScreen() {
  const { register, isRegistering, registerError } = useAuth();
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onSuccess: () => router.replace("/(tabs)/dashboard"),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-dark-bg" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-20 pb-12">
          <MotiView
            from={{ opacity: 0, transform: [{ translateY: 20 }] }}
            animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
            transition={{ duration: 500 }}
          >
            <Text className="text-3xl font-bold text-white mb-2">Crée ton compte</Text>
            <Text className="text-dark-muted mb-8">Rejoins FocusMate AI</Text>

            {registerError && (
              <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                <Text className="text-red-400 text-sm">{registerError.message}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  label="Nom"
                  placeholder="Thierry"
                  autoCapitalize="words"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Input
                  label="Confirmer le mot de passe"
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
              disabled={isRegistering}
              className="bg-primary-500 rounded-2xl py-4 items-center mt-4 active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">
                {isRegistering ? "Création..." : "Créer mon compte"}
              </Text>
            </Pressable>

            <Link href="/(auth)/login" asChild>
              <Pressable className="items-center mt-6">
                <Text className="text-dark-muted">
                  Déjà un compte ? <Text className="text-primary-400">Se connecter</Text>
                </Text>
              </Pressable>
            </Link>
          </MotiView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
