import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '../screens/history/HistoryScreen';
import HistoryDetailScreen from '../screens/history/HistoryDetailScreen';
import { HistoryStackParamList } from '../types/navigation.types';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

const HistoryStackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
      name="HistoryMain" 
      component={HistoryScreen} 
    />
    <Stack.Screen 
      name="HistoryDetail" 
      component={HistoryDetailScreen} 
      options={{
        headerShown: true,
        title: 'Check Details',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

export default HistoryStackNavigator; 