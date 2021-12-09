import 'react-native-gesture-handler';

import React from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import TabNavigator from '../src/navigation/TabNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import UndismissableModal from './components/UndismissableModal';
import { theme } from './styles/theme';
import { BluetoothProvider } from './contexts/bluetooth';
import { StatusBar } from 'react-native';

EStyleSheet.build(theme);

if (__DEV__) {
  require('react-devtools');
}

const App = () => {
  const isAuth = false;

  return (
    <PaperProvider>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuth ? (
            <BluetoothProvider>
              <TabNavigator />
              <UndismissableModal />
            </BluetoothProvider>
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
