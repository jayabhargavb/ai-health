import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  useSharedValue, 
  withTiming,
  Extrapolation 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  titleSize?: 'small' | 'large';
  showShadow?: boolean;
  showBackButton?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onBackPress?: () => void;
  scrollY?: Animated.SharedValue<number>;
  style?: ViewStyle;
  testID?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  titleSize = 'large',
  showShadow = false,
  showBackButton = false,
  left, 
  right, 
  onBackPress,
  scrollY,
  style, 
  testID 
}) => {
  const insets = useSafeAreaInsets();
  const defaultScrollY = useSharedValue(0);
  const activeScrollY = scrollY || defaultScrollY;

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      activeScrollY.value,
      [0, 40],
      [0, 0.1],
      Extrapolation.CLAMP
    );
    
    return {
      shadowOpacity: showShadow ? shadowOpacity : 0,
      backgroundColor: theme.colors.background,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    // Only animate title if titleSize is large and scrollY is provided
    if (titleSize === 'large' && scrollY) {
      const fontSize = interpolate(
        activeScrollY.value,
        [0, 100],
        [theme.typography.h1.fontSize, theme.typography.h2.fontSize],
        Extrapolation.CLAMP
      );
      
      return {
        fontSize,
      };
    }
    
    return {};
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { paddingTop: insets.top },
        containerAnimatedStyle,
        style
      ]} 
      testID={testID} 
      accessibilityRole="header"
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <Pressable 
              style={styles.backButton} 
              onPress={onBackPress}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={theme.colors.text.primary} 
              />
            </Pressable>
          )}
          {left}
        </View>
        
        <Animated.Text 
          style={[
            styles.title, 
            titleSize === 'small' ? styles.titleSmall : styles.titleLarge,
            titleAnimatedStyle
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Animated.Text>
        
        {right && <View style={styles.rightContainer}>{right}</View>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontWeight: '700',
    color: theme.colors.text.primary,
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  titleLarge: {
    fontSize: theme.typography.h1.fontSize,
  },
  titleSmall: {
    fontSize: theme.typography.h2.fontSize,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
