import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Symptom } from '../../types';
import { Card } from '../common/Card';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SymptomCardProps {
  symptom: Symptom;
  onPress?: () => void;
  testID?: string;
}

export const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, onPress, testID }) => {
  // Calculate severity color
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return theme.colors.success;
    if (severity <= 6) return theme.colors.warning;
    return theme.colors.error;
  };

  // Get icon for symptom
  const getSymptomIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('head')) return 'medical-outline';
    if (lowercaseName.includes('fever') || lowercaseName.includes('temperature')) return 'thermometer-outline';
    if (lowercaseName.includes('cough') || lowercaseName.includes('breath')) return 'fitness-outline';
    if (lowercaseName.includes('throat')) return 'pulse-outline';
    if (lowercaseName.includes('stomach') || lowercaseName.includes('nausea')) return 'bandage-outline';
    if (lowercaseName.includes('pain') || lowercaseName.includes('ache')) return 'fitness-outline';
    if (lowercaseName.includes('fatigue') || lowercaseName.includes('tired')) return 'bed-outline';
    return 'medical-outline';
  };

  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name={getSymptomIcon(symptom.name)} size={24} color={theme.colors.primary} />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{symptom.name}</Text>
            <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(symptom.severity)}20` }]}>
              <Text style={[styles.severityText, { color: getSeverityColor(symptom.severity) }]}>
                {symptom.severity}/10
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            {symptom.duration && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
                <Text style={styles.detailText}>{symptom.duration}</Text>
              </View>
            )}
            
            {symptom.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{symptom.description}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    padding: 0,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontFamily: theme.typography.fontFamily.regular,
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  descriptionContainer: {
    marginTop: 4,
  },
  description: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.text.primary,
    fontStyle: 'italic',
  },
});
