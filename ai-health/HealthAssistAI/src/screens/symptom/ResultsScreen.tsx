import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import { useSymptomAnalysis } from '../../hooks/useSymptomAnalysis';
import { ConditionCard } from '../../components/cards/ConditionCard';
import { Button } from '../../components/common/Button';
import { theme } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types/navigation.types';
import { useHistory } from '../../hooks/useHistory';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MainTabParamList, 'Results'>;

const ResultsScreen: React.FC<Props> = ({ navigation }) => {
  const { analysis, selectedSymptoms, clearSymptoms } = useSymptomAnalysis();
  const { addSymptomCheck } = useHistory();
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    if (analysis && selectedSymptoms.length > 0) {
      addSymptomCheck({
        id: `${Date.now()}`,
        userId: 'current', // Replace with real userId
        timestamp: new Date(),
        symptoms: selectedSymptoms,
        analysis,
        metadata: {
          severity: 'medium', // Replace with real value if available
          confidence: 0.9, // Replace with real value if available
        },
      });
      clearSymptoms();
      navigation.navigate('History');
    }
  };

  if (!analysis) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={[
            styles.emptyStateContainer,
            { paddingBottom: insets.bottom + 80 }
          ]} 
          bounces={true}
        >
          <Ionicons name="documents-outline" size={80} color={`${theme.colors.primary}50`} />
          <Text style={styles.emptyTitle}>No analysis results yet</Text>
          <Text style={styles.emptyText}>
            Complete a symptom analysis first to see results here
          </Text>
          <Button
            title="Go to Symptoms"
            onPress={() => navigation.navigate('Symptoms')}
            style={styles.actionButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Results</Text>
          <Text style={styles.subtitle}>Based on your symptoms</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Possible Conditions</Text>
          {analysis.possibleConditions.map(condition => (
            <ConditionCard key={condition.id} condition={condition} />
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {analysis.recommendations.map((rec, idx) => (
            <View key={idx} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} style={styles.recommendationIcon} />
              <Text style={styles.recommendation}>{rec}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.urgencyContainer}>
          <Text style={styles.urgencyLabel}>Urgency Level:</Text>
          <View style={[
            styles.urgencyBadge, 
            { 
              backgroundColor: analysis.urgencyLevel === 'urgent' 
                ? `${theme.colors.error}15` 
                : analysis.urgencyLevel === 'soon'
                  ? `${theme.colors.warning}15`
                  : `${theme.colors.success}15`
            }
          ]}>
            <Text style={[
              styles.urgencyText,
              { 
                color: analysis.urgencyLevel === 'urgent' 
                  ? theme.colors.error 
                  : analysis.urgencyLevel === 'soon'
                    ? theme.colors.warning
                    : theme.colors.success
              }
            ]}>
              {analysis.urgencyLevel.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>{analysis.disclaimer}</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <Button
            title="Save to History"
            onPress={handleSave}
            style={styles.saveButton}
            testID="save-history-btn"
            icon={<Ionicons name="save-outline" size={18} color="white" style={{marginRight: 8}} />}
          />
          
          <Button
            title="New Check"
            onPress={() => { clearSymptoms(); navigation.navigate('Symptoms'); }}
            variant="outline"
            style={styles.newCheckButton}
            testID="new-check-btn"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.h2.fontSize,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 8,
  },
  recommendationIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  recommendation: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  urgencyLabel: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginRight: 12,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  urgencyText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 14,
  },
  disclaimerContainer: {
    backgroundColor: `${theme.colors.info}10`,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 24,
  },
  disclaimer: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionContainer: {
    marginBottom: 20,
  },
  saveButton: {
    marginBottom: 12,
  },
  newCheckButton: {
    marginBottom: 8,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    paddingTop: 100,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 22,
  },
  actionButton: {
    minWidth: 200,
  },
});

export default ResultsScreen;
