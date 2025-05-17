import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { useHistory } from '../../hooks/useHistory';
import { HistoryCard } from '../../components/cards/HistoryCard';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../../types/navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen: React.FC = () => {
  const { history, fetchHistory, loading } = useHistory();
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>>();
  const insets = useSafeAreaInsets();
  
  // Fetch history data on mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = () => {
    fetchHistory();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer, 
          { 
            paddingTop: 16, 
            paddingBottom: insets.bottom + 100 
          }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
      >
        <Text style={styles.title}>History</Text>
        
        {history.length > 0 ? (
          history.map(item => (
            <HistoryCard
              key={item.id}
              check={item}
              onPress={() => navigation.navigate('HistoryDetail', { check: item })}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No health checks yet</Text>
            <Text style={styles.emptyText}>
              Your completed symptom checks and analyses will appear here
            </Text>
            <Button
              title="Start a New Check"
              onPress={() => {
                // Navigate to root tab navigation, then to Symptoms
                const rootNav = navigation.getParent()?.getParent();
                if (rootNav) {
                  rootNav.navigate('Symptoms');
                }
              }}
              style={styles.startButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    minWidth: 200,
  },
});

export default HistoryScreen;
