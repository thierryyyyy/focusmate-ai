import { View, Text, type ViewProps } from "react-native";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, right }: PageHeaderProps) {
  return (
    <View className="flex-row justify-between items-start mb-6">
      <View className="flex-1">
        <Text className="text-2xl font-bold text-white">{title}</Text>
        {subtitle && <Text className="text-dark-muted text-sm mt-1">{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}
