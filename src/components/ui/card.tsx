import { View, Text, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <View className={`bg-dark-card rounded-2xl p-5 border border-dark-border`} {...props}>
      {children}
    </View>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="items-center py-8">
      <Text className="text-4xl mb-3">{icon}</Text>
      <Text className="text-white font-semibold text-lg mb-1">{title}</Text>
      <Text className="text-dark-muted text-center text-sm">{description}</Text>
      {action && <View className="mt-4">{action}</View>}
    </Card>
  );
}
