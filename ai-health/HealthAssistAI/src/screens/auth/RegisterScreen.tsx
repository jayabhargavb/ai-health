import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const formShake = useSharedValue(0);

  const handleRegister = () => {
    if (!email.trim() || !password) {
      setFormError('Email and password are required');
      // Shake animation for error
      formShake.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      formShake.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      return;
    }
    
    setFormError(null);
    register({ email: email.trim(), password });
  };

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: formShake.value }]
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={styles.logoContainer}
            entering={FadeInDown.delay(200).duration(800)}
          >
            <View style={styles.logoBackground}>
              <Ionicons name="person-add" size={50} color={theme.colors.primary} />
            </View>
            <Text style={styles.logoText}>Create Account</Text>
          </Animated.View>

          <Animated.View
            style={[styles.formCardContainer, formAnimatedStyle]}
            entering={FadeInUp.delay(400).duration(800)}
          >
            <Card 
              style={styles.formCard}
              variant="elevated"
            >
              <Text style={styles.title}>Join HealthAssistAI</Text>
              <Text style={styles.subtitle}>Create your account to get started</Text>
              
              <Input
                value={email}
                onChangeText={setEmail}
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={formError && !email ? formError : undefined}
                testID="register-email-input"
                leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />}
              />
              
              <Input
                value={password}
                onChangeText={setPassword}
                label="Password"
                placeholder="Create a strong password"
                secureTextEntry
                error={formError && !password ? formError : undefined}
                testID="register-password-input"
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />}
              />
              
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry
                error={formError && password !== confirmPassword ? formError : undefined}
                leftIcon={<Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.text.secondary} />}
              />
              
              {(formError || error) && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error} />
                  <Text style={styles.errorText}>{formError || error}</Text>
                </View>
              )}
              
              <Button
                title={loading ? 'Creating Account...' : 'Create Account'}
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                fullWidth
                size="lg"
                style={styles.button}
                testID="register-submit-btn"
                icon={loading ? undefined : <Ionicons name="person-add-outline" size={20} color="white" />}
              />
              
              <TouchableOpacity 
                style={styles.demoModeButton}
                onPress={() => register({ email: 'demo@example.com', password: 'password123' })}
              >
                <Text style={styles.demoModeText}>Skip Registration (Demo Mode)</Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>

          <Animated.View 
            style={styles.footer}
            entering={FadeInUp.delay(600).duration(800)}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.link}
              accessibilityRole="button"
            >
              <Text style={styles.linkTextPrompt}>Already have an account? </Text>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  logoText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  formCardContainer: {
    marginBottom: theme.spacing.sm,
  },
  formCard: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs / 2,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.error}15`,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  button: {
    marginVertical: theme.spacing.sm,
  },
  demoModeButton: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  demoModeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkTextPrompt: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});

export default RegisterScreen;
