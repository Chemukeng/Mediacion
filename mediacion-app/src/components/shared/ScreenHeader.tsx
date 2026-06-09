import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
  onBackPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 12) }}
      className="bg-brand-green px-4 pb-4"
    >
      <View className="flex-row items-center justify-between h-12">
        <View className="flex-row items-center flex-1">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBack}
              className="mr-3 w-10 h-10 items-center justify-center rounded-full bg-brand-green-light active:opacity-85"
            >
              <Text className="text-brand-cream text-xl font-bold">←</Text>
            </TouchableOpacity>
          )}

          <View className="flex-1 justify-center">
            <Text
              numberOfLines={1}
              className="text-lg font-bold text-brand-cream tracking-tight"
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                numberOfLines={1}
                className="text-xs text-brand-cream/70 font-medium mt-0.5"
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightAction && <View className="ml-3">{rightAction}</View>}
      </View>
    </View>
  );
};
