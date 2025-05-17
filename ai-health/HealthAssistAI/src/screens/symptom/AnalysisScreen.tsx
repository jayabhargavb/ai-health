import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, SafeAreaView, ScrollView, Image, Animated, BackHandler, Alert } from 'react-native';
import { useSymptomAnalysis } from '../../hooks/useSymptomAnalysis';
import { ConditionCard } from '../../components/cards/ConditionCard';
import { Button } from '../../components/common/Button';
import { theme } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types/navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<MainTabParamList, 'Analysis'>;

const AnalysisScreen: React.FC<Props> = ({ navigation }) => {
  const { selectedSymptoms, analysis, loading, error, analyzeSymptoms, clearAnalysisError } = useSymptomAnalysis();
  const insets = useSafeAreaInsets();
  
  // Animation for the loading pulse effect
  const [animation] = useState(new Animated.Value(1));
  // Analysis steps display state
  const [analysisStep, setAnalysisStep] = useState(0);
  const totalSteps = 4;
  // Track how long the analysis has been running
  const [analysisStartTime, setAnalysisStartTime] = useState(0);
  const [analysisRunningTooLong, setAnalysisRunningTooLong] = useState(false);
  
  // Handle back button during analysis to allow canceling
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (loading) {
          Alert.alert(
            'Cancel Analysis?',
            'Are you sure you want to cancel the analysis and go back?',
            [
              { text: 'Continue Analysis', style: 'cancel' },
              { text: 'Cancel Analysis', onPress: () => navigation.navigate('Symptoms') }
            ]
          );
          return true; // Prevent default back behavior
        }
        return false; // Let default back behavior happen
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [loading, navigation])
  );

  // Start animation when loading
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Record start time of analysis
      setAnalysisStartTime(Date.now());
      setAnalysisRunningTooLong(false);
    } else {
      animation.setValue(1);
      setAnalysisStartTime(0);
    }
  }, [loading, animation]);
  
  // Check if analysis is taking too long
  useEffect(() => {
    if (loading && analysisStartTime > 0) {
      const checkTimeout = setTimeout(() => {
        const elapsedTime = Date.now() - analysisStartTime;
        if (elapsedTime > 20000) { // 20 seconds threshold
          setAnalysisRunningTooLong(true);
        }
      }, 20000); // Check after 20 seconds
      
      return () => clearTimeout(checkTimeout);
    }
  }, [loading, analysisStartTime]);
  
  // Progress through analysis steps
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setAnalysisStep(current => {
          // Loop through steps until analysis is complete
          const nextStep = (current + 1) % totalSteps;
          return nextStep;
        });
      }, 2500);
      
      return () => clearInterval(interval);
    } else {
      setAnalysisStep(0);
    }
  }, [loading]);
  
  // Analysis steps content
  const analysisSteps = [
    { title: 'Processing symptoms', subtitle: 'Analyzing your reported health data' },
    { title: 'Consulting medical database', subtitle: 'Checking potential conditions' },
    { title: 'Generating recommendations', subtitle: 'Based on symptom patterns' },
    { title: 'Finalizing analysis', subtitle: 'Almost there...' },
  ];

  // Start analysis when screen loads and we have symptoms but no analysis
  useEffect(() => {
    if (!analysis && !loading && !error && selectedSymptoms.length > 0) {
      analyzeSymptoms({ symptoms: selectedSymptoms });
    }
  }, [selectedSymptoms, analysis, loading, error, analyzeSymptoms]);

  // When we leave the screen, clear errors so we can retry next time
  useEffect(() => {
    return () => {
      if (error) clearAnalysisError();
    };
  }, [error, clearAnalysisError]);

  const handleRetry = () => {
    if (selectedSymptoms.length > 0) {
      analyzeSymptoms({ symptoms: selectedSymptoms });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
      >
        <Text style={styles.title}>Analysis</Text>
        
        {loading && (
          <View style={styles.centeredContainer}>
            <Animated.View style={{
              transform: [{ scale: animation }],
              marginBottom: 20,
              alignItems: 'center'
            }}>
              <View style={styles.pulseCircle}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            </Animated.View>
            
            <Text style={styles.loadingText}>
              {analysisSteps[analysisStep].title}
            </Text>
            <Text style={styles.subText}>
              {analysisSteps[analysisStep].subtitle}
            </Text>
            
            <View style={styles.progressContainer}>
              {Array.from(Array(totalSteps)).map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.progressDot,
                    index === analysisStep ? styles.activeDot : {}
                  ]} 
                />
              ))}
            </View>
            
            {analysisRunningTooLong && (
              <View style={styles.longRunningContainer}>
                <Text style={styles.longRunningText}>
                  This is taking longer than expected...
                </Text>
                <Button 
                  title="Go Back" 
                  variant="ghost"
                  onPress={() => navigation.navigate('Symptoms')}
                  style={styles.longRunningButton}
                />
              </View>
            )}
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={40} color={theme.colors.error} />
            <Text style={styles.errorTitle}>Analysis Issue</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>
              {analysis ? 'A partial analysis is available below.' : 'This could be due to network issues or our servers being busy.'}
            </Text>
            <View style={styles.errorButtonContainer}>
              <Button
                title="Try Again"
                onPress={handleRetry}
                style={styles.errorButton}
              />
              <Button
                title="Back to Symptoms"
                variant="ghost"
                onPress={() => navigation.navigate('Symptoms')}
                style={styles.errorButton}
              />
            </View>
          </View>
        )}
        
        {analysis && (
          <View style={styles.resultsContainer}>
            {error ? (
              <View style={styles.partialResultsBanner}>
                <Ionicons name="information-circle" size={20} color={theme.colors.warning} />
                <Text style={styles.partialResultsText}>Partial results available</Text>
              </View>
            ) : (
              <Text style={styles.sectionTitle}>Possible Conditions</Text>
            )}
            
            {analysis.possibleConditions.map(condition => (
              <ConditionCard key={condition.id} condition={condition} />
            ))}
            
            <Button
              title="View Detailed Results"
              onPress={() => navigation.navigate('Results', { analysisId: 'latest' })}
              style={styles.viewResultsButton}
              testID="view-results-btn"
            />
          </View>
        )}
        
        {!loading && !analysis && !error && selectedSymptoms.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="analytics-outline" size={80} color={`${theme.colors.primary}50`} />
            <Text style={styles.emptyTitle}>No symptoms to analyze</Text>
            <Text style={styles.emptyText}>
              Add some symptoms first to get an analysis of possible conditions
            </Text>
            <Button
              title="Add Symptoms"
              onPress={() => navigation.navigate('Symptoms')}
              style={styles.actionButton}
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
  scrollContent: {
    padding: theme.spacing.lg,
    minHeight: '100%',
  },
  title: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: `${theme.colors.primary}40`,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 20,
    color: theme.colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.error}10`,
    padding: 24,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  errorButtonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  errorButton: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 18,
    color: theme.colors.error,
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
  },
  errorHint: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.regular,
  },
  longRunningContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  longRunningText: {
    color: theme.colors.warning,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    marginBottom: 12,
  },
  longRunningButton: {
    minWidth: 100,
  },
  partialResultsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.warning}20`,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    marginBottom: 16,
  },
  partialResultsText: {
    color: theme.colors.warning,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  resultsContainer: {
    marginBottom: theme.spacing.lg,
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginTop: 24,
    marginBottom: 4,
  },
  subText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  button: {
    minWidth: 120,
  },
  actionButton: {
    minWidth: 200,
  },
  viewResultsButton: {
    marginTop: theme.spacing.lg,
  },
});

export default AnalysisScreen;
