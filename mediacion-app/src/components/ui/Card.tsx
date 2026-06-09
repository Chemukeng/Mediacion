import React from "react";
import { View, ViewProps, Text, TextProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = "", style, ...props }) => {
  return (
    <View
      className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm shadow-gray-100/50 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "", style, ...props }) => {
  return (
    <View className={`mb-3 flex-col ${className}`} style={style} {...props}>
      {children}
    </View>
  );
};

interface CardTitleProps extends TextProps {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = "", style, ...props }) => {
  return (
    <Text
      className={`text-lg font-bold text-brand-dark ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
};

interface CardDescriptionProps extends TextProps {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
  style,
  ...props
}) => {
  return (
    <Text
      className={`text-sm text-gray-500 mt-1 leading-relaxed ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = "", style, ...props }) => {
  return (
    <View className={`${className}`} style={style} {...props}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = "", style, ...props }) => {
  return (
    <View
      className={`mt-4 pt-4 border-t border-gray-50 flex-row items-center justify-end ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};
