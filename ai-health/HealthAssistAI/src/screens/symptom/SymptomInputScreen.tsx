import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { SymptomForm } from '../../components/forms/SymptomForm';
import { SymptomCard } from '../../components/cards/SymptomCard';
import { Button } from '../../components/common/Button';
import { theme } from '../../constants/theme';
import { useSymptomAnalysis } from '../../hooks/useSymptomAnalysis';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types/navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MainTabParamList, 'Symptoms'>;

const SymptomInputScreen: React.FC<Props> = ({ navigation }) => {
  const { selectedSymptoms, setSelectedSymptoms, clearSymptoms } = useSymptomAnalysis();
  const [localSymptoms, setLocalSymptoms] = useState(selectedSymptoms);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleAddSymptom = (symptom: any) => {
    setLocalSymptoms([...localSymptoms, symptom]);
    
    // Scroll to added symptoms section after adding
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleNext = () => {
    setSelectedSymptoms(localSymptoms);
    navigation.navigate('Analysis', { symptoms: localSymptoms.map(s => s.name) });
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 } // Extra padding to ensure scrollable area
        ]}
        bounces={true}
        alwaysBounceVertical={true}
        overScrollMode="always"
      >
        <Text style={styles.title}>Describe Your Symptoms</Text>
        
        <View style={styles.formContainer}>
          <SymptomForm onSubmit={handleAddSymptom} />
        </View>
        
        {/* Scroll indicator if symptoms are present */}
        {localSymptoms.length > 0 && (
          <TouchableOpacity 
            style={styles.scrollIndicator}
            onPress={scrollToBottom}
            activeOpacity={0.7}
          >
            <Text style={styles.scrollIndicatorText}>Scroll to view added symptoms</Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        
        <View style={styles.symptomsListContainer}>
          {localSymptoms.length > 0 && (
            <Text style={styles.sectionTitle}>Added Symptoms</Text>
          )}
          
          {localSymptoms.length > 0 ? (
            <View>
              {localSymptoms.map(symptom => (
                <SymptomCard key={symptom.id} symptom={symptom} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Add symptoms using the options above
            </Text>
          )}
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Analyze Symptoms"
            onPress={handleNext}
            disabled={localSymptoms.length === 0}
            style={styles.analyzeButton}
            testID="analyze-btn"
          />
          
          {localSymptoms.length > 0 && (
            <Button
              title="Clear All"
              onPress={() => { setLocalSymptoms([]); clearSymptoms(); }}
              variant="ghost"
              style={styles.clearButton}
              testID="clear-btn"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    minHeight: '100%',
  },
  title: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  formContainer: {
    marginBottom: theme.spacing.md,
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.primary}10`,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    marginTop: 8,
    marginBottom: 16,
  },
  scrollIndicatorText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    marginRight: 4,
  },
  symptomsListContainer: {
    marginBottom: theme.spacing.lg,
  },
  symptomList: {
    flexGrow: 0,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    marginTop: theme.spacing.sm,
  },
  analyzeButton: {
    marginBottom: theme.spacing.sm,
  },
  clearButton: {
    marginBottom: theme.spacing.sm,
  },
});

export default SymptomInputScreen;
