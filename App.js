import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import Navigation from './src/navigation';
import { AuthProvider } from './src/contexts/auth';

import { theme } from './src/styles/theme';
import { AppProvider } from './src/contexts/user';

EStyleSheet.build(theme);

const App = () => {
  const { $secondary } = theme;

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <PaperProvider>
      <StatusBar barStyle="default" backgroundColor={$secondary} />
      <SafeAreaProvider>
        <NavigationContainer>
          <AppProvider>
            <AuthProvider>
              <Navigation />
            </AuthProvider>
          </AppProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
