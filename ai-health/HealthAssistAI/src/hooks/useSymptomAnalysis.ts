import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSelectedSymptoms, clearSymptoms, analyzeSymptoms, clearAnalysisError } from '../store/slices/symptomsSlice';
import { Symptom } from '../types';
import { AnalyzeRequest } from '../types/api.types';

export const useSymptomAnalysis = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSymptoms, analysis, loading, error, analysisCompleted } = useSelector((state: RootState) => state.symptoms);

  return {
    selectedSymptoms,
    analysis,
    loading,
    error,
    analysisCompleted,
    setSelectedSymptoms: (symptoms: Symptom[]) => dispatch(setSelectedSymptoms(symptoms)),
    clearSymptoms: () => dispatch(clearSymptoms()),
    analyzeSymptoms: (payload: AnalyzeRequest) => dispatch(analyzeSymptoms(payload)),
    clearAnalysisError: () => dispatch(clearAnalysisError()),
  };
}; 