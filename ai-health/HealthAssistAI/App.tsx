import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { initDatabase } from './src/services/storage/databaseService';
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from './src/constants/theme';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { changeBarColors } from 'react-native-immersive-bars';
import * as SystemUI from 'expo-system-ui';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize the database
        await initDatabase().catch(error => 
          console.error('Failed to initialize database:', error)
        );

        // Load fonts
        await Font.loadAsync({
          'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        }).then(() => {
          console.log('Fonts loaded successfully');
        }).catch(e => {
          console.warn('Error loading fonts:', e);
        });

        // Artificially delay for a smooth splash experience
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error loading assets:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
    
    // Hide home indicator
    if (Platform.OS === 'ios') {
      // On iOS, we rely on infoPlist settings in app.json
      // And manage background color with SystemUI
      SystemUI.setBackgroundColorAsync(theme.colors.background);
    } else if (Platform.OS === 'android') {
      // For Android, use immersive bars to make bottom nav bar transparent
      changeBarColors(false, 'transparent');
    }
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          >
            <ErrorBoundary>
              <StatusBar style="dark" />
              <AppNavigator />
            </ErrorBoundary>
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
