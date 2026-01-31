import React from "react";
import * as LucideIcons from "lucide-react-native";
import { COLORS } from "../../lib/theme";

export type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = COLORS.text,
  style,
}) => {
  const LucideIconComponent = LucideIcons[name] as React.ElementType;

  if (!LucideIconComponent) {
    console.warn(`Icon "${String(name)}" not found`);
    return null;
  }

  return <LucideIconComponent size={size} color={color} style={style} />;
};
