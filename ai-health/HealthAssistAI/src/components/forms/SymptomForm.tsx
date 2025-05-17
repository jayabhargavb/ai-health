import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Symptom } from '../../types';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SymptomFormProps {
  onSubmit: (symptom: Symptom) => void;
  loading?: boolean;
  testID?: string;
}

// Common symptoms for quick selection
const COMMON_SYMPTOMS = [
  { name: 'Headache', icon: 'medical-outline' },
  { name: 'Fever', icon: 'thermometer-outline' },
  { name: 'Cough', icon: 'fitness-outline' },
  { name: 'Fatigue', icon: 'bed-outline' },
  { name: 'Sore Throat', icon: 'pulse-outline' },
  { name: 'Nausea', icon: 'medkit-outline' },
  { name: 'Muscle Pain', icon: 'fitness-outline' },
  { name: 'Stomach Pain', icon: 'bandage-outline' },
  { name: 'Shortness of Breath', icon: 'fitness-outline' },
];

// Severity levels with descriptions
const SEVERITY_LEVELS = [
  { level: 1, label: 'Very Mild' },
  { level: 3, label: 'Mild' },
  { level: 5, label: 'Moderate' },
  { level: 7, label: 'Severe' },
  { level: 10, label: 'Very Severe' },
];

// Duration options
const DURATION_OPTIONS = [
  '< 1 day',
  '1-2 days',
  '3-5 days',
  '1 week',
  '2+ weeks',
];

export const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit, loading, testID }) => {
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<number | null>(null);
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubmit = () => {
    // Use custom input or selected common symptom
    const symptomName = name.trim();
    
    if (!symptomName) {
      setError('Symptom name is required');
      return;
    }
    
    if (severity === null) {
      setError('Please select a severity level');
      return;
    }
    
    setError(null);
    onSubmit({
      id: `${symptomName.toLowerCase()}-${Date.now()}`,
      name: symptomName,
      severity: severity,
      duration: duration || undefined,
      description: description.trim() || undefined,
    });
    
    // Reset form
    setName('');
    setSeverity(null);
    setDuration('');
    setDescription('');
    setShowCustomInput(false);
  };

  const selectCommonSymptom = (symptomName: string) => {
    setName(symptomName);
    setShowCustomInput(false);
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Common Symptoms Section */}
      <Text style={styles.sectionTitle}>Common Symptoms</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commonSymptomsContainer}>
        {COMMON_SYMPTOMS.map(symptom => (
          <TouchableOpacity
            key={symptom.name}
            style={[
              styles.symptomButton,
              name === symptom.name && styles.selectedSymptomButton
            ]}
            onPress={() => selectCommonSymptom(symptom.name)}
          >
            <Ionicons 
              name={symptom.icon as any} 
              size={24} 
              color={name === symptom.name ? theme.colors.primary : theme.colors.text.secondary} 
            />
            <Text 
              style={[
                styles.symptomButtonText,
                name === symptom.name && styles.selectedSymptomText
              ]}
            >
              {symptom.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.symptomButton,
            showCustomInput && styles.selectedSymptomButton
          ]}
          onPress={() => setShowCustomInput(true)}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={24} 
            color={showCustomInput ? theme.colors.primary : theme.colors.text.secondary} 
          />
          <Text 
            style={[
              styles.symptomButtonText,
              showCustomInput && styles.selectedSymptomText
            ]}
          >
            Other
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Symptom Input */}
      {showCustomInput && (
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Enter symptom name"
          error={error && !name.trim() ? error : undefined}
          testID="symptom-name-input"
          style={styles.customInput}
        />
      )}

      {/* Severity Selection */}
      <Text style={styles.sectionTitle}>Severity</Text>
      <View style={styles.severityContainer}>
        {SEVERITY_LEVELS.map(({ level, label }) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.severityButton,
              severity === level && styles.selectedSeverityButton
            ]}
            onPress={() => setSeverity(level)}
          >
            <Text style={[
              styles.severityButtonText,
              severity === level && styles.selectedSeverityText
            ]}>
              {label}
            </Text>
            <Text style={[
              styles.severityLevelText,
              severity === level && styles.selectedSeverityText
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Duration Selection */}
      <Text style={styles.sectionTitle}>Duration</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.durationContainer}>
        {DURATION_OPTIONS.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.durationButton,
              duration === option && styles.selectedDurationButton
            ]}
            onPress={() => setDuration(option)}
          >
            <Text style={[
              styles.durationButtonText,
              duration === option && styles.selectedDurationText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Description Input (Optional) */}
      <Text style={styles.sectionTitle}>Description (Optional)</Text>
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Add more details about your symptom"
        multiline
        style={styles.descriptionInput}
        testID="symptom-description-input"
      />

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Submit Button */}
      <Button
        title={loading ? 'Adding...' : 'Add Symptom'}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
        testID="symptom-submit-btn"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.regular,
  },
  commonSymptomsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  symptomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginRight: 8,
    minWidth: 80,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  selectedSymptomButton: {
    backgroundColor: `${theme.colors.primary}15`,
    borderColor: theme.colors.primary,
  },
  symptomButtonText: {
    marginTop: 4,
    color: theme.colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.regular,
  },
  selectedSymptomText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  severityButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: '18%',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  selectedSeverityButton: {
    backgroundColor: `${theme.colors.primary}15`,
    borderColor: theme.colors.primary,
  },
  severityButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.regular,
  },
  severityLevelText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    fontFamily: theme.typography.fontFamily.regular,
  },
  selectedSeverityText: {
    color: theme.colors.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  durationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  selectedDurationButton: {
    backgroundColor: `${theme.colors.primary}15`,
    borderColor: theme.colors.primary,
  },
  durationButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
  },
  selectedDurationText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  customInput: {
    marginBottom: 16,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.error}15`,
    padding: 10,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginLeft: 6,
    fontFamily: theme.typography.fontFamily.regular,
  },
  button: {
    marginTop: 0,
    marginBottom: 12,
  },
});
