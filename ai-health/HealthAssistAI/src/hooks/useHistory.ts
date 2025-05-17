import { useState, useEffect, useCallback } from 'react';
import { getHistory, addToHistory } from '../services/api/symptomService';
import { SymptomCheck } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useHistory = () => {
  const [history, setHistory] = useState<SymptomCheck[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Get analysis completion state from Redux to trigger history refresh
  const { analysisCompleted } = useSelector((state: RootState) => state.symptoms);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a symptom check to history
  const addSymptomCheck = useCallback(async (check: SymptomCheck) => {
    try {
      await addToHistory(check);
      // Refresh history after adding
      fetchHistory();
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  }, [fetchHistory]);

  // Refresh history when analysis is completed
  useEffect(() => {
    if (analysisCompleted) {
      fetchHistory();
    }
  }, [analysisCompleted, fetchHistory]);

  // Initial load
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    fetchHistory,
    addSymptomCheck,
  };
}; 