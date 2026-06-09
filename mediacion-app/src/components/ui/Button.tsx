import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  style,
  ...props
}) => {
  // Styles for different variants
  const variantStyles = {
    primary: "bg-brand-green border-brand-green",
    secondary: "bg-brand-gold border-brand-gold",
    outline: "bg-transparent border border-brand-green",
    ghost: "bg-transparent border-transparent",
  };

  const textStyles = {
    primary: "text-brand-cream font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-brand-green font-semibold",
    ghost: "text-brand-dark font-semibold",
  };

  // Styles for sizes
  const sizeStyles = {
    sm: "py-2 px-4 rounded-lg",
    md: "py-3.5 px-6 rounded-xl",
    lg: "py-4 px-8 rounded-2xl",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Combined styles
  const isButtonDisabled = disabled || loading;
  const opacityStyle = isButtonDisabled ? "opacity-50" : "active:opacity-80";

  return (
    <TouchableOpacity
      disabled={isButtonDisabled}
      className={`flex-row items-center justify-center border ${variantStyles[variant]} ${sizeStyles[size]} ${opacityStyle} ${className}`}
      style={style}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost" ? "#1a3e31" : "#fbf9f4"
          }
          size="small"
          className="mr-2"
        />
      ) : leftIcon ? (
        <View className="mr-2">{leftIcon}</View>
      ) : null}

      <Text className={`${textStyles[variant]} ${textSizeStyles[size]} text-center`}>
        {label}
      </Text>

      {!loading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
};
