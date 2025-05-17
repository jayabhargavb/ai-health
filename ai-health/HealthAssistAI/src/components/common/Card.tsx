import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Platform } from 'react-native';
import { theme } from '../../constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'outlined' | 'elevated';
  onPress?: () => void;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'elevated', 
  onPress,
  testID 
}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { 
        damping: 20, 
        stiffness: 200 
      });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { 
        damping: 20, 
        stiffness: 200 
      });
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlined;
      case 'default':
        return styles.default;
      case 'elevated':
      default:
        return styles.elevated;
    }
  };

  const CardComponent = onPress ? Pressable : View;
  const cardProps = onPress ? {
    onPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    accessibilityRole: 'button'
  } : {};

  return (
    <Animated.View style={[animatedStyle, styles.container]}>
      <CardComponent
        style={[styles.card, getCardStyle(), style]}
        testID={testID}
        {...cardProps}
        accessibilityRole={onPress ? 'button' : 'summary'}
      >
        {children}
      </CardComponent>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
  },
  default: {
    backgroundColor: theme.colors.surface,
  },
});
