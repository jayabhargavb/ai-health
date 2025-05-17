import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loadTokenFromStorage } from '../services/api/apiClient';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../constants/theme';

const Stack = createNativeStackNavigator();

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const AppNavigator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // On mount, load token from storage (if any)
    loadTokenFromStorage().finally(() => setLoading(false));
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
