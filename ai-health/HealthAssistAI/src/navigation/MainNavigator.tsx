import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation.types';
import HomeScreen from '../screens/main/HomeScreen';
import SymptomInputScreen from '../screens/symptom/SymptomInputScreen';
import AnalysisScreen from '../screens/symptom/AnalysisScreen';
import ResultsScreen from '../screens/symptom/ResultsScreen';
import HistoryStackNavigator from './HistoryStackNavigator';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator();

const tabBarStyles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    height: Platform.OS === 'ios' ? 88 : 68,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    marginTop: 0,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  icon: {
    marginBottom: 0,
  }
});

const MainNavigator: React.FC = () => (
  <Tab.Navigator 
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.text.secondary,
      tabBarStyle: tabBarStyles.tabBar,
      tabBarLabelStyle: tabBarStyles.label,
      tabBarIconStyle: tabBarStyles.icon,
      tabBarShowLabel: true,
      tabBarHideOnKeyboard: true,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Symptoms') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'Analysis') {
          iconName = focused ? 'pulse' : 'pulse-outline';
        } else if (route.name === 'Results') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'time' : 'time-outline';
        }

        return <Ionicons name={iconName} size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
    />
    <Tab.Screen 
      name="Symptoms" 
      component={SymptomInputScreen}
    />
    <Tab.Screen 
      name="Analysis" 
      component={AnalysisScreen} 
    />
    <Tab.Screen 
      name="Results" 
      component={ResultsScreen} 
    />
    <Tab.Screen 
      name="History" 
      component={HistoryStackNavigator} 
    />
  </Tab.Navigator>
);

export default MainNavigator;
