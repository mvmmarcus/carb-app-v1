import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import Navigation from '#/navigation';
import { AuthProvider } from '#/contexts/auth';

import { theme } from '#/styles/theme';

EStyleSheet.build(theme);

const App = () => {
  const { $secondary } = theme;

  return (
    <PaperProvider>
      <StatusBar barStyle="default" backgroundColor={$secondary} />
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
