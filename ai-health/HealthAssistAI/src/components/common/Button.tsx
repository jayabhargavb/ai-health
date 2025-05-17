import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle,
  View 
} from 'react-native';
import { theme } from '../../constants/theme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type TextSizeKey = 'textSM' | 'textMD' | 'textLG';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  testID,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getBackground = () => {
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'secondary') return theme.colors.secondary;
    if (variant === 'outline') return 'transparent';
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'primary') return theme.colors.text.inverse;
    if (variant === 'secondary') return theme.colors.text.inverse;
    if (variant === 'outline') return theme.colors.primary;
    return theme.colors.primary;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    return 'transparent';
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 200 });
  };

  // Convert size to corresponding text size style key
  const getTextSizeKey = (size: ButtonSize): TextSizeKey => {
    switch(size) {
      case 'sm': return 'textSM';
      case 'md': return 'textMD';
      case 'lg': return 'textLG';
      default: return 'textMD';
    }
  };

  return (
    <Animated.View style={[
      fullWidth && styles.fullWidth,
      animatedStyle,
      style
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          styles[size],
          { 
            backgroundColor: getBackground(), 
            borderColor: getBorderColor(),
            borderWidth: variant === 'outline' ? 1.5 : 0,
          },
          (disabled || loading) && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={disabled || loading}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size={size === 'sm' ? 'small' : 'small'} />
        ) : (
          <View style={styles.contentContainer}>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}
            <Text 
              style={[
                styles.text, 
                styles[getTextSizeKey(size)],
                { color: getTextColor() }
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    ...theme.shadows.sm,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: { 
    paddingVertical: theme.spacing.xs, 
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
    borderRadius: theme.borderRadius.sm,
  },
  md: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  lg: { 
    paddingVertical: theme.spacing.md, 
    paddingHorizontal: theme.spacing.xl,
    minHeight: 52,
  },
  disabled: { 
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSM: {
    fontSize: theme.typography.caption.fontSize,
  },
  textMD: {
    fontSize: theme.typography.body.fontSize,
  },
  textLG: {
    fontSize: theme.typography.h3.fontSize,
  },
  iconLeft: {
    marginRight: theme.spacing.xs,
  },
  iconRight: {
    marginLeft: theme.spacing.xs,
  },
});
