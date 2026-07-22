import { TextInput, View, Text, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-dark-muted text-sm mb-2">{label}</Text>}
      <TextInput
        className="bg-dark-surface border border-dark-border rounded-xl px-4 py-4 text-white text-base"
        placeholderTextColor="#8888a0"
        {...props}
      />
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  );
}
