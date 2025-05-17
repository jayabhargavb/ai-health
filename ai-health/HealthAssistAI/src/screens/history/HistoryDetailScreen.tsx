import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { SymptomCard } from '../../components/cards/SymptomCard';
import { ConditionCard } from '../../components/cards/ConditionCard';
import { theme } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../../types/navigation.types';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryDetail'>;

const HistoryDetailScreen: React.FC<Props> = ({ route }) => {
  const { check } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Details</Text>
      <Text style={styles.sectionTitle}>Symptoms</Text>
      <FlatList
        data={check.symptoms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <SymptomCard symptom={item} />}
        style={styles.list}
      />
      <Text style={styles.sectionTitle}>Analysis</Text>
      <FlatList
        data={check.analysis.possibleConditions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ConditionCard condition={item} />}
        style={styles.list}
      />
      <Text style={styles.meta}>
        Severity: {check.metadata.severity} | Confidence: {Math.round(check.metadata.confidence * 100)}%
      </Text>
      <Text style={styles.disclaimer}>{check.analysis.disclaimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  list: {
    marginBottom: theme.spacing.md,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.sm,
  },
  disclaimer: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
});

export default HistoryDetailScreen;
