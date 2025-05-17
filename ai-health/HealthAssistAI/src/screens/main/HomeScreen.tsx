import React, { useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList, 
  ScrollView, 
  StatusBar, 
  Pressable,
  useWindowDimensions,
  Platform 
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { HistoryCard } from '../../components/cards/HistoryCard';
import { theme } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types/navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MainTabParamList, 'Home'>;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const history = useSelector((state: RootState) => state.history.history);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 100],
        [1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        { 
          scale: interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.9],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  // Get first name from email or use the word "there" as fallback
  const firstName = user?.email 
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'there';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <AnimatedScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.headerContent, headerAnimatedStyle]}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{firstName}</Text>
        </Animated.View>

        <View style={styles.bannerContainer}>
          <Card variant="default" style={styles.bannerCard}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContent}>
                <Text style={styles.bannerTitle}>How are you feeling today?</Text>
                <Text style={styles.bannerSubtitle}>
                  Track your symptoms and get personalized advice
                </Text>
                <Button
                  title="Start Symptom Check"
                  variant="primary"
                  size="md"
                  onPress={() => navigation.navigate('Symptoms')}
                  testID="start-symptom-check-btn"
                  icon={<Ionicons name="medkit-outline" size={20} color="white" />}
                  iconPosition="left"
                  style={styles.bannerButton}
                />
              </View>
              <View style={styles.imageContainer}>
                <Ionicons 
                  name="medkit" 
                  size={80} 
                  color={theme.colors.primary} 
                />
              </View>
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.quickActionsContainer}>
            <Pressable 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Symptoms')}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.quickActionText}>New Check</Text>
            </Pressable>
            <Pressable 
              style={styles.quickAction}
              onPress={() => navigation.navigate('History')}>
              <View style={[styles.iconContainer, { backgroundColor: '#E6F5FA' }]}>
                <Ionicons name="time-outline" size={24} color={theme.colors.info} />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </Pressable>
            <Pressable 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Home')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="person-outline" size={24} color={theme.colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Profile</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Checks</Text>
            <Pressable onPress={() => navigation.navigate('History')}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          {history.length > 0 ? (
            history.slice(0, 3).map(item => (
              <HistoryCard
                key={item.id}
                check={item}
                onPress={() => navigation.navigate('History')}
              />
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="clipboard-outline" size={40} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyText}>No recent checks yet.</Text>
              <Text style={styles.emptySubtext}>
                Start a symptom check to receive health guidance
              </Text>
            </Card>
          )}
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </AnimatedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerContent: {
    marginBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs / 2,
  },
  userName: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  bannerContainer: {
    marginBottom: theme.spacing.lg,
  },
  bannerCard: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primaryLight,
    padding: 0,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  bannerTextContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  bannerSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  bannerButton: {
    alignSelf: 'flex-start',
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    color: theme.colors.text.link,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    maxWidth: '30%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});

export default HomeScreen;
