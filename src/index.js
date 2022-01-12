import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import { AuthProvider } from './contexts/auth';
import { BluetoothProvider } from './contexts/bluetooth';
import TabNavigator from '../src/navigation/TabNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import UndismissableModal from './components/UndismissableModal';

import { theme } from './styles/theme';

EStyleSheet.build(theme);

if (__DEV__) {
  require('react-devtools');
}

const App = () => {
  const isAuth = true;

  return (
    <PaperProvider>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            {isAuth ? (
              <BluetoothProvider>
                <TabNavigator />
                <UndismissableModal />
              </BluetoothProvider>
            ) : (
              <AuthNavigator />
            )}
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
