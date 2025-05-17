import React, { useState } from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  Text, 
  ViewStyle, 
  Pressable,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData
} from 'react-native';
import { theme } from '../../constants/theme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  helperText?: string;
  style?: ViewStyle;
  testID?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  error,
  helperText,
  style,
  testID,
  rightIcon,
  leftIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedBorderColor = useSharedValue(0);
  const inputRef = React.useRef<TextInput>(null);

  const borderColorStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        animatedBorderColor.value,
        [0, 1, 2],
        [theme.colors.border.light, theme.colors.primary, theme.colors.error]
      )
    };
  });

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    animatedBorderColor.value = withTiming(1, { duration: 200 });
    rest.onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    animatedBorderColor.value = withTiming(error ? 2 : 0, { duration: 200 });
    rest.onBlur?.(e);
  };

  React.useEffect(() => {
    if (error) {
      animatedBorderColor.value = withTiming(2, { duration: 200 });
    } else {
      animatedBorderColor.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
    }
  }, [error, isFocused]);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          isFocused && styles.focusedLabel,
          error && styles.errorLabel
        ]}>
          {label}
        </Text>
      )}
      <Pressable onPress={() => inputRef.current?.focus()}>
        <Animated.View style={[styles.inputContainer, borderColorStyle]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.tertiary}
            secureTextEntry={secureTextEntry}
            testID={testID}
            accessibilityLabel={label || placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </Animated.View>
      </Pressable>
      
      {(error || helperText) && (
        <Text style={[
          styles.helperText, 
          error ? styles.errorText : {}
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    minHeight: 50,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  focusedLabel: {
    color: theme.colors.primary,
  },
  errorLabel: {
    color: theme.colors.error,
  },
  helperText: {
    fontSize: theme.typography.small.fontSize,
    marginTop: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: theme.colors.error,
  },
  leftIcon: {
    paddingLeft: theme.spacing.md,
  },
  rightIcon: {
    paddingRight: theme.spacing.md,
  },
});
