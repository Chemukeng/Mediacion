import React from "react";
import { View, Text, ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
  label: string;
  variant?: "success" | "warning" | "error" | "info" | "neutral" | "brand";
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    brand: "bg-brand-green/10 text-brand-green border-brand-green/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-brand-gold/10 text-brand-gold border-brand-gold/20",
    error: "bg-red-50 text-red-700 border-red-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const textStyles = {
    brand: "text-brand-green font-medium",
    success: "text-emerald-700 font-medium",
    warning: "text-brand-gold font-medium",
    error: "text-red-700 font-medium",
    info: "text-blue-700 font-medium",
    neutral: "text-gray-700 font-medium",
  };

  return (
    <View
      className={`px-2.5 py-0.5 rounded-full border self-start ${variantStyles[variant]} ${className}`}
      style={style}
      {...props}
    >
      <Text className={`text-xs ${textStyles[variant]}`}>{label}</Text>
    </View>
  );
};
