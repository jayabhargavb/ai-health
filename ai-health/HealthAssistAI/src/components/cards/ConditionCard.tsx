import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Condition } from '../../types';
import { Card } from '../common/Card';
import { theme } from '../../constants/theme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ConditionCardProps {
  condition: Condition;
  testID?: string;
  onPress?: () => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition, testID, onPress }) => {
  const likelihood = Math.round(condition.likelihood * 100);
  
  // Determine severity level based on likelihood percentage
  const getSeverityInfo = (likelihood: number) => {
    if (likelihood >= 70) {
      return {
        color: theme.colors.error,
        icon: 'alert-circle-outline' as const,
        label: 'High likelihood'
      };
    } else if (likelihood >= 40) {
      return {
        color: theme.colors.warning,
        icon: 'warning-outline' as const,
        label: 'Moderate likelihood'
      };
    } else {
      return {
        color: theme.colors.success,
        icon: 'information-circle-outline' as const,
        label: 'Low likelihood'
      };
    }
  };

  const severityInfo = getSeverityInfo(likelihood);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${likelihood}%`, { duration: 800 }),
    };
  });

  return (
    <Card 
      style={styles.card} 
      testID={testID}
      variant="elevated"
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{condition.name}</Text>
        <View style={styles.likelihoodContainer}>
          <Text style={[styles.likelihoodLabel, { color: severityInfo.color }]}>
            {likelihood}%
          </Text>
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { backgroundColor: severityInfo.color },
            animatedProgressStyle
          ]} 
        />
      </View>
      
      <View style={styles.severityIndicator}>
        <Ionicons name={severityInfo.icon} size={16} color={severityInfo.color} />
        <Text style={[styles.severityText, { color: severityInfo.color }]}>
          {severityInfo.label}
        </Text>
      </View>

      <Text style={styles.description}>{condition.description}</Text>
      
      {condition.recommendedActions && condition.recommendedActions.length > 0 && (
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Recommended Actions:</Text>
          {condition.recommendedActions.map((action, idx) => (
            <View key={idx} style={styles.actionContainer}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={theme.colors.success} 
                style={styles.actionIcon}
              />
              <Text style={styles.actionItem}>{action}</Text>
            </View>
          ))}
        </View>
      )}
      
      {condition.icd10Code && (
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>ICD-10: {condition.icd10Code}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  likelihoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likelihoodLabel: {
    fontSize: theme.typography.bodyBold.fontSize,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  severityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  severityText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.body.lineHeight,
  },
  actionsSection: {
    marginTop: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  actionsTitle: {
    fontWeight: '600',
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  actionIcon: {
    marginRight: theme.spacing.xs,
    marginTop: 2,
  },
  actionItem: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    flex: 1,
    lineHeight: theme.typography.body.lineHeight,
  },
  tagContainer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
});
