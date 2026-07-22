import { Text, Pressable, ActivityIndicator, type PressableProps } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 active:opacity-80",
  secondary: "bg-dark-surface active:opacity-80",
  outline: "border border-dark-border active:opacity-80",
  ghost: "active:opacity-60",
};

const textClasses: Record<ButtonVariant, string> = {
  primary: "text-white font-semibold",
  secondary: "text-white font-medium",
  outline: "text-dark-muted font-medium",
  ghost: "text-primary-400 font-medium",
};

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "py-2 px-4 rounded-lg",
  md: "py-3 px-6 rounded-xl",
  lg: "py-4 px-8 rounded-2xl",
};

export function Button({
  title,
  variant = "primary",
  loading = false,
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={`${variantClasses[variant]} ${sizeClasses[size]} items-center flex-row justify-center gap-2 ${
        disabled ? "opacity-50" : ""
      }`}
      {...props}
    >
      {loading && <ActivityIndicator size="small" color="#fff" />}
      <Text className={`${textClasses[variant]} text-base`}>{title}</Text>
    </Pressable>
  );
}
