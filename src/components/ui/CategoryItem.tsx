import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "./Icon";
import { COLORS, SPACING } from "../../lib/theme";
import { CategoryData } from "../../data/categories";

interface CategoryItemProps {
  category: CategoryData;
  isSelected?: boolean;
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

export function CategoryItem({
  category,
  isSelected = false,
  onPress,
  size = "medium",
}: CategoryItemProps) {
  const sizeConfig = {
    small: { container: 56, icon: 24, fontSize: 10 },
    medium: { container: 64, icon: 28, fontSize: 11 },
    large: { container: 72, icon: 32, fontSize: 12 },
  };

  const config = sizeConfig[size];

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.container,
          {
            width: config.container,
            height: config.container,
            backgroundColor: isSelected
              ? category.color
              : category.backgroundColor,
          },
          isSelected && styles.selectedContainer,
        ]}
      >
        <Icon
          name={category.icon as any}
          size={config.icon}
          color={isSelected ? COLORS.white : category.color}
        />
      </View>
      <Text
        style={[
          styles.label,
          { fontSize: config.fontSize },
          isSelected && styles.selectedLabel,
        ]}
        numberOfLines={1}
      >
        {category.displayName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginRight: SPACING.m,
  },
  container: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  selectedContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    color: COLORS.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedLabel: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
