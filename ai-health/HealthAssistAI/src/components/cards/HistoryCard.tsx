import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SymptomCheck } from '../../types';
import { Card } from '../common/Card';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface HistoryCardProps {
  check: SymptomCheck;
  onPress?: () => void;
  testID?: string;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ check, onPress, testID }) => {
  const date = new Date(check.timestamp);
  const dateString = date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const timeString = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const symptomSummary = check.symptoms.map(s => s.name).join(', ');

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
      default:
        return theme.colors.success;
    }
  };

  const severityColor = getSeverityColor(check.metadata.severity);

  return (
    <Card 
      style={styles.card} 
      testID={testID}
      onPress={onPress}
      variant="elevated"
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: `${severityColor}20` }]}>
            <Ionicons name="pulse" size={24} color={severityColor} />
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.symptoms} numberOfLines={1} ellipsizeMode="tail">
              {symptomSummary}
            </Text>
            <View style={[styles.severityBadge, { backgroundColor: `${severityColor}20` }]}>
              <Text style={[styles.severityText, { color: severityColor }]}>
                {check.metadata.severity}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.dateTimeContainer}>
              <Ionicons name="calendar-outline" size={12} color={theme.colors.text.secondary} />
              <Text style={styles.date}>{dateString}</Text>
            </View>
            <View style={styles.dateTimeContainer}>
              <Ionicons name="time-outline" size={12} color={theme.colors.text.secondary} />
              <Text style={styles.date}>{timeString}</Text>
            </View>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence:</Text>
              <Text style={styles.confidence}>{Math.round(check.metadata.confidence * 100)}%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  date: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  severityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.full,
  },
  severityText: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.text.secondary,
    marginRight: 4,
  },
  confidence: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  symptoms: {
    fontSize: theme.typography.bodyBold.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  arrowContainer: {
    marginLeft: theme.spacing.sm,
  }
}); 